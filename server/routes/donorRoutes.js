import express from 'express';
import {
  getAllDonors,
  getDonorById,
  searchDonors,
  getDonorStats,
} from '../controllers/donorController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllDonors);
router.get('/stats', getDonorStats);
router.get('/search', searchDonors);
router.get('/:id', authMiddleware, getDonorById);

export default router;
