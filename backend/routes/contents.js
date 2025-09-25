const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const Log = require('../models/Log');
const path = require('path');
const fs = require('fs');
const { uploadMiddleware } = require('../middleware/errorHandler');

// Get all contents
router.get('/', async (req, res) => {
  try {
    const contents = await Content.find().populate('createdBy', 'firstName lastName email');
    res.status(200).json(contents);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get content count for a specific teacher
router.get('/teacher/:teacherId/count', async (req, res) => {
  try {
    const count = await Content.countDocuments({ createdBy: req.params.teacherId });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get recent contents for a specific teacher
router.get('/teacher/:teacherId/recent', async (req, res) => {
  try {
    const contents = await Content.find({ createdBy: req.params.teacherId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title type createdAt');
    res.status(200).json(contents);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get content type statistics
router.get('/stats/types', async (req, res) => {
  try {
    // Get all possible content types from the enum
    const allContentTypes = ['Lesson', 'Quiz', 'Assignment', 'Project', 'Worksheet', 'Summary', 'Schema', 'Course Outline'];

    // Get actual counts from database
    const contentTypeStats = await Content.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Create a map of existing content types and their counts
    const statsMap = {};
    contentTypeStats.forEach(stat => {
      statsMap[stat._id] = stat.count;
    });

    // Combine all content types with their counts (0 for unused types)
    const allContentTypeStats = allContentTypes.map(type => ({
      _id: type,
      count: statsMap[type] || 0
    })).sort((a, b) => b.count - a.count);

    res.status(200).json(allContentTypeStats);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('createdBy', 'firstName lastName email');
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.status(200).json(content);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Create new content
router.post('/', uploadMiddleware('files'), async (req, res) => {
  try {
    const { title, description, type, tags, createdBy } = req.body;

    // Validate required fields
    if (!title || !createdBy || !type) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Title, createdBy, and type are required'
      });
    }

    const files = req.files ? req.files.map(file => `/uploads/content/${file.filename}`) : [];

    // Safely parse tags
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (parseError) {
        console.error('Error parsing tags:', parseError);
        parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }

    const newContent = new Content({
      title,
      description,
      type,
      tags: parsedTags,
      files,
      createdBy,
    });

    await newContent.save();

    // Log the content creation activity
    try {
      const logEntry = new Log({
        user: createdBy,
        action: 'Created content',
        content: title,
        type: type, // Use the actual content type selected by the teacher
        metadata: {
          description: description,
          tags: parsedTags,
          fileCount: files.length,
          files: files
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });

      await logEntry.save();
    } catch (logError) {
      console.error('Error logging content creation:', logError);
      // Don't fail the content creation if logging fails
    }

    res.status(201).json(newContent);
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Update content
router.put('/:id', uploadMiddleware('files'), async (req, res) => {
  try {
    const { title, description, type, tags } = req.body;

    // Safely parse tags for update
    let parsedTags = undefined;
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (parseError) {
        console.error('Error parsing tags for update:', parseError);
        parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }

    const updateData = {
      title,
      description,
      type,
      tags: parsedTags,
      updatedAt: Date.now(),
    };

    if (req.files && req.files.length > 0) {
      updateData.files = req.files.map(file => `/uploads/content/${file.filename}`);

      // Optionally delete old files here if needed
      const oldContent = await Content.findById(req.params.id);
      if (oldContent && oldContent.files) {
        oldContent.files.forEach(filePath => {
          const fullPath = path.join(__dirname, '..', filePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedContent) return res.status(404).json({ error: 'Content not found' });

    // Log the content editing activity
    try {
      const logEntry = new Log({
        user: updatedContent.createdBy,
        action: 'Edited content',
        content: updatedContent.title,
        type: updatedContent.type, // Use the actual content type selected by the teacher
        metadata: {
          description: updatedContent.description,
          tags: updatedContent.tags,
          fileCount: updatedContent.files ? updatedContent.files.length : 0,
          files: updatedContent.files
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });

      await logEntry.save();
    } catch (logError) {
      console.error('Error logging content editing:', logError);
      // Don't fail the content update if logging fails
    }

    res.status(200).json(updatedContent);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Delete content
router.delete('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ error: 'Content not found' });

    // Delete content files if exist
    if (content.files) {
      content.files.forEach(filePath => {
        const fullPath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await Content.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
