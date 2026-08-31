import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// Schemas
export const addStaffSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Email tidak valid' }),
    staffRole: z.enum(['MANAGER', 'RECEPTIONIST']).default('RECEPTIONIST'),
  }),
});

// Helper for Manager check
const checkManagerOwnership = async (propertiId: string, penggunaId: string, peran: string) => {
  if (peran === 'ADMIN') return true;
  if (peran === 'HOST') {
    const properti = await prisma.properti.findUnique({ where: { id: propertiId } });
    if (properti?.tuanRumahId === penggunaId) return true;

    const isStaff = await prisma.propertyStaff.findUnique({
      where: { propertiId_penggunaId: { propertiId, penggunaId } }
    });
    return isStaff?.staffRole === 'MANAGER';
  }
  return false;
};

export const getPropertyStaff = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const propertiId = req.params.propertiId as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;

    if (!(await checkManagerOwnership(propertiId, penggunaId, peran))) {
      return res.status(403).json({ status: 'error', message: 'Akses ditolak. Anda bukan manajer properti ini.' });
    }

    const staffList = await prisma.propertyStaff.findMany({
      where: { propertiId },
      include: {
        pengguna: { select: { id: true, nama: true, email: true, fotoProfil: true } }
      },
      orderBy: { dibuatPada: 'asc' }
    });

    res.json({ status: 'success', data: staffList });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil daftar staf');
    next(error);
  }
};

export const addPropertyStaff = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const propertiId = req.params.propertiId as string;
    const { email, staffRole } = req.body;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;

    if (!(await checkManagerOwnership(propertiId, penggunaId, peran))) {
      return res.status(403).json({ status: 'error', message: 'Akses ditolak.' });
    }

    // Cari pengguna berdasarkan email
    const targetUser = await prisma.pengguna.findUnique({
      where: { email }
    });

    if (!targetUser) {
      return res.status(404).json({ status: 'error', message: 'Pengguna dengan email ini tidak ditemukan. Harap minta mereka mendaftar terlebih dahulu.' });
    }

    // Cek apakah sudah jadi staf
    const existingStaff = await prisma.propertyStaff.findUnique({
      where: { propertiId_penggunaId: { propertiId, penggunaId: targetUser.id } }
    });

    if (existingStaff) {
      return res.status(400).json({ status: 'error', message: 'Pengguna ini sudah menjadi staf di properti ini.' });
    }

    const newStaff = await prisma.propertyStaff.create({
      data: {
        propertiId,
        penggunaId: targetUser.id,
        staffRole
      },
      include: {
        pengguna: { select: { id: true, nama: true, email: true } }
      }
    });

    // Update role user menjadi HOST jika dia sebelumnya GUEST
    if (targetUser.role === 'GUEST') {
      await prisma.pengguna.update({
        where: { id: targetUser.id },
        data: { role: 'HOST' }
      });
    }

    res.status(201).json({ status: 'success', data: newStaff, message: 'Staf berhasil ditambahkan' });
  } catch (error) {
    logger.error({ err: error }, 'Error saat menambah staf');
    next(error);
  }
};

export const removePropertyStaff = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const propertiId = req.params.propertiId as string;
    const staffPenggunaId = req.params.staffId as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;

    if (!(await checkManagerOwnership(propertiId, penggunaId, peran))) {
      return res.status(403).json({ status: 'error', message: 'Akses ditolak.' });
    }

    // Jangan izinkan manager menghapus dirinya sendiri jika dia adalah satu-satunya manager
    if (staffPenggunaId === penggunaId) {
      const managerCount = await prisma.propertyStaff.count({
        where: { propertiId, staffRole: 'MANAGER' }
      });
      if (managerCount <= 1) {
         return res.status(400).json({ status: 'error', message: 'Anda adalah satu-satunya manajer. Tambahkan manajer lain sebelum menghapus diri Anda.' });
      }
    }

    await prisma.propertyStaff.delete({
      where: { propertiId_penggunaId: { propertiId, penggunaId: staffPenggunaId } }
    });

    res.json({ status: 'success', message: 'Staf berhasil dihapus' });
  } catch (error) {
    logger.error({ err: error }, 'Error saat menghapus staf');
    next(error);
  }
};
