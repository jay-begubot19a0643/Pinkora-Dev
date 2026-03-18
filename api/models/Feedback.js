const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['bug', 'feature', 'improvement', 'other'],
    default: 'other'
  },
  message: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 5000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
