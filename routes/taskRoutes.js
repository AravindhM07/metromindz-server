const express = require('express');
const router = express.Router();
const clientAuth = require('../middlewares/clientAuth');

const { createTask } = require('../controllers/taskController');

router.post('/create', clientAuth, createTask);

module.exports = router;