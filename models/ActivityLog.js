const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  staffid: String,
  username: String,
  role: String,
  action: String, // 'login' or 'logout'
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);