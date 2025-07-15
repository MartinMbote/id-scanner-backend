// routes/activityLogRoute.js
const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');

// Log activity (login/logout)
router.post('/log', async (req, res) => {
  try {
    const { staffid, username, role, action } = req.body;
    const newLog = new ActivityLog({ staffid, username, role, action });
    await newLog.save();
    res.status(200).json({ message: 'Activity logged' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to log activity' });
  }
});


// Fetch logs (for admin view)
router.get('/logs', async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

module.exports = router;
