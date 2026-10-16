const express = require('express');
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { authMiddleware, employerMiddleware, seekerMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Apply for job (Seeker only)
router.post('/', authMiddleware, seekerMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if job exists and is active
    const job = await Job.findOne({ 
      _id: jobId, 
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or expired'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume: req.file ? {
        filename: req.file.filename,
        path: req.file.path,
        originalName: req.file.originalname
      } : undefined
    });

    await application.save();
    await application.populate('job', 'title company');
    await application.populate('applicant', 'name email');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while applying for job'
    });
  }
});

// Get applications for a job (Employer only)
router.get('/job/:jobId', authMiddleware, employerMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify job belongs to employer
    const job = await Job.findOne({ 
      _id: jobId, 
      employer: req.user._id 
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or unauthorized'
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email')
      .populate('job', 'title company')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// Get seeker's applications
router.get('/my-applications', authMiddleware, seekerMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// Update application status (Employer only)
router.patch('/:id/status', authMiddleware, employerMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify job belongs to employer
    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this application'
      });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating application'
    });
  }
});

module.exports = router;