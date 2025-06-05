const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/authMiddleware');
const logAction = require('../middleware/logAction');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const projects = await Project.find({ ownerId: req.user._id });
  res.json(projects);
});

router.get('/:id', async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, ownerId: req.user._id });
  if (!project) return res.status(404).end();
  res.json(project);
});

router.post('/', async (req, res) => {
  const project = await Project.create({ ...req.body, ownerId: req.user._id });
  await logAction(req.user._id, 'CREATE_PROJECT', project._id);
  res.status(201).json(project);
});

router.put('/:id', async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user._id },
    { ...req.body, updatedAt: new Date() },
    { new: true }
  );
  if (!project) return res.status(404).end();
  await logAction(req.user._id, 'UPDATE_PROJECT', project._id);
  res.json(project);
});

router.delete('/:id', async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
  if (!project) return res.status(404).end();
  await logAction(req.user._id, 'DELETE_PROJECT', project._id);
  res.json({ success: true });
});

module.exports = router;
