const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// GET /api/logs - Get all logs with populated user info
router.get('/', async (req, res) => {
  try {
    let logs = await Log.find()
      .sort({ timestamp: -1 })
      .limit(100)
      .populate('user', 'firstName lastName email role'); // populate user with selected fields including role

    // Filter logs to only those where user.role === 'teacher'
    logs = logs.filter(log => log.user && log.user.role === 'teacher');

    // Map logs to include content and type fields
    const mappedLogs = logs.map(log => ({
      _id: log._id,
      user: log.user,
      action: log.action,
      content: log.content || 'N/A',
      type: log.type || 'N/A',
      timestamp: log.timestamp,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
    }));

    res.json(mappedLogs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = router;
