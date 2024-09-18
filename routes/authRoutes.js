const express = require('express');
const router = express.Router();
const clientAuth = require('../middlewares/clientAuth');

const { createUser, fetchUserProfile, login, logout } = require('../controllers/authController');

router.post('/signup', createUser);
router.get('/profile', clientAuth, fetchUserProfile);
router.post('/signin', login);
router.post('/signout', clientAuth, logout);

module.exports = router;