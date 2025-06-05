const mongoose = require('mongoose');

const presetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  settings: { type: Object, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Preset', presetSchema);
