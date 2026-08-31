import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// Validation Schemas
export const createTipeKamarSchema = z.object({
  body: z.object({
    propertiId: z.string().uuid({ message: 'ID Properti tidak valid' }),
    nama: z.string().min(3, { message: 'Nama tipe kamar minimal 3 karakter' }),
    deskripsi: z.string().optional(),
    hargaDasar: z.number().min(0),
    maksDewasa: z.number().min(1),
    maksAnak: z.number().min(0),
    maksTamu: z.number().min(1),
    ukuranKamar: z.number().optional(),
    fasilitasIds: z.array(z.string().uuid()).optional(),
    kasur: z.array(z.object({
      tipeKasurId: z.string().uuid(),
      jumlah: z.number().min(1)
    })).optional(),
  }),
});

export const updateTipeKamarSchema = z.object({
  body: z.object({
    nama: z.string().min(3).optional(),
    deskripsi: z.string().optional(),
    hargaDasar: z.number().min(0).optional(),
    maksDewasa: z.number().min(1).optional(),
    maksAnak: z.number().min(0).optional(),
    maksTamu: z.number().min(1).optional(),
    ukuranKamar: z.number().optional(),
    fasilitasIds: z.array(z.string().uuid()).optional(),
    kasur: z.array(z.object({
      tipeKasurId: z.string().uuid(),
      jumlah: z.number().min(1)
    })).optional(),
    status: z.enum(['AKTIF', 'NONAKTIF']).optional(),
  }),
});

const checkPropertyOwnership = async (propertiId: string, penggunaId: string, peran: string) => {
  if (peran === 'ADMIN') return true;

  const properti = await prisma.properti.findUnique({ where: { id: propertiId } });
  if (properti?.tuanRumahId === penggunaId) return true;

  const isStaff = await prisma.propertyStaff.findUnique({
    where: { propertiId_penggunaId: { propertiId, penggunaId } }
  });
  return isStaff?.staffRole === 'MANAGER';
};

export const getTipeKamarByProperti = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertiId = req.params.propertiId as string;
    const tipeKamar = await prisma.tipeKamar.findMany({
      where: { propertiId, status: 'AKTIF' },
      include: {
        fasilitas: { include: { fasilitas: true } },
        kasur: { include: { tipeKasur: true } },
        foto: true,
      },
    });
    res.json({ status: 'success', data: tipeKamar });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil tipe kamar');
    next(error);
  }
};

export const getTipeKamarById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const tipeKamar = await prisma.tipeKamar.findUnique({
      where: { id },
      include: {
        fasilitas: { include: { fasilitas: true } },
        kasur: { include: { tipeKasur: true } },
        foto: true,
      },
    });

    if (!tipeKamar) {
      return res.status(404).json({ status: 'error', message: 'Tipe kamar tidak ditemukan' });
    }

    res.json({ status: 'success', data: tipeKamar });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil detail tipe kamar');
    next(error);
  }
};

export const createTipeKamar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;
    const { fasilitasIds, kasur, propertiId, ...data } = req.body;

    const isOwner = await checkPropertyOwnership(propertiId, penggunaId, peran);
    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan menambahkan kamar ke properti ini' });
    }

    const tipeKamar = await prisma.tipeKamar.create({
      data: {
        ...data,
        propertiId,
        fasilitas: fasilitasIds ? {
          create: fasilitasIds.map((fasilitasId: string) => ({
            fasilitasId
          }))
        } : undefined,
        kasur: kasur ? {
          create: kasur.map((k: any) => ({
            tipeKasurId: k.tipeKasurId,
            jumlah: k.jumlah
          }))
        } : undefined
      },
      include: {
        fasilitas: true,
        kasur: true
      }
    });

    res.status(201).json({ status: 'success', data: tipeKamar });
  } catch (error) {
    logger.error({ err: error }, 'Error saat membuat tipe kamar');
    next(error);
  }
};

export const updateTipeKamar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;
    const { fasilitasIds, kasur, ...data } = req.body;

    const existing = await prisma.tipeKamar.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Tipe kamar tidak ditemukan' });
    }

    const isOwner = await checkPropertyOwnership(existing.propertiId, penggunaId, peran);
    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan mengubah kamar ini' });
    }

    if (fasilitasIds) {
      await prisma.fasilitasTipeKamar.deleteMany({ where: { tipeKamarId: id } });
    }
    if (kasur) {
      await prisma.kasurTipeKamar.deleteMany({ where: { tipeKamarId: id } });
    }

    const tipeKamar = await prisma.tipeKamar.update({
      where: { id },
      data: {
        ...data,
        fasilitas: fasilitasIds ? {
          create: fasilitasIds.map((fasilitasId: string) => ({
            fasilitasId
          }))
        } : undefined,
        kasur: kasur ? {
          create: kasur.map((k: any) => ({
            tipeKasurId: k.tipeKasurId,
            jumlah: k.jumlah
          }))
        } : undefined
      },
      include: {
        fasilitas: { include: { fasilitas: true } },
        kasur: { include: { tipeKasur: true } }
      }
    });

    res.json({ status: 'success', data: tipeKamar });
  } catch (error) {
    logger.error({ err: error }, 'Error saat memperbarui tipe kamar');
    next(error);
  }
};

export const deleteTipeKamar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;

    const existing = await prisma.tipeKamar.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Tipe kamar tidak ditemukan' });
    }

    const isOwner = await checkPropertyOwnership(existing.propertiId, penggunaId, peran);
    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan menghapus kamar ini' });
    }

    await prisma.tipeKamar.delete({ where: { id } });
    res.json({ status: 'success', message: 'Tipe kamar berhasil dihapus' });
  } catch (error) {
    logger.error({ err: error }, 'Error saat menghapus tipe kamar');
    next(error);
  }
};
