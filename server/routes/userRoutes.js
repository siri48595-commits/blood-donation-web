import express from 'express';
import {
  getProfile,
  updateProfile,
  updateAvailability,
  updateLastDonationDate,
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/availability', authMiddleware, updateAvailability);
router.put('/last-donation', authMiddleware, updateLastDonationDate);

export default router;
