const express = require('express');
const supabase = require('../config-supabase');

const router = express.Router();

// Submit contact form (no authentication required)
router.post('/contact-form', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields (name, email, subject, message)' 
      });
    }

    if (message.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message must be at least 10 characters' 
      });
    }

    // Create contact submission
    const { data: contact, error } = await supabase
      .from('contacts')
      .insert([{
        name: name.trim(),
        email: email.toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message,
        status: 'new'
      }])
      .select()
      .single();

    if (error) throw error;

    // TODO: Send email notification to admin
    // sendAdminNotification(contact);

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will get back to you soon!',
      data: {
        id: contact.id,
        timestamp: contact.timestamp
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit contact form' 
    });
  }
});

module.exports = router;
