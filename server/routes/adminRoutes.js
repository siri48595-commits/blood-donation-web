import express from 'express';
import {
  getDashboard,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllBloodRequests,
  getAllDonationRequests,
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/requests', getAllBloodRequests);
router.get('/donation-requests', getAllDonationRequests);

export default router;
