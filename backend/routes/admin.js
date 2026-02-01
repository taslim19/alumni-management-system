const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { User, AlumniProfile, Event, JobPost, Announcement, EventRegistration } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
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

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    const { Sequelize } = require('sequelize');
    const totalAlumni = await User.count({ where: { role: 'alumni' } });
    const approvedAlumni = await User.count({ where: { role: 'alumni', isApproved: true } });
    const pendingAlumni = await User.count({ where: { role: 'alumni', isApproved: false } });
    const totalStudents = await User.count({ where: { role: 'student' } });
    const activeUsers = await User.count({ where: { isActive: true } });
    const totalEvents = await Event.count();
    const upcomingEvents = await Event.count({ where: { date: { [Op.gte]: new Date() } } });
    const totalJobs = await JobPost.count({ where: { isActive: true } });
    const recentRegistrations = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'isApproved', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      statistics: {
        totalAlumni,
        approvedAlumni,
        pendingAlumni,
        totalStudents,
        activeUsers,
        totalEvents,
        upcomingEvents,
        totalJobs
      },
      recentRegistrations
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/alumni
// @desc    Get all alumni with filters
// @access  Private/Admin
router.get('/alumni', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', isApproved, department, graduationYear } = req.query;
    const whereClause = { role: 'alumni' };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (isApproved !== undefined) {
      whereClause.isApproved = isApproved === 'true';
    }

    const profileWhere = {};
    if (department) {
      profileWhere.department = { [Op.like]: `%${department}%` };
    }
    if (graduationYear) {
      profileWhere.graduationYear = parseInt(graduationYear);
    }

    const alumni = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
      include: [{
        model: AlumniProfile,
        where: Object.keys(profileWhere).length > 0 ? profileWhere : undefined,
        required: false
      }]
    });
    
    const total = await User.count({ where: whereClause });

    res.json({
      alumni: alumni.map(a => ({
        user: {
          id: a.id,
          name: a.name,
          email: a.email,
          role: a.role,
          isApproved: a.isApproved,
          createdAt: a.createdAt
        },
        ...(a.AlumniProfile ? {
          graduationYear: a.AlumniProfile.graduationYear,
          department: a.AlumniProfile.department,
          company: a.AlumniProfile.company,
          position: a.AlumniProfile.position
        } : {})
      })),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get alumni error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/alumni/:id/approve
// @desc    Approve/reject alumni registration
// @access  Private/Admin
router.put('/alumni/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const user = await User.findByPk(id);
    if (!user || user.role !== 'alumni') {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    user.isApproved = isApproved;
    await user.save();

    res.json({ message: `Alumni ${isApproved ? 'approved' : 'rejected'} successfully`, user });
  } catch (error) {
    console.error('Approve alumni error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/alumni/:id
// @desc    Delete alumni
// @access  Private/Admin
router.delete('/alumni/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete profile if exists (CASCADE will handle this automatically)
    await AlumniProfile.destroy({ where: { userId: id } });
    await User.destroy({ where: { id } });

    res.json({ message: 'Alumni deleted successfully' });
  } catch (error) {
    console.error('Delete alumni error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/alumni/:id
// @desc    Update alumni details
// @access  Private/Admin
router.put('/alumni/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({ message: 'Alumni updated successfully', user });
  } catch (error) {
    console.error('Update alumni error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/events
// @desc    Create event
// @access  Private/Admin
router.post('/events', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.create({
      ...req.body,
      organizerId: req.user.id
    });

    await event.reload({
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/events/:id
// @desc    Update event
// @access  Private/Admin
router.put('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.update(req.body);
    await event.reload({
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/events/:id
// @desc    Delete event
// @access  Private/Admin
router.delete('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/announcements
// @desc    Create announcement
// @access  Private/Admin
router.post('/announcements', [
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const announcement = await Announcement.create({
      ...req.body,
      postedById: req.user.id
    });

    await announcement.reload({
      include: [{
        model: User,
        as: 'postedBy',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({ message: 'Announcement created successfully', announcement });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/jobs
// @desc    Get all job postings
// @access  Private/Admin
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await JobPost.findAll({
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

// @route   DELETE /api/admin/jobs/:id
// @desc    Delete job posting
// @access  Private/Admin
router.delete('/jobs/:id', async (req, res) => {
  try {
    const job = await JobPost.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    await job.destroy();
    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/export/csv
// @desc    Export alumni data as CSV
// @access  Private/Admin
router.get('/export/csv', async (req, res) => {
  try {
    const profiles = await AlumniProfile.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'isApproved']
      }]
    });

    const csvData = profiles.map(profile => ({
      name: profile.User.name,
      email: profile.User.email,
      graduationYear: profile.graduationYear,
      department: profile.department,
      company: profile.company,
      position: profile.position,
      location: `${profile.city}, ${profile.state}, ${profile.country}`,
      isApproved: profile.User.isApproved
    }));

    const csvWriter = createCsvWriter({
      path: 'alumni_export.csv',
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'graduationYear', title: 'Graduation Year' },
        { id: 'department', title: 'Department' },
        { id: 'company', title: 'Company' },
        { id: 'position', title: 'Position' },
        { id: 'location', title: 'Location' },
        { id: 'isApproved', title: 'Approved' }
      ]
    });

    await csvWriter.writeRecords(csvData);

    res.download('alumni_export.csv', 'alumni_export.csv', (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
      // Clean up file after download
      setTimeout(() => {
        if (fs.existsSync('alumni_export.csv')) {
          fs.unlinkSync('alumni_export.csv');
        }
      }, 1000);
    });
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/export/pdf
// @desc    Export alumni data as PDF
// @access  Private/Admin
router.get('/export/pdf', async (req, res) => {
  try {
    const profiles = await AlumniProfile.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email']
      }]
    });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=alumni_export.pdf');

    doc.pipe(res);
    doc.fontSize(20).text('Alumni Directory', { align: 'center' });
    doc.moveDown();

    profiles.forEach((profile, index) => {
      doc.fontSize(12)
        .text(`${index + 1}. ${profile.User.name}`, { bold: true })
        .text(`   Email: ${profile.User.email}`)
        .text(`   Graduation Year: ${profile.graduationYear}`)
        .text(`   Department: ${profile.department}`)
        .text(`   Company: ${profile.company || 'N/A'}`)
        .text(`   Position: ${profile.position || 'N/A'}`)
        .moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Export PDF error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

