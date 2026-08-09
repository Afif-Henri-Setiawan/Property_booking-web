import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const createTipeKasurSchema = z.object({
  body: z.object({
    nama: z.string().min(2, { message: 'Nama tipe kasur minimal 2 karakter' }),
    deskripsi: z.string().optional(),
  }),
});

export const updateTipeKasurSchema = z.object({
  body: z.object({
    nama: z.string().min(2).optional(),
    deskripsi: z.string().optional(),
  }),
});

export const getAllTipeKasur = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tipeKasur = await prisma.tipeKasur.findMany();
    res.json({ status: 'success', data: tipeKasur });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil semua tipe kasur');
    next(error);
  }
};

export const getTipeKasurById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const tipeKasur = await prisma.tipeKasur.findUnique({ where: { id } });

    if (!tipeKasur) {
      return res.status(404).json({ status: 'error', message: 'Tipe kasur tidak ditemukan' });
    }

    res.json({ status: 'success', data: tipeKasur });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil tipe kasur');
    next(error);
  }
};

export const createTipeKasur = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nama, deskripsi } = req.body;
    const tipeKasur = await prisma.tipeKasur.create({
      data: { nama, deskripsi },
    });
    res.status(201).json({ status: 'success', data: tipeKasur });
  } catch (error) {
    logger.error({ err: error }, 'Error saat membuat tipe kasur');
    next(error);
  }
};

export const updateTipeKasur = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { nama, deskripsi } = req.body;

    const tipeKasur = await prisma.tipeKasur.update({
      where: { id },
      data: { nama, deskripsi },
    });

    res.json({ status: 'success', data: tipeKasur });
  } catch (error) {
    logger.error({ err: error }, 'Error saat memperbarui tipe kasur');
    next(error);
  }
};

export const deleteTipeKasur = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.tipeKasur.delete({ where: { id } });
    res.json({ status: 'success', message: 'Tipe kasur berhasil dihapus' });
  } catch (error) {
    logger.error({ err: error }, 'Error saat menghapus tipe kasur');
    next(error);
  }
};
