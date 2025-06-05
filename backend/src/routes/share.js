const express = require('express');
const Project = require('../models/Project');
const SharedProject = require('../models/SharedProject');
const auth = require('../middleware/authMiddleware');
const logAction = require('../middleware/logAction');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/projects/:id/share', auth, async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, ownerId: req.user._id }).lean();
  if (!project) return res.status(404).end();
  const shareId = uuidv4();
  await SharedProject.create({ shareId, projectData: project, expiresAt: new Date(Date.now() + 7*24*60*60*1000) });
  await logAction(req.user._id, 'SHARE_PROJECT', project._id);
  res.json({ url: `/public/${shareId}` });
});

router.get('/shared/:shareId', async (req, res) => {
  const shared = await SharedProject.findOne({ shareId: req.params.shareId, expiresAt: { $gt: new Date() } });
  if (!shared) return res.status(404).end();
  res.json(shared.projectData);
});

module.exports = router;
