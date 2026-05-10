import express from 'express';
import { register, login, logout, getMe, googleLogin, sendOTP, verifyOTP } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

export default router;
