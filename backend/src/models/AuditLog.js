const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  targetId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
