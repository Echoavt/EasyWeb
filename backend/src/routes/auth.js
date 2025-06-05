const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logAction = require('../middleware/logAction');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });
    await logAction(user._id, 'REGISTER', user._id);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ accessToken: token });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    await logAction(user._id, 'LOGIN', user._id);
    res.json({ accessToken: token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
