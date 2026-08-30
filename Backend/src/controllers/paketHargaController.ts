import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export const createPaketHargaSchema = z.object({
  body: z.object({
    tipeKamarId: z.string().uuid({ message: 'ID Tipe Kamar tidak valid' }),
    nama: z.string().min(3, { message: 'Nama paket minimal 3 karakter' }),
    deskripsi: z.string().optional(),
    harga: z.number().min(0, { message: 'Harga tidak boleh negatif' }),
    termasukSarapan: z.boolean().optional(),
    dapatDikembalikan: z.boolean().optional(),
    kebijakanPembatalan: z.string().optional(),
  }),
});

export const updatePaketHargaSchema = z.object({
  body: z.object({
    nama: z.string().min(3).optional(),
    deskripsi: z.string().optional(),
    harga: z.number().min(0).optional(),
    termasukSarapan: z.boolean().optional(),
    dapatDikembalikan: z.boolean().optional(),
    kebijakanPembatalan: z.string().optional(),
    status: z.enum(['AKTIF', 'NONAKTIF']).optional(),
  }),
});

const checkTipeKamarOwnership = async (tipeKamarId: string, penggunaId: string, peran: string) => {
  if (peran === 'ADMIN') return true;
  const tipeKamar = await prisma.tipeKamar.findUnique({
    where: { id: tipeKamarId },
    include: { properti: true }
  });
  return tipeKamar?.properti.tuanRumahId === penggunaId;
};

export const getPaketHargaByTipeKamar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tipeKamarId = req.params.tipeKamarId as string;
    const paketHarga = await prisma.paketHarga.findMany({
      where: { tipeKamarId, status: 'AKTIF' },
    });
    res.json({ status: 'success', data: paketHarga });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil paket harga');
    next(error);
  }
};

export const getPaketHargaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const paketHarga = await prisma.paketHarga.findUnique({ where: { id } });

    if (!paketHarga) {
      return res.status(404).json({ status: 'error', message: 'Paket harga tidak ditemukan' });
    }

    res.json({ status: 'success', data: paketHarga });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil detail paket harga');
    next(error);
  }
};

export const createPaketHarga = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;
    const { tipeKamarId, ...data } = req.body;

    const isOwner = await checkTipeKamarOwnership(tipeKamarId, penggunaId, peran);
    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan menambahkan paket ke kamar ini' });
    }

    const paketHarga = await prisma.paketHarga.create({
      data: {
        ...data,
        tipeKamarId
      }
    });

    res.status(201).json({ status: 'success', data: paketHarga });
  } catch (error) {
    logger.error({ err: error }, 'Error saat membuat paket harga');
    next(error);
  }
};

export const updatePaketHarga = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;
    const data = req.body;

    const existing = await prisma.paketHarga.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Paket harga tidak ditemukan' });
    }

    const isOwner = await checkTipeKamarOwnership(existing.tipeKamarId, penggunaId, peran);
    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan mengubah paket harga ini' });
    }

    const paketHarga = await prisma.paketHarga.update({
      where: { id },
      data
    });

    res.json({ status: 'success', data: paketHarga });
  } catch (error) {
    logger.error({ err: error }, 'Error saat memperbarui paket harga');
    next(error);
  }
};

export const deletePaketHarga = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;

    const existing = await prisma.paketHarga.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Paket harga tidak ditemukan' });
    }

    const isOwner = await checkTipeKamarOwnership(existing.tipeKamarId, penggunaId, peran);
    if (!isOwner) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan menghapus paket harga ini' });
    }

    await prisma.paketHarga.delete({ where: { id } });
    res.json({ status: 'success', message: 'Paket harga berhasil dihapus' });
  } catch (error) {
    logger.error({ err: error }, 'Error saat menghapus paket harga');
    next(error);
  }
};
