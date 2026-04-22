const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  serviceName: {
    type: String,
    required: true,
    enum: [
      'POS System',
      'Inventory Management',
      'Sales Analytics',
      'Business Dashboard',
      'Video Monitoring',
      'Mobile App',
      'Web Development',
      'System Integration',
      'Cloud Solutions',
      'Other'
    ]
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for recent recommendations
recommendationSchema.index({ createdAt: -1 });
recommendationSchema.index({ isApproved: 1, createdAt: -1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
