import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// Validation Schemas
export const createUnitKamarSchema = z.object({
  body: z.object({
    tipeKamarId: z.string().uuid({ message: 'ID Tipe Kamar tidak valid' }),
    nomorUnit: z.string().min(1, { message: 'Nomor unit wajib diisi' }),
    lantai: z.string().optional(),
    status: z.enum(['TERSEDIA', 'TERISI', 'PERAWATAN', 'NONAKTIF']).optional(),
  }),
});

export const updateUnitKamarSchema = z.object({
  body: z.object({
    nomorUnit: z.string().min(1).optional(),
    lantai: z.string().optional(),
    status: z.enum(['TERSEDIA', 'TERISI', 'PERAWATAN', 'NONAKTIF']).optional(),
  }),
});

export const createBlokirSchema = z.object({
  body: z.object({
    unitKamarId: z.string().uuid({ message: 'ID Unit Kamar tidak valid' }),
    tanggalMulai: z.string().datetime({ message: 'Format tanggal mulai tidak valid (ISO 8601)' }),
    tanggalSelesai: z.string().datetime({ message: 'Format tanggal selesai tidak valid (ISO 8601)' }),
    alasan: z.string().optional(),
  }),
});

// Helper for ownership
const checkTipeKamarOwnership = async (tipeKamarId: string, penggunaId: string, peran: string) => {
  if (peran === 'ADMIN') return true;
  const tipeKamar = await prisma.tipeKamar.findUnique({
    where: { id: tipeKamarId },
    include: { properti: true }
  });
  return tipeKamar?.properti.tuanRumahId === penggunaId;
};

const checkUnitKamarOwnership = async (unitKamarId: string, penggunaId: string, peran: string) => {
  if (peran === 'ADMIN') return true;
  const unitKamar = await prisma.unitKamar.findUnique({
    where: { id: unitKamarId },
    include: { tipeKamar: { include: { properti: true } } }
  });
  return unitKamar?.tipeKamar.properti.tuanRumahId === penggunaId;
};

// --- Unit Kamar Controllers ---

export const getUnitKamarByTipeKamar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tipeKamarId = req.params.tipeKamarId as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;

    const isOwner = await checkTipeKamarOwnership(tipeKamarId, penggunaId, peran);
    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan melihat unit di kamar ini' });
    }

    const units = await prisma.unitKamar.findMany({
      where: { tipeKamarId },
      include: { blokir: true }
    });
    res.json({ status: 'success', data: units });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil unit kamar');
    next(error);
  }
};

export const createUnitKamar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;
    const { tipeKamarId, nomorUnit, lantai, status } = req.body;

    const isOwner = await checkTipeKamarOwnership(tipeKamarId, penggunaId, peran);
    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan menambahkan unit ke kamar ini' });
    }

    // Check if unit number already exists for this room type
    const existingUnit = await prisma.unitKamar.findFirst({
      where: { tipeKamarId, nomorUnit }
    });
    if (existingUnit) {
      return res.status(400).json({ status: 'error', message: 'Nomor unit sudah digunakan pada tipe kamar ini' });
    }

    const unit = await prisma.unitKamar.create({
      data: { tipeKamarId, nomorUnit, lantai, status }
    });

    res.status(201).json({ status: 'success', data: unit });
  } catch (error) {
    logger.error({ err: error }, 'Error saat membuat unit kamar');
    next(error);
  }
};

export const updateUnitKamar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;
    const { nomorUnit, lantai, status } = req.body;

    const isOwner = await checkUnitKamarOwnership(id, penggunaId, peran);
    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan mengubah unit ini' });
    }

    if (nomorUnit) {
      const unit = await prisma.unitKamar.findUnique({ where: { id } });
      if (unit) {
        const existingUnit = await prisma.unitKamar.findFirst({
          where: { tipeKamarId: unit.tipeKamarId, nomorUnit, NOT: { id } }
        });
        if (existingUnit) {
          return res.status(400).json({ status: 'error', message: 'Nomor unit sudah digunakan' });
        }
      }
    }

    const unit = await prisma.unitKamar.update({
      where: { id },
      data: { nomorUnit, lantai, status }
    });

    res.json({ status: 'success', data: unit });
  } catch (error) {
    logger.error({ err: error }, 'Error saat memperbarui unit kamar');
    next(error);
  }
};

export const deleteUnitKamar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;

    const isOwner = await checkUnitKamarOwnership(id, penggunaId, peran);
    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan menghapus unit ini' });
    }

    await prisma.unitKamar.delete({ where: { id } });
    res.json({ status: 'success', message: 'Unit berhasil dihapus' });
  } catch (error) {
    logger.error({ err: error }, 'Error saat menghapus unit kamar');
    next(error);
  }
};

// --- Blokir Ketersediaan Controllers ---

export const createBlokir = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;
    const { unitKamarId, tanggalMulai, tanggalSelesai, alasan } = req.body;

    const isOwner = await checkUnitKamarOwnership(unitKamarId, penggunaId, peran);
    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan memblokir unit ini' });
    }

    // TODO: Verify that start date is before end date

    const blokir = await prisma.blokirKetersediaan.create({
      data: {
        unitKamarId,
        tanggalMulai: new Date(tanggalMulai),
        tanggalSelesai: new Date(tanggalSelesai),
        alasan
      }
    });

    res.status(201).json({ status: 'success', data: blokir });
  } catch (error) {
    logger.error({ err: error }, 'Error saat membuat blokir ketersediaan');
    next(error);
  }
};

export const deleteBlokir = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;

    const blokir = await prisma.blokirKetersediaan.findUnique({ where: { id } });
    if (!blokir) {
      return res.status(404).json({ status: 'error', message: 'Blokir tidak ditemukan' });
    }

    const isOwner = await checkUnitKamarOwnership(blokir.unitKamarId, penggunaId, peran);
    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan menghapus blokir ini' });
    }

    await prisma.blokirKetersediaan.delete({ where: { id } });
    res.json({ status: 'success', message: 'Blokir berhasil dihapus' });
  } catch (error) {
    logger.error({ err: error }, 'Error saat menghapus blokir ketersediaan');
    next(error);
  }
};
