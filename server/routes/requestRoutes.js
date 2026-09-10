import express from 'express';
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  getMyRequests,
} from '../controllers/requestController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Donors and recipients may create requests on behalf of a patient.
// Admin-only operations remain protected by the dedicated admin routes.
router.post('/', authMiddleware, roleMiddleware(['DONOR', 'RECIPIENT']), createRequest);
router.get('/', getAllRequests);
router.get('/user/my-requests', authMiddleware, getMyRequests);
router.get('/:id', authMiddleware, getRequestById);
router.put('/:id', authMiddleware, updateRequest);
router.delete('/:id', authMiddleware, deleteRequest);

export default router;
