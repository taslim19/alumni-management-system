const express = require('express');
const User = require('../models/User');
const AlumniProfile = require('../models/AlumniProfile');
const Event = require('../models/Event');
const JobPost = require('../models/JobPost');
const Announcement = require('../models/Announcement');
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
    const searchQuery = {};

    // Only show approved alumni
    const approvedUsers = await User.find({ role: 'alumni', isApproved: true }).select('_id');
    searchQuery.user = { $in: approvedUsers.map(u => u._id) };

    if (search) {
      searchQuery.$or = [
        { 'user.name': { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) {
      searchQuery.department = { $regex: department, $options: 'i' };
    }

    if (graduationYear) {
      searchQuery.graduationYear = parseInt(graduationYear);
    }

    const profiles = await AlumniProfile.find(searchQuery)
      .populate('user', 'name email profilePhoto')
      .select('-phone') // Hide phone from students
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ graduationYear: -1 });

    // Filter out private information based on privacy settings
    const filteredProfiles = profiles.map(profile => {
      const profileObj = profile.toObject();
      if (!profile.privacySettings.showEmail) {
        profileObj.user.email = 'Hidden';
      }
      if (!profile.privacySettings.showLocation) {
        profileObj.location = {};
      }
      return profileObj;
    });

    const total = await AlumniProfile.countDocuments(searchQuery);

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
    const profile = await AlumniProfile.findById(req.params.id)
      .populate('user', 'name email profilePhoto');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Check if user is approved
    const user = await User.findById(profile.user._id);
    if (!user || !user.isApproved) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const profileObj = profile.toObject();
    
    // Apply privacy settings
    if (!profile.privacySettings.showEmail) {
      profileObj.user.email = 'Hidden';
    }
    if (!profile.privacySettings.showPhone) {
      profileObj.phone = 'Hidden';
    }
    if (!profile.privacySettings.showLocation) {
      profileObj.location = {};
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
    const events = await Event.find({ isActive: true })
      .populate('organizer', 'name email')
      .sort({ date: 1 });

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

// @route   GET /api/student/jobs
// @desc    View job postings
// @access  Private/Student
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

// @route   GET /api/student/announcements
// @desc    Get announcements
// @access  Private/Student
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'student' }
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

