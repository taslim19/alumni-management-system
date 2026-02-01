const express = require('express');
const { Op } = require('sequelize');
const { User, AlumniProfile, Event, JobPost, Announcement, EventRegistration } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All student routes require authentication
router.use(authenticate);
router.use(authorize('student'));

// @route   GET /api/student/alumni
// @desc    View alumni profiles (limited access)
// @access  Private/Student
router.get('/alumni', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', department, graduationYear } = req.query;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { '$User.name$': { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } },
        { position: { [Op.like]: `%${search}%` } }
      ];
    }

    if (department) {
      whereClause.department = { [Op.like]: `%${department}%` };
    }

    if (graduationYear) {
      whereClause.graduationYear = parseInt(graduationYear);
    }

    const profiles = await AlumniProfile.findAll({
      where: whereClause,
      include: [{
        model: User,
        where: { role: 'alumni', isApproved: true },
        attributes: ['id', 'name', 'email', 'profilePhoto']
      }],
      attributes: { exclude: ['phone'] },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['graduationYear', 'DESC']]
    });

    // Filter out private information based on privacy settings
    const filteredProfiles = profiles.map(profile => {
      const profileObj = profile.toJSON();
      if (!profile.showEmail) {
        profileObj.User.email = 'Hidden';
      }
      if (!profile.showLocation) {
        profileObj.location = {};
      } else {
        profileObj.location = {
          city: profile.city,
          state: profile.state,
          country: profile.country
        };
      }
      return {
        _id: profileObj.id,
        user: profileObj.User,
        graduationYear: profileObj.graduationYear,
        department: profileObj.department,
        company: profileObj.company,
        position: profileObj.position,
        location: profileObj.location,
        bio: profileObj.bio
      };
    });

    const total = await AlumniProfile.count({
      where: whereClause,
      include: [{
        model: User,
        where: { role: 'alumni', isApproved: true }
      }]
    });

    res.json({
      profiles: filteredProfiles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get alumni error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/student/alumni/:id
// @desc    View single alumni profile
// @access  Private/Student
router.get('/alumni/:id', async (req, res) => {
  try {
    const profile = await AlumniProfile.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'profilePhoto']
      }]
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Check if user is approved
    const user = await User.findByPk(profile.userId);
    if (!user || !user.isApproved) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const profileObj = profile.toJSON();
    
    // Apply privacy settings
    if (!profile.showEmail) {
      profileObj.User.email = 'Hidden';
    }
    if (!profile.showPhone) {
      profileObj.phone = 'Hidden';
    }
    if (!profile.showLocation) {
      profileObj.location = {};
    } else {
      profileObj.location = {
        city: profile.city,
        state: profile.state,
        country: profile.country
      };
    }

    res.json({ profile: profileObj });
  } catch (error) {
    console.error('Get alumni profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/student/events
// @desc    View events
// @access  Private/Student
router.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { isActive: true },
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'name', 'email']
      }],
      order: [['date', 'ASC']]
    });

    res.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/student/events/:id/register
// @desc    Register for event
// @access  Private/Student
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

// @route   GET /api/student/jobs
// @desc    View job postings
// @access  Private/Student
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

// @route   GET /api/student/announcements
// @desc    Get announcements
// @access  Private/Student
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { targetAudience: { [Op.like]: '%all%' } },
          { targetAudience: { [Op.like]: '%student%' } }
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

