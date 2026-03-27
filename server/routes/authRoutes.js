const express = require('express');
const router = express.Router();
const { register, login, getProfile, getMentors } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.get('/mentors', auth, getMentors);

module.exports = router;
