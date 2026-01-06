const express = require('express');
const Announcement = require('../models/Announcement');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/announcements
// @desc    Get announcements based on user role
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const query = {
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: req.user.role }
      ]
    };

    const announcements = await Announcement.find(query)
      .populate('postedBy', 'name email')
      .sort({ isImportant: -1, createdAt: -1 })
      .limit(20);

    res.json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/announcements/:id
// @desc    Get single announcement
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('postedBy', 'name email');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ announcement });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

