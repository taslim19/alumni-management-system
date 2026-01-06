const express = require('express');
const Event = require('../models/Event');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all active events (public for authenticated users)
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .populate('organizer', 'name email')
      .populate('registeredUsers', 'name email')
      .sort({ date: 1 });

    res.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('registeredUsers', 'name email profilePhoto');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

