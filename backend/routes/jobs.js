const express = require('express');
const { Op } = require('sequelize');
const { JobPost, User } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all active job postings
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', location, employmentType } = req.query;
    const whereClause = { isActive: true };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }

    if (employmentType) {
      whereClause.employmentType = employmentType;
    }

    const jobs = await JobPost.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'postedBy',
        attributes: ['id', 'name', 'email']
      }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    const total = await JobPost.count({ where: whereClause });

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job posting
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const job = await JobPost.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'postedBy',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

