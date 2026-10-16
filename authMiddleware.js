const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid' 
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please verify your email before accessing this resource' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

const employerMiddleware = (req, res, next) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Employer role required.' 
    });
  }
  next();
};

const seekerMiddleware = (req, res, next) => {
  if (req.user.role !== 'seeker') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Job seeker role required.' 
    });
  }
  next();
};

module.exports = { authMiddleware, employerMiddleware, seekerMiddleware };