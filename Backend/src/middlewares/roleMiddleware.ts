import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { logger } from '../utils/logger';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.pengguna) {
      logger.warn('Akses ditolak: pengguna belum login saat mencoba rute yang dilindungi');
      return res.status(401).json({ status: 'error', message: 'Tidak diotorisasi, silahkan login terlebih dahulu' });
    }

    if (!roles.includes(req.pengguna.role)) {
      logger.warn(`Akses ditolak: pengguna dengan peran ${req.pengguna.role} mencoba mengakses rute untuk ${roles.join(', ')}`);
      return res.status(403).json({ status: 'error', message: 'Anda tidak memiliki izin untuk mengakses rute ini' });
    }

    next();
  };
};
