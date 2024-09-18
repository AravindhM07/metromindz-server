const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');

router.use('/user', authRoutes);

module.exports = router;