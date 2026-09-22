import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import donationRequestRoutes from './routes/donationRequestRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

const missingEmailConfiguration = [
  ['SMTP_HOST', process.env.SMTP_HOST],
  ['SMTP_USER', process.env.SMTP_USER],
  ['SMTP_PASSWORD', process.env.SMTP_PASSWORD],
].filter(([, value]) => !value).map(([name]) => name);

if (missingEmailConfiguration.length) {
  console.warn(`Password reset email is not configured. Missing: ${missingEmailConfiguration.join(', ')}`);
}

// Initialize express app
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://blood-donation-two-nu.vercel.app',
  ...(process.env.CORS_ORIGIN || '').split(','),
]
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
};

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors(corsOptions)); // Cross-origin resource sharing
app.options('*', cors(corsOptions));
app.use(morgan('combined')); // Request logging
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL encoded body parser
app.use('/api/', apiLimiter); // Rate limiting

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donation-requests', donationRequestRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Bloodly API is running',
  });
});

app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// 404 handler
app.use(notFoundMiddleware);

// Error handling middleware
app.use(errorMiddleware);

// Start the HTTP listener locally. Vercel imports the app through api/index.js.
const PORT = process.env.PORT || 5000;
const server = process.env.VERCEL === '1'
  ? null
  : app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server?.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server?.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
