const express = require('express');
const { Op } = require('sequelize');
const { Announcement, User } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/announcements
// @desc    Get announcements based on user role
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { targetAudience: { [Op.like]: '%all%' } },
          { targetAudience: { [Op.like]: `%${req.user.role}%` } }
        ]
      },
      include: [{
        model: User,
        as: 'postedBy',
        attributes: ['id', 'name', 'email']
      }],
      order: [['isImportant', 'DESC'], ['createdAt', 'DESC']],
      limit: 20
    });

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
    const announcement = await Announcement.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'postedBy',
        attributes: ['id', 'name', 'email']
      }]
    });

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

