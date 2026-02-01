const express = require('express');
const { Event, User } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all active events (public for authenticated users)
// @access  Private
router.get('/', authenticate, async (req, res) => {
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

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'name', 'email']
      }, {
        model: User,
        as: 'registeredUsers',
        attributes: ['id', 'name', 'email', 'profilePhoto'],
        through: { attributes: [] }
      }]
    });

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

