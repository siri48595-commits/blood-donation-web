import express from 'express';
import {
  chatWithAI,
  matchDonorsWithAI,
  getChatHistory,
  clearChatHistory,
} from '../controllers/aiController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/chat', authMiddleware, aiLimiter, chatWithAI);
router.post('/match-donors', authMiddleware, aiLimiter, matchDonorsWithAI);
router.get('/history', authMiddleware, getChatHistory);
router.delete('/history/:conversationId', authMiddleware, clearChatHistory);

export default router;
