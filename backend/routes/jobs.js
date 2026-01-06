const express = require('express');
const JobPost = require('../models/JobPost');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all active job postings
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', location, employmentType } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    const jobs = await JobPost.find(query)
      .populate('postedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await JobPost.countDocuments(query);

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
    const job = await JobPost.findById(req.params.id)
      .populate('postedBy', 'name email');

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

