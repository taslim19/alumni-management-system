const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const AlumniProfile = require('../models/AlumniProfile');
const Event = require('../models/Event');
const JobPost = require('../models/JobPost');
const Announcement = require('../models/Announcement');
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
    cb(null, `profile-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
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
    const profile = await AlumniProfile.findOne({ user: req.user._id })
      .populate('user', 'name email profilePhoto');

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
    let profile = await AlumniProfile.findOne({ user: req.user._id });

    if (!profile) {
      // Create profile if it doesn't exist
      profile = new AlumniProfile({
        user: req.user._id,
        ...req.body
      });
    } else {
      Object.assign(profile, req.body);
    }

    await profile.save();
    await profile.populate('user', 'name email profilePhoto');

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

    const user = await User.findById(req.user._id);
    
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
    const searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { 'user.name': { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { position: { $regex: query, $options: 'i' } }
      ];
    }

    if (department) {
      searchQuery.department = { $regex: department, $options: 'i' };
    }

    if (graduationYear) {
      searchQuery.graduationYear = parseInt(graduationYear);
    }

    if (company) {
      searchQuery.company = { $regex: company, $options: 'i' };
    }

    // Only show approved alumni
    const approvedUsers = await User.find({ role: 'alumni', isApproved: true }).select('_id');
    searchQuery.user = { $in: approvedUsers.map(u => u._id) };

    const profiles = await AlumniProfile.find(searchQuery)
      .populate('user', 'name email profilePhoto')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ graduationYear: -1 });

    const total = await AlumniProfile.countDocuments(searchQuery);

    res.json({
      profiles,
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
    const events = await Event.find({ isActive: true })
      .populate('organizer', 'name email')
      .sort({ date: 1 });

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
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    if (event.maxAttendees && event.registeredUsers.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

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
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.registeredUsers = event.registeredUsers.filter(
      id => id.toString() !== req.user._id.toString()
    );
    await event.save();

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

    const job = new JobPost({
      ...req.body,
      postedBy: req.user._id
    });

    await job.save();
    await job.populate('postedBy', 'name email');

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
    const jobs = await JobPost.find({ isActive: true })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

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
    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'alumni' }
      ]
    })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

