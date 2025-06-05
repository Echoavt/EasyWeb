const express = require('express');
const Preset = require('../models/Preset');
const auth = require('../middleware/authMiddleware');
const logAction = require('../middleware/logAction');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const presets = await Preset.find({ ownerId: req.user._id });
  res.json(presets);
});

router.get('/:id', async (req, res) => {
  const preset = await Preset.findOne({ _id: req.params.id, ownerId: req.user._id });
  if (!preset) return res.status(404).end();
  res.json(preset);
});

router.post('/', async (req, res) => {
  const preset = await Preset.create({ ...req.body, ownerId: req.user._id });
  await logAction(req.user._id, 'CREATE_PRESET', preset._id);
  res.status(201).json(preset);
});

router.put('/:id', async (req, res) => {
  const preset = await Preset.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user._id },
    { ...req.body, updatedAt: new Date() },
    { new: true }
  );
  if (!preset) return res.status(404).end();
  await logAction(req.user._id, 'UPDATE_PRESET', preset._id);
  res.json(preset);
});

router.delete('/:id', async (req, res) => {
  const preset = await Preset.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
  if (!preset) return res.status(404).end();
  await logAction(req.user._id, 'DELETE_PRESET', preset._id);
  res.json({ success: true });
});

module.exports = router;
