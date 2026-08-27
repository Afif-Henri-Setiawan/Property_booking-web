import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// Validasi Zod
export const createUlasanSchema = z.object({
  body: z.object({
    pemesananId: z.string().uuid(),
    penilaian: z.number().min(1).max(5),
    komentar: z.string().optional()
  }),
});

// Endpoint untuk Tamu: Membuat Ulasan
export const createUlasan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const penggunaId = req.pengguna.id as string;
    const { pemesananId, penilaian, komentar } = req.body;

    const pemesanan = await prisma.pemesanan.findUnique({
      where: { id: pemesananId }
    });

    if (!pemesanan) {
      return res.status(404).json({ status: 'error', message: 'Pemesanan tidak ditemukan' });
    }

    if (pemesanan.tamuId !== penggunaId) {
      return res.status(403).json({ status: 'error', message: 'Anda tidak diizinkan memberi ulasan untuk pesanan ini' });
    }

    if (pemesanan.status !== 'SELESAI') {
      return res.status(400).json({ status: 'error', message: 'Ulasan hanya dapat diberikan setelah tamu selesai menginap (checkout)' });
    }

    // Cek apakah sudah pernah memberi ulasan
    const existing = await prisma.ulasan.findUnique({
      where: { pemesananId }
    });

    if (existing) {
      return res.status(400).json({ status: 'error', message: 'Anda sudah pernah memberikan ulasan untuk pesanan ini' });
    }

    const ulasan = await prisma.ulasan.create({
      data: {
        propertiId: pemesanan.propertiId,
        penggunaId,
        pemesananId,
        penilaian,
        komentar
      }
    });

    res.status(201).json({ status: 'success', data: ulasan });
  } catch (error) {
    logger.error({ err: error }, 'Error saat membuat ulasan');
    next(error);
  }
};

// Endpoint Publik: Melihat daftar ulasan pada sebuah properti
export const getUlasanByProperti = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertiId = req.params.propertiId as string;

    const ulasan = await prisma.ulasan.findMany({
      where: { propertiId },
      orderBy: { dibuatPada: 'desc' },
      include: {
        pengguna: { select: { nama: true } },
        pemesanan: {
          select: {
            detail: {
              select: {
                tipeKamar: { select: { nama: true } }
              }
            }
          }
        }
      }
    });

    res.json({ status: 'success', data: ulasan, total: ulasan.length });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil ulasan properti');
    next(error);
  }
};

// Endpoint Publik: Mengambil 5 ulasan terbaik untuk Landing Page
export const getUlasanTerbaik = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ulasan = await prisma.ulasan.findMany({
      where: { 
        penilaian: { gte: 4 }, // Hanya ambil review bintang 4 ke atas
      },
      take: 5, // Ambil maksimal 5 review sebagai sampel
      orderBy: { dibuatPada: 'desc' }, // Review terbaru
      include: {
        pengguna: {
          select: { nama: true }
        },
        properti: {
          select: { nama: true, kota: true, provinsi: true }
        }
      }
    });

    res.json({ status: 'success', data: ulasan });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil ulasan terbaik');
    next(error);
  }
};
