const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const Log = require('../models/Log');
const User = require('../models/User');

// Get content statistics
router.get('/stats/content', async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Content created in the period
    const contentCount = await Content.countDocuments({
      createdAt: { $gte: startDate, $lte: now }
    });

    // Most used content type
    const contentTypeStats = await Content.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 1
      }
    ]);

    const mostUsedType = contentTypeStats.length > 0 ? contentTypeStats[0] : { _id: 'None', count: 0 };

    res.status(200).json({
      contentThisPeriod: contentCount,
      mostUsedContentType: mostUsedType._id,
      mostUsedContentTypeCount: mostUsedType.count,
      period: period
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get top 5 most active teachers
router.get('/stats/teachers', async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // First, get all teachers
    const teachers = await User.find({ role: 'teacher' }).select('firstName lastName email');

    if (teachers.length === 0) {
      console.log('No teachers found in database');
      return res.status(200).json({
        teachers: [],
        period: period
      });
    }

    console.log(`Found ${teachers.length} teachers`);

    // Get activity count for each teacher from logs
    const teacherStats = await Promise.all(
      teachers.map(async (teacher) => {
        const activityCount = await Log.countDocuments({
          user: teacher._id,
          timestamp: { $gte: startDate, $lte: now }
        });

        console.log(`${teacher.firstName} ${teacher.lastName}: ${activityCount} activities in period`);

        return {
          teacher: teacher,
          activityCount: activityCount
        };
      })
    );

    // Sort by activity count and take top 5
    const topTeachers = teacherStats
      .sort((a, b) => b.activityCount - a.activityCount)
      .slice(0, 5)
      .map((stat, index) => ({
        rank: index + 1,
        name: `${stat.teacher.firstName} ${stat.teacher.lastName}`,
        email: stat.teacher.email,
        activityCount: stat.activityCount,
        medal: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`
      }));

    res.status(200).json({
      teachers: topTeachers,
      period: period
    });
  } catch (err) {
    console.error('Error in /stats/teachers:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get content type usage statistics
router.get('/stats/content-types', async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get content type usage for this period
    const thisPeriodStats = await Content.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get content type usage for previous period
    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousPeriodStats = await Content.aggregate([
      {
        $match: {
          createdAt: { $gte: previousPeriodStart, $lt: startDate }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Format data for chart
    const contentTypes = ['Lesson', 'Quiz', 'Assignment', 'Project', 'Worksheet', 'Summary', 'Schema', 'Course Outline'];

    const chartData = contentTypes.map(type => {
      const thisPeriod = thisPeriodStats.find(stat => stat._id === type);
      const lastPeriod = previousPeriodStats.find(stat => stat._id === type);

      return {
        name: type,
        thisWeek: thisPeriod ? thisPeriod.count : 0,
        lastWeek: lastPeriod ? lastPeriod.count : 0
      };
    });

    res.status(200).json({
      chartData: chartData,
      period: period
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get content creation over time (for line chart)
router.get('/stats/content-timeline', async (req, res) => {
  try {
    const { period = 'year' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    let groupBy;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        break;
      default:
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    }

    const timelineStats = await Content.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Format the data
    const chartData = timelineStats.map(stat => ({
      name: stat._id,
      value: stat.count
    }));

    res.status(200).json({
      chartData: chartData,
      period: period
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Export all data as CSV
router.get('/export/all', async (req, res) => {
  try {
    // Get all contents with populated user data
    const contents = await Content.find()
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    // Get all users
    const users = await User.find().select('firstName lastName email role createdAt');

    // Get all logs with populated user data
    const logs = await Log.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    // Create CSV content
    let csvContent = '';

    // Contents CSV
    csvContent += '=== CONTENTS ===\n';
    csvContent += 'Title,Description,Type,Tags,Created By,Created At\n';

    contents.forEach(content => {
      const tags = content.tags ? content.tags.join('; ') : '';
      const createdBy = content.createdBy ? `${content.createdBy.firstName} ${content.createdBy.lastName}` : 'Unknown';
      csvContent += `"${content.title}","${content.description}","${content.type}","${tags}","${createdBy}","${content.createdAt}"\n`;
    });

    // Users CSV
    csvContent += '\n=== USERS ===\n';
    csvContent += 'First Name,Last Name,Email,Role,Created At\n';

    users.forEach(user => {
      csvContent += `"${user.firstName}","${user.lastName}","${user.email}","${user.role}","${user.createdAt}"\n`;
    });

    // Logs CSV
    csvContent += '\n=== ACTIVITY LOGS ===\n';
    csvContent += 'User,Action,Content,Type,Timestamp,IP Address\n';

    logs.forEach(log => {
      const user = log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System';
      csvContent += `"${user}","${log.action}","${log.content}","${log.type}","${log.createdAt}","${log.ipAddress || 'N/A'}"\n`;
    });

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="admin_data_export.csv"');

    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
