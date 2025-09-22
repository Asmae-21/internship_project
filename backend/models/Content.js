const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['Lesson', 'Quiz', 'Assignment', 'Project', 'Worksheet', 'Summary', 'Schema', 'Course Outline'],
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  files: [{
    type: String, // URLs or file paths
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Content', contentSchema);
