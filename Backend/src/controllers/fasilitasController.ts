import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Validation Schemas
export const createFasilitasSchema = z.object({
  body: z.object({
    nama: z.string().min(2, { message: 'Nama fasilitas minimal 2 karakter' }),
    ikon: z.string().optional(),
  }),
});

export const updateFasilitasSchema = z.object({
  body: z.object({
    nama: z.string().min(2).optional(),
    ikon: z.string().optional(),
  }),
});

export const getAllFasilitas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fasilitas = await prisma.fasilitas.findMany();
    res.json({ status: 'success', data: fasilitas });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil semua fasilitas');
    next(error);
  }
};

export const getFasilitasById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const fasilitas = await prisma.fasilitas.findUnique({ where: { id } });

    if (!fasilitas) {
      return res.status(404).json({ status: 'error', message: 'Fasilitas tidak ditemukan' });
    }

    res.json({ status: 'success', data: fasilitas });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil fasilitas');
    next(error);
  }
};

export const createFasilitas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nama, ikon } = req.body;
    const fasilitas = await prisma.fasilitas.create({
      data: { nama, ikon },
    });
    res.status(201).json({ status: 'success', data: fasilitas });
  } catch (error) {
    logger.error({ err: error }, 'Error saat membuat fasilitas');
    next(error);
  }
};

export const updateFasilitas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { nama, ikon } = req.body;

    const fasilitas = await prisma.fasilitas.update({
      where: { id },
      data: { nama, ikon },
    });

    res.json({ status: 'success', data: fasilitas });
  } catch (error) {
    logger.error({ err: error }, 'Error saat memperbarui fasilitas');
    next(error);
  }
};

export const deleteFasilitas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.fasilitas.delete({ where: { id } });
    res.json({ status: 'success', message: 'Fasilitas berhasil dihapus' });
  } catch (error) {
    logger.error({ err: error }, 'Error saat menghapus fasilitas');
    next(error);
  }
};
