const AuditLog = require('../models/AuditLog');

module.exports = async function(userId, action, targetId) {
  try {
    await AuditLog.create({ userId, action, targetId });
  } catch (err) {
    console.error('Audit log error:', err);
  }
};
