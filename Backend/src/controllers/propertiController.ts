import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// Validation Schemas
export const createPropertiSchema = z.object({
  body: z.object({
    nama: z.string().min(3, { message: 'Nama properti minimal 3 karakter' }),
    deskripsi: z.string().min(10),
    tipePropertiId: z.string().uuid({ message: 'Tipe properti tidak valid' }),
    alamat: z.string().min(5),
    kota: z.string().min(2),
    provinsi: z.string().min(2),
    negara: z.string().min(2),
    garisLintang: z.number().optional(),
    garisBujur: z.number().optional(),
    waktuCheckIn: z.string().optional(),
    waktuCheckOut: z.string().optional(),
    nomorIdentitasHost: z.string().min(10, { message: 'Nomor identitas tidak valid' }),
    urlDokumenIdentitas: z.string().url({ message: 'URL KTP harus berupa link valid' }),
    urlBuktiKepemilikan: z.string().url({ message: 'URL Bukti Kepemilikan harus berupa link valid' }),
    urlDokumenIzinUsaha: z.string().url({ message: 'URL Izin Usaha harus berupa link valid' }),
    fasilitasIds: z.array(z.string().uuid()).optional(),
  }),
});

export const updatePropertiSchema = z.object({
  body: z.object({
    nama: z.string().min(3).optional(),
    deskripsi: z.string().min(10).optional(),
    tipePropertiId: z.string().uuid().optional(),
    alamat: z.string().min(5).optional(),
    kota: z.string().min(2).optional(),
    provinsi: z.string().min(2).optional(),
    negara: z.string().min(2).optional(),
    garisLintang: z.number().optional(),
    garisBujur: z.number().optional(),
    waktuCheckIn: z.string().optional(),
    waktuCheckOut: z.string().optional(),
    nomorIdentitasHost: z.string().min(10).optional(),
    urlDokumenIdentitas: z.string().url().optional(),
    urlBuktiKepemilikan: z.string().url().optional(),
    urlDokumenIzinUsaha: z.string().url().optional(),
    fasilitasIds: z.array(z.string().uuid()).optional(),
    status: z.enum(['DRAFT', 'TERTUNDA', 'DITERBITKAN', 'DITOLAK', 'NONAKTIF', 'DITANGGUHKAN']).optional(),
  }),
});

export const getMyProperti = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tuanRumahId = req.pengguna.id as string;
    const properti = await prisma.properti.findMany({
      where: { tuanRumahId },
      include: {
        tipe: true,
        fasilitas: { include: { fasilitas: true } },
        foto: true,
      },
    });
    res.json({ status: 'success', data: properti });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil properti milik host');
    next(error);
  }
};

export const getPropertiPublik = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const properti = await prisma.properti.findMany({
      where: { status: 'DITERBITKAN' },
      include: {
        tipe: true,
        foto: { where: { isUtama: true } },
        tipeKamar: {
          take: 1,
          orderBy: { hargaDasar: 'asc' }
        }
      },
    });
    res.json({ status: 'success', data: properti });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil properti publik');
    next(error);
  }
};

export const getPropertiById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const properti = await prisma.properti.findUnique({
      where: { id },
      include: {
        tipe: true,
        fasilitas: { include: { fasilitas: true } },
        foto: true,
        tuanRumah: { select: { id: true, nama: true, email: true } },
        tipeKamar: {
          include: {
            kasur: {
              include: {
                tipeKasur: true
              }
            }
          }
        },
      },
    });

    if (!properti) {
      return res.status(404).json({ status: 'error', message: 'Properti tidak ditemukan' });
    }

    res.json({ status: 'success', data: properti });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil detail properti');
    next(error);
  }
};

export const createProperti = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tuanRumahId = req.pengguna.id as string;
    const { fasilitasIds, ...data } = req.body;

    const properti = await prisma.properti.create({
      data: {
        ...data,
        tuanRumahId,
        status: 'TERTUNDA', // Memaksa status TERTUNDA untuk verifikasi Admin
        fasilitas: fasilitasIds ? {
          create: fasilitasIds.map((fasilitasId: string) => ({
            fasilitasId
          }))
        } : undefined
      },
      include: {
        fasilitas: true,
      }
    });

    res.status(201).json({ status: 'success', data: properti });
  } catch (error) {
    logger.error({ err: error }, 'Error saat membuat properti');
    next(error);
  }
};

export const updateProperti = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { fasilitasIds, ...data } = req.body;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.peran;

    const existing = await prisma.properti.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Properti tidak ditemukan' });
    }

    if (existing.tuanRumahId !== penggunaId && peran !== 'ADMIN') {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan mengubah properti ini' });
    }

    if (fasilitasIds) {
      await prisma.fasilitasProperti.deleteMany({ where: { propertiId: id } });
    }

    const properti = await prisma.properti.update({
      where: { id },
      data: {
        ...data,
        fasilitas: fasilitasIds ? {
          create: fasilitasIds.map((fasilitasId: string) => ({
            fasilitasId
          }))
        } : undefined
      },
      include: {
        fasilitas: { include: { fasilitas: true } }
      }
    });

    res.json({ status: 'success', data: properti });
  } catch (error) {
    logger.error({ err: error }, 'Error saat memperbarui properti');
    next(error);
  }
};

export const deleteProperti = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.peran;

    const existing = await prisma.properti.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Properti tidak ditemukan' });
    }

    if (existing.tuanRumahId !== penggunaId && peran !== 'ADMIN') {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan menghapus properti ini' });
    }

    await prisma.properti.delete({ where: { id } });
    res.json({ status: 'success', message: 'Properti berhasil dihapus' });
  } catch (error) {
    logger.error({ err: error }, 'Error saat menghapus properti');
    next(error);
  }
};

export const verifyPropertySchema = z.object({
  body: z.object({
    status: z.enum(['DITERBITKAN', 'DITOLAK']),
    catatan: z.string().optional()
  })
});

export const getPendingProperties = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const properties = await prisma.properti.findMany({
      where: { status: 'TERTUNDA' },
      include: {
        tuanRumah: { select: { nama: true, email: true } },
        tipe: true
      },
      orderBy: { dibuatPada: 'asc' }
    });
    res.json({ status: 'success', data: properties });
  } catch (error) {
    logger.error({ err: error }, 'Error mengambil properti tertunda');
    next(error);
  }
};

export const verifyProperty = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status, catatan } = req.body;

    const properti = await prisma.properti.findUnique({ where: { id } });
    if (!properti) return res.status(404).json({ status: 'error', message: 'Properti tidak ditemukan' });

    const updatedProperti = await prisma.properti.update({
      where: { id },
      data: { status }
    });

    res.json({ 
      status: 'success', 
      message: `Properti berhasil diubah menjadi ${status}`,
      data: updatedProperti 
    });
  } catch (error) {
    logger.error({ err: error }, 'Error verifikasi properti');
    next(error);
  }
};
