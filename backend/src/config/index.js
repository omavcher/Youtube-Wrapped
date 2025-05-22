import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-wrapped',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  corsOrigin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5173'],
  nodeEnv: process.env.NODE_ENV || 'development'
}; 