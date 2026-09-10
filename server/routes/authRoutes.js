import express from 'express';
import {
	register,
	login,
	logout,
	forgotPassword,
	resetPassword,
	forgotPasswordByPhone,
	resetPasswordByOtp,
} from '../controllers/authController.js';
import {
	authLimiter,
	passwordResetLimiter,
	passwordResetOtpLimiter,
} from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/forgot-password/phone', passwordResetLimiter, forgotPasswordByPhone);
router.post('/reset-password/otp', passwordResetOtpLimiter, resetPasswordByOtp);

export default router;
