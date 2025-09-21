const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
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

// Get content by ID
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
    const { title, description, tags, createdBy } = req.body;

    // Validate required fields
    if (!title || !createdBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Title and createdBy are required'
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
      tags: parsedTags,
      files,
      createdBy,
    });

    await newContent.save();

    res.status(201).json(newContent);
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Update content
router.put('/:id', uploadMiddleware('files'), async (req, res) => {
  try {
    const { title, description, tags, isActive } = req.body;

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
      tags: parsedTags,
      isActive,
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
