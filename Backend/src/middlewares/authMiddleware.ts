import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  pengguna?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logger.warn('Akses ditolak: Tidak ada token');
    return res.status(401).json({ status: 'error', message: 'Tidak diotorisasi, tidak ada token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.pengguna = decoded;
    next();
  } catch (error) {
    logger.error({ err: error }, 'Akses ditolak: Token tidak valid');
    res.status(401).json({ status: 'error', message: 'Tidak diotorisasi, token tidak valid' });
  }
};
