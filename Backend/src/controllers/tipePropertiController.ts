import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Validation Schemas
export const createTipePropertiSchema = z.object({
  body: z.object({
    nama: z.string().min(2, { message: 'Nama tipe properti minimal 2 karakter' }),
    slug: z.string().min(2).optional(),
    deskripsi: z.string().optional(),
  }),
});

export const updateTipePropertiSchema = z.object({
  body: z.object({
    nama: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    deskripsi: z.string().optional(),
  }),
});

export const getAllTipeProperti = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tipeProperti = await prisma.tipeProperti.findMany();
    res.json({ status: 'success', data: tipeProperti });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil semua tipe properti');
    next(error);
  }
};

export const getTipePropertiById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const tipeProperti = await prisma.tipeProperti.findUnique({ where: { id } });

    if (!tipeProperti) {
      return res.status(404).json({ status: 'error', message: 'Tipe properti tidak ditemukan' });
    }

    res.json({ status: 'success', data: tipeProperti });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil tipe properti');
    next(error);
  }
};

export const createTipeProperti = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nama, deskripsi } = req.body;
    let { slug } = req.body;

    if (!slug) {
      slug = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const existingSlug = await prisma.tipeProperti.findUnique({ where: { slug } });
    if (existingSlug) {
      return res.status(400).json({ status: 'error', message: 'Slug tipe properti sudah digunakan' });
    }

    const tipeProperti = await prisma.tipeProperti.create({
      data: { nama, slug, deskripsi },
    });

    res.status(201).json({ status: 'success', data: tipeProperti });
  } catch (error) {
    logger.error({ err: error }, 'Error saat membuat tipe properti');
    next(error);
  }
};

export const updateTipeProperti = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { nama, slug, deskripsi } = req.body;

    if (slug) {
      const existingSlug = await prisma.tipeProperti.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existingSlug) {
        return res.status(400).json({ status: 'error', message: 'Slug tipe properti sudah digunakan' });
      }
    }

    const tipeProperti = await prisma.tipeProperti.update({
      where: { id },
      data: { nama, slug, deskripsi },
    });

    res.json({ status: 'success', data: tipeProperti });
  } catch (error) {
    logger.error({ err: error }, 'Error saat memperbarui tipe properti');
    next(error);
  }
};

export const deleteTipeProperti = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.tipeProperti.delete({ where: { id } });
    res.json({ status: 'success', message: 'Tipe properti berhasil dihapus' });
  } catch (error) {
    logger.error({ err: error }, 'Error saat menghapus tipe properti');
    next(error);
  }
};
