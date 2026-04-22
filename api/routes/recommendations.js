const express = require('express');
const Recommendation = require('../models/Recommendation');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Submit a recommendation (requires authentication)
router.post('/submit-recommendation', auth, async (req, res) => {
  try {
    const { rating, comment, serviceName } = req.body;

    // Validation
    if (!rating || !comment || !serviceName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating, comment, and service name'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    if (comment.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be at least 10 characters'
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

    // Create recommendation
    const recommendation = new Recommendation({
      userId: req.userId,
      userName: user.name,
      userEmail: user.email,
      rating,
      comment,
      serviceName,
      isApproved: true // Auto-approve for now; can be admin-controlled later
    });

    await recommendation.save();

    res.status(201).json({
      success: true,
      message: 'Recommendation submitted successfully',
      data: recommendation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error submitting recommendation'
    });
  }
});

// Get all approved recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'name email');

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations'
    });
  }
});

// Get user's own recommendations
router.get('/my-recommendations', auth, async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your recommendations'
    });
  }
});

// Delete a recommendation (user can only delete their own)
router.delete('/recommendations/:id', auth, async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    if (recommendation.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own recommendations'
      });
    }

    await Recommendation.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Recommendation deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting recommendation'
    });
  }
});

module.exports = router;
