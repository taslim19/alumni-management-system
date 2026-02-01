const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { User, AlumniProfile, Event, JobPost, Announcement, EventRegistration } = require('../models');
const { authenticate, requireApproval, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for profile photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// All alumni routes require authentication
router.use(authenticate);
router.use(authorize('alumni'));
router.use(requireApproval);

// @route   GET /api/alumni/profile
// @desc    Get alumni profile
// @access  Private/Alumni
router.get('/profile', async (req, res) => {
  try {
    const profile = await AlumniProfile.findOne({
      where: { userId: req.user.id },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'profilePhoto']
      }]
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/alumni/profile
// @desc    Update alumni profile
// @access  Private/Alumni
router.put('/profile', async (req, res) => {
  try {
    let profile = await AlumniProfile.findOne({ where: { userId: req.user.id } });

    const profileData = { ...req.body };
    if (profileData.location) {
      profileData.city = profileData.location.city || '';
      profileData.state = profileData.location.state || '';
      profileData.country = profileData.location.country || '';
      delete profileData.location;
    }

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await AlumniProfile.create({
        userId: req.user.id,
        ...profileData
      });
    } else {
      await profile.update(profileData);
    }

    await profile.reload({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'profilePhoto']
      }]
    });

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/alumni/profile/photo
// @desc    Upload profile photo
// @access  Private/Alumni
router.post('/profile/photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByPk(req.user.id);
    
    // Delete old photo if exists
    if (user.profilePhoto) {
      const oldPhotoPath = path.join(process.env.UPLOAD_PATH || './uploads', path.basename(user.profilePhoto));
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    user.profilePhoto = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Profile photo uploaded successfully', profilePhoto: user.profilePhoto });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/alumni/search
// @desc    Search alumni
// @access  Private/Alumni
router.get('/search', async (req, res) => {
  try {
    const { query, department, graduationYear, company, page = 1, limit = 10 } = req.query;
    const whereClause = {};

    if (query) {
      whereClause[Op.or] = [
        { '$User.name$': { [Op.like]: `%${query}%` } },
        { company: { [Op.like]: `%${query}%` } },
        { position: { [Op.like]: `%${query}%` } }
      ];
    }

    if (department) {
      whereClause.department = { [Op.like]: `%${department}%` };
    }

    if (graduationYear) {
      whereClause.graduationYear = parseInt(graduationYear);
    }

    if (company) {
      whereClause.company = { [Op.like]: `%${company}%` };
    }

    const profiles = await AlumniProfile.findAll({
      where: whereClause,
      include: [{
        model: User,
        where: { role: 'alumni', isApproved: true },
        attributes: ['id', 'name', 'email', 'profilePhoto']
      }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['graduationYear', 'DESC']]
    });

    const total = await AlumniProfile.count({
      where: whereClause,
      include: [{
        model: User,
        where: { role: 'alumni', isApproved: true }
      }]
    });

    res.json({
      profiles: profiles.map(p => ({
        _id: p.id,
        user: p.User,
        graduationYear: p.graduationYear,
        department: p.department,
        company: p.company,
        position: p.position,
        location: {
          city: p.city,
          state: p.state,
          country: p.country
        },
        bio: p.bio
      })),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/alumni/events
// @desc    Get all events
// @access  Private/Alumni
router.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { isActive: true },
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'name', 'email']
      }, {
        model: User,
        as: 'registeredUsers',
        attributes: ['id', 'name', 'email', 'profilePhoto'],
        through: { attributes: [] }
      }],
      order: [['date', 'ASC']]
    });

    res.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/alumni/events/:id/register
// @desc    Register for event
// @access  Private/Alumni
router.post('/events/:id/register', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'registeredUsers',
        attributes: ['id']
      }]
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existing = await EventRegistration.findOne({
      where: { eventId: event.id, userId: req.user.id }
    });
    if (existing) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    if (event.maxAttendees && event.registeredUsers.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    await EventRegistration.create({
      eventId: event.id,
      userId: req.user.id
    });

    await event.reload({
      include: [{
        model: User,
        as: 'registeredUsers',
        attributes: ['id', 'name', 'email', 'profilePhoto']
      }]
    });

    res.json({ message: 'Successfully registered for event', event });
  } catch (error) {
    console.error('Register event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/alumni/events/:id/unregister
// @desc    Unregister from event
// @access  Private/Alumni
router.post('/events/:id/unregister', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await EventRegistration.destroy({
      where: { eventId: event.id, userId: req.user.id }
    });

    await event.reload({
      include: [{
        model: User,
        as: 'registeredUsers',
        attributes: ['id', 'name', 'email', 'profilePhoto']
      }]
    });

    res.json({ message: 'Successfully unregistered from event', event });
  } catch (error) {
    console.error('Unregister event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/alumni/jobs
// @desc    Post a job opportunity
// @access  Private/Alumni
router.post('/jobs', [
  body('title').notEmpty().withMessage('Title is required'),
  body('company').notEmpty().withMessage('Company is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('contactEmail').isEmail().withMessage('Valid contact email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const jobData = { ...req.body };
    if (jobData.salary) {
      jobData.salaryMin = jobData.salary.min || null;
      jobData.salaryMax = jobData.salary.max || null;
      jobData.salaryCurrency = jobData.salary.currency || 'USD';
      delete jobData.salary;
    }

    const job = await JobPost.create({
      ...jobData,
      postedById: req.user.id
    });

    await job.reload({
      include: [{
        model: User,
        as: 'postedBy',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    console.error('Post job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/alumni/jobs
// @desc    Get all job postings
// @access  Private/Alumni
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await JobPost.findAll({
      where: { isActive: true },
      include: [{
        model: User,
        as: 'postedBy',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ jobs });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/alumni/announcements
// @desc    Get announcements
// @access  Private/Alumni
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { targetAudience: { [Op.like]: '%all%' } },
          { targetAudience: { [Op.like]: '%alumni%' } }
        ]
      },
      include: [{
        model: User,
        as: 'postedBy',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    res.json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

