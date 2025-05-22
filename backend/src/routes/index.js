import express from 'express';

import { youtubeRoutes } from './youtube.routes.js';

const router = express.Router();

// Root route with health check
router.get('/', (req, res) => {
  const healthStatus = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
    message: 'Server is running healthy! 🚀'
  };
  res.status(200).json(healthStatus);
});

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API routes

router.use('/api/youtube', youtubeRoutes);

export default router; 