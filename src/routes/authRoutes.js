const express = require('express');
const { register, login, getMe, verifyEmail, resendVerification, requestPasswordReset, resetPassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
