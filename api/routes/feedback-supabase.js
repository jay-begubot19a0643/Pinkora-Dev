const express = require('express');
const supabase = require('../config-supabase');
const auth = require('../middleware/auth');

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

    // Create feedback
    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert([{
        user_id: req.userId,
        user_email: user.email,
        user_name: user.name,
        type,
        message,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

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
    const { data: feedback, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', req.userId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) throw error;

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
