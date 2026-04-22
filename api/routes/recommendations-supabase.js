const express = require('express');
const supabase = require('../config-supabase');
const auth = require('../middleware/auth');

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
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', req.userId)
      .single();

    if (!user || userError) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create recommendation
    const { data: recommendation, error } = await supabase
      .from('recommendations')
      .insert([{
        user_id: req.userId,
        user_name: user.name,
        user_email: user.email,
        rating,
        comment,
        service_name: serviceName,
        is_approved: true // Auto-approve for now; can be admin-controlled later
      }])
      .select()
      .single();

    if (error) throw error;

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
    const { data: recommendations, error } = await supabase
      .from('recommendations')
      .select(`
        *,
        users:user_id (name, email)
      `)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

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
    const { data: recommendations, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

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

module.exports = router;
