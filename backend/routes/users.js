const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const { uploadMiddleware } = require('../middleware/errorHandler');
// const { verifyToken, isAdmin } = require('../middleware/auth'); // Comment out these lines

// Apply authentication to all routes
// router.use(verifyToken); // Comment out this line

// Apply admin-only access to all routes
// router.use(isAdmin); // Comment out this line

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Create new user
router.post('/', uploadMiddleware('photo'), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, classes, subjects, password, role } = req.body;
    
    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      classes,
      subjects,
      password,
      role: role || 'teacher',
      photo: req.file ? `/uploads/profile/${req.file.filename}` : '',
    });
    
    await newUser.save();
    
    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Update user
router.put('/:id', uploadMiddleware('photo'), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, classes, subjects, role, isActive } = req.body;
    
    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
    }
    
    // Build update object
    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      classes,
      subjects,
      role,
      isActive,
      updatedAt: Date.now()
    };
    
    // Add photo if uploaded
    if (req.file) {
      updateData.photo = `/uploads/profile/${req.file.filename}`;
      
      // Delete old photo if exists
      const oldUser = await User.findById(req.params.id);
      if (oldUser && oldUser.photo) {
        const oldPhotoPath = path.join(__dirname, '..', oldUser.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }
    
    // Update password if provided
    if (req.body.password) {
      updateData.password = req.body.password;
    }
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Delete user's photo if exists
    if (user.photo) {
      const photoPath = path.join(__dirname, '..', user.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;