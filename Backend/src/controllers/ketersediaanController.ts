import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// Cek ownership staff
const checkTipeKamarOwnership = async (tipeKamarId: string, penggunaId: string, peran: string) => {
  if (peran === 'ADMIN') return true;

  const tipeKamar = await prisma.tipeKamar.findUnique({
    where: { id: tipeKamarId },
    include: { properti: true }
  });

  if (!tipeKamar) return false;

  if (tipeKamar.properti.tuanRumahId === penggunaId) {
    return true;
  }

  // Cek apakah manager
  const staff = await prisma.propertyStaff.findFirst({
    where: { propertiId: tipeKamar.propertiId, penggunaId, staffRole: 'MANAGER' }
  });

  return !!staff;
};

export const getKetersediaan = async (req: Request, res: Response): Promise<any> => {
  const authReq = req as AuthRequest;
  try {
    const { tipeKamarId } = req.params;
    const { tahun, bulan } = req.query; // format YYYY, MM (1-12)
    const penggunaId = authReq.pengguna?.id;
    const peran = authReq.pengguna?.role;

    if (!penggunaId || !peran) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    if (!tahun || !bulan) {
      return res.status(400).json({ status: 'error', message: 'Parameter tahun dan bulan diperlukan' });
    }

    const isAuthorized = await checkTipeKamarOwnership(tipeKamarId as string, penggunaId, peran);
    if (!isAuthorized) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    const startDate = new Date(parseInt(tahun as string), parseInt(bulan as string) - 1, 1);
    const endDate = new Date(parseInt(tahun as string), parseInt(bulan as string), 0, 23, 59, 59);

    // Ambil tanggal yang diblokir manual
    const blockedDates = await prisma.tanggalBlokir.findMany({
      where: {
        tipeKamarId: tipeKamarId as string,
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Ambil pemesanan aktif
    const bookings = await prisma.detailPemesanan.findMany({
      where: {
        tipeKamarId: tipeKamarId as string,
        pemesanan: {
          status: {
            in: ['PEMBAYARAN', 'DIKONFIRMASI', 'CHECK_IN', 'SELESAI']
          },
          waktuCheckIn: { lte: endDate },
          waktuCheckOut: { gte: startDate }
        }
      },
      include: {
        pemesanan: {
          select: {
            waktuCheckIn: true,
            waktuCheckOut: true,
          }
        }
      }
    });

    res.json({
      status: 'success',
      data: {
        blockedDates: blockedDates.map((b: any) => b.tanggal),
        bookings: bookings.map((b: any) => ({
          jumlahKamar: b.jumlahKamar,
          checkIn: b.pemesanan.waktuCheckIn,
          checkOut: b.pemesanan.waktuCheckOut
        }))
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Error getKetersediaan');
    res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }
};

export const toggleBlockDate = async (req: Request, res: Response): Promise<any> => {
  const authReq = req as AuthRequest;
  try {
    const { tipeKamarId } = req.params;
    const { tanggal } = req.body; // YYYY-MM-DD
    const penggunaId = authReq.pengguna?.id;
    const peran = authReq.pengguna?.role;

    if (!penggunaId || !peran) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const isAuthorized = await checkTipeKamarOwnership(tipeKamarId as string, penggunaId, peran);
    if (!isAuthorized) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    const targetDate = new Date(tanggal);
    // Set to midnight UTC or local? Prisma @db.Date stores as YYYY-MM-DD
    targetDate.setUTCHours(0,0,0,0);

    const existingBlock = await prisma.tanggalBlokir.findUnique({
      where: {
        tipeKamarId_tanggal: {
          tipeKamarId: tipeKamarId as string,
          tanggal: targetDate,
        }
      }
    });

    if (existingBlock) {
      // Unblock
      await prisma.tanggalBlokir.delete({
        where: { id: existingBlock.id }
      });
      return res.json({ status: 'success', message: 'Tanggal berhasil dibuka', action: 'UNBLOCKED' });
    } else {
      // Block
      await prisma.tanggalBlokir.create({
        data: {
          tipeKamarId: tipeKamarId as string,
          tanggal: targetDate
        }
      });
      return res.json({ status: 'success', message: 'Tanggal berhasil diblokir', action: 'BLOCKED' });
    }

  } catch (error) {
    logger.error({ err: error }, 'Error toggleBlockDate');
    res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }
};
