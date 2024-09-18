const express = require('express');
const router = express.Router();
const clientAuth = require('../middlewares/clientAuth');

const { handleSaveTask, fetchTasks, deleteTask } = require('../controllers/taskController');

router.post('/handleTask', clientAuth, handleSaveTask);
router.get('/fetchTasks', clientAuth, fetchTasks);
router.get('/deleteRequest', clientAuth, deleteTask);

module.exports = router;