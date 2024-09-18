const express = require('express');
const router = express.Router();
const clientAuth = require('../middlewares/clientAuth');

const { createTask, fetchTasks, deleteTask } = require('../controllers/taskController');

router.post('/createTask', clientAuth, createTask);
router.get('/fetchTasks', clientAuth, fetchTasks);
router.get('/deleteRequest', clientAuth, deleteTask);

module.exports = router;