const mongoose = require('mongoose');

const sharedProjectSchema = new mongoose.Schema({
  shareId: { type: String, required: true, unique: true },
  projectData: { type: Object, required: true },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('SharedProject', sharedProjectSchema);
