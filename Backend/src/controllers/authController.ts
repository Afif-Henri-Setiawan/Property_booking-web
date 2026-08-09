import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Skema Validasi
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Format email tidak valid' }),
    kataSandi: z.string().min(6, { message: 'Kata sandi minimal 6 karakter' }),
    nama: z.string().min(2, { message: 'Nama minimal 2 karakter' }),
    peran: z.enum(['TAMU', 'TUAN_RUMAH']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Format email tidak valid' }),
    kataSandi: z.string().min(1, { message: 'Kata sandi wajib diisi' }),
  }),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, kataSandi, nama, peran } = req.body;

    logger.info(`Percobaan pendaftaran untuk email: ${email}`);

    const existingUser = await prisma.pengguna.findUnique({ where: { email } });
    if (existingUser) {
      logger.warn(`Pendaftaran gagal: Email ${email} sudah terdaftar`);
      return res.status(400).json({ status: 'error', message: 'Email sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(kataSandi, salt);

    const pengguna = await prisma.pengguna.create({
      data: {
        email,
        nama,
        kataSandi: hashedPassword,
        peran: peran || 'TAMU',
      },
    });

    const token = jwt.sign(
      { id: pengguna.id, peran: pengguna.peran },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    logger.info(`Pendaftaran berhasil untuk email: ${email}`);

    res.status(201).json({
      status: 'success',
      data: {
        id: pengguna.id,
        email: pengguna.email,
        nama: pengguna.nama,
        peran: pengguna.peran,
        token,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error saat pendaftaran');
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, kataSandi } = req.body;

    logger.info(`Percobaan masuk untuk email: ${email}`);

    const pengguna = await prisma.pengguna.findUnique({ where: { email } });
    if (!pengguna) {
      logger.warn(`Masuk gagal: Email ${email} tidak ditemukan`);
      return res.status(401).json({ status: 'error', message: 'Kredensial tidak valid' });
    }

    const isMatch = await bcrypt.compare(kataSandi, pengguna.kataSandi);
    if (!isMatch) {
      logger.warn(`Masuk gagal: Kata sandi salah untuk email ${email}`);
      return res.status(401).json({ status: 'error', message: 'Kredensial tidak valid' });
    }

    const token = jwt.sign(
      { id: pengguna.id, peran: pengguna.peran },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    logger.info(`Masuk berhasil untuk email: ${email}`);

    res.json({
      status: 'success',
      data: {
        id: pengguna.id,
        email: pengguna.email,
        nama: pengguna.nama,
        peran: pengguna.peran,
        token,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error saat masuk');
    next(error);
  }
};
