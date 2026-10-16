const express = require('express');
const Job = require('../models/Job');
const { authMiddleware, employerMiddleware } = require('../middleware/authMiddleware');
const { fetchNCSJobs } = require('../utils/ncsAPI');

const router = express.Router();

// Get all jobs (manual + NCS)
router.get('/', async (req, res) => {
  try {
    const { search, location, type, page = 1, limit = 10 } = req.query;
    
    // Build filter for manual jobs
    let filter = { isActive: true, expiresAt: { $gt: new Date() } };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (type) {
      filter.type = type;
    }

    // Get manual jobs
    const manualJobs = await Job.find(filter)
      .populate('employer', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get NCS jobs
    const ncsJobs = await fetchNCSJobs({ search, location, type });

    // Combine and remove duplicates
    const allJobs = [...manualJobs, ...ncsJobs];
    const uniqueJobs = allJobs.filter((job, index, self) =>
      index === self.findIndex(j => 
        j.externalId ? j.externalId === job.externalId : j._id.toString() === job._id.toString()
      )
    );

    // Get total count for manual jobs only (for pagination)
    const totalManualJobs = await Job.countDocuments(filter);

    res.json({
      success: true,
      jobs: uniqueJobs,
      totalPages: Math.ceil(totalManualJobs / limit),
      currentPage: parseInt(page),
      totalJobs: totalManualJobs + ncsJobs.length
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs'
    });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job'
    });
  }
});

// Create job (Employer only)
router.post('/', authMiddleware, employerMiddleware, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      employer: req.user._id
    });

    await job.save();
    await job.populate('employer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating job'
    });
  }
});

// Update job (Employer only)
router.put('/:id', authMiddleware, employerMiddleware, async (req, res) => {
  try {
    const job = await Job.findOne({ 
      _id: req.params.id, 
      employer: req.user._id 
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or unauthorized'
      });
    }

    Object.assign(job, req.body);
    await job.save();
    await job.populate('employer', 'name email');

    res.json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating job'
    });
  }
});

// Delete job (Employer only)
router.delete('/:id', authMiddleware, employerMiddleware, async (req, res) => {
  try {
    const job = await Job.findOne({ 
      _id: req.params.id, 
      employer: req.user._id 
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or unauthorized'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting job'
    });
  }
});

// Get employer's jobs
router.get('/employer/my-jobs', authMiddleware, employerMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .populate('employer', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Get employer jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs'
    });
  }
});

module.exports = router;