const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const authRoutes = require('./routes/auth');
const presetRoutes = require('./routes/presets');
const projectRoutes = require('./routes/projects');
const shareRoutes = require('./routes/share');

app.use('/api/auth', authRoutes);
app.use('/api/presets', presetRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', shareRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ais')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('Server running on port', PORT));
  })
  .catch(err => console.error(err));
