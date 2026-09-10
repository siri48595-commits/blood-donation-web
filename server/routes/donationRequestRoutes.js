import express from 'express';
import {
  sendDonationRequest,
  getAllDonationRequests,
  getDonationRequestById,
  updateDonationRequest,
  getDonorRequests,
  getRecipientRequests,
} from '../controllers/donationRequestController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, sendDonationRequest);
router.get('/', authMiddleware, getAllDonationRequests);
router.get('/donor/:donorId', authMiddleware, getDonorRequests);
router.get('/recipient/:recipientId', authMiddleware, getRecipientRequests);
router.get('/:id', authMiddleware, getDonationRequestById);
router.put('/:id', authMiddleware, updateDonationRequest);

export default router;
