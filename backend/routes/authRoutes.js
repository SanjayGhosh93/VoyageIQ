// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getMe, getAuthLogs, getAllUsers, getAuthStatus } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/status', getAuthStatus);
router.get('/logs', getAuthLogs);
router.get('/users', getAllUsers);
router.get('/me', protect, getMe);

module.exports = router;
