const express = require('express');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Submit feedback (requires authentication)
router.post('/submit-feedback', auth, async (req, res) => {
  try {
    const { type, message } = req.body;

    // Validation
    if (!type || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide feedback type and message' 
      });
    }

    if (message.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message must be at least 10 characters' 
      });
    }

    // Get user info
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Create feedback
    const feedback = new Feedback({
      userId: req.userId,
      userEmail: user.email,
      userName: user.name,
      type,
      message
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit feedback' 
    });
  }
});

// Get user's feedback (optional - for dashboard)
router.get('/feedback', auth, async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch feedback' 
    });
  }
});

module.exports = router;
