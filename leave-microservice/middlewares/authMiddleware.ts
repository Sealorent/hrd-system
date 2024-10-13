import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/responseUtil';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendErrorResponse(res, 'Access denied. No token provided.', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return sendErrorResponse(res, 'Access denied. No token provided.', 401);
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'secret'; // Secure this key in production
    const verified = jwt.verify(token, secretKey);
    if (!verified) {
        return sendErrorResponse(res, 'Invalid token.', 403);
    }
    next();
  } catch (error) {
    return sendErrorResponse(res, 'Invalid token.', 403);    
  }
};

export default authMiddleware;
