const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');

router.use('/user', authRoutes);
router.use('/task', taskRoutes);

module.exports = router;