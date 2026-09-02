import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// Mendapatkan semua pengguna (Hanya Admin)
export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.pengguna.findMany({
      select: {
        id: true,
        email: true,
        nama: true,
        role: true,
        dibuatPada: true
      },
      orderBy: { dibuatPada: 'desc' }
    });
    res.json({ status: 'success', data: users });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil daftar pengguna');
    next(error);
  }
};

// Mengubah role pengguna (Hanya Admin)
export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    if (!['GUEST', 'HOST', 'ADMIN'].includes(role)) {
      return res.status(400).json({ status: 'error', message: 'Role tidak valid' });
    }

    const updatedUser = await prisma.pengguna.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        nama: true,
        role: true
      }
    });

    res.json({ status: 'success', message: `Role berhasil diubah menjadi ${role}`, data: updatedUser });
  } catch (error) {
    logger.error({ err: error }, 'Error mengubah role pengguna');
    next(error);
  }
};
