import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AppError } from './errorHandler.js';
import { logger } from '../../utils/logger.js';

export const protect = async (req, res, next) => {
  try {
    // 1) Get token from header
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // 3) Check if user still exists
    // TODO: Add user model and check if user exists
    // const currentUser = await User.findById(decoded.id);
    // if (!currentUser) {
    //   return next(new AppError('The user belonging to this token no longer exists.', 401));
    // }

    // 4) Grant access to protected route
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return next(new AppError('Invalid token. Please log in again!', 401));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // TODO: Add role check when user model is implemented
    // if (!roles.includes(req.user.role)) {
    //   return next(new AppError('You do not have permission to perform this action', 403));
    // }
    next();
  };
};