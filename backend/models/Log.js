const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: null, // Content title or description
  },
  type: {
    type: String,
    default: null, // Content type (e.g., 'Interactive Book', 'Quiz', 'Course Presentation')
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}, // Additional content details like file count, tags, etc.
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
});

module.exports = mongoose.model('Log', logSchema);
