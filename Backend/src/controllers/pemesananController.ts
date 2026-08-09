import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// Utils: Generate Nomor Pemesanan
const generateNomorPemesanan = () => {
  return `BKG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
};

// Validasi Zod
export const createPemesananSchema = z.object({
  body: z.object({
    tipeKamarId: z.string().uuid(),
    paketHargaId: z.string().uuid(),
    waktuCheckIn: z.string().datetime(),
    waktuCheckOut: z.string().datetime(),
    dewasa: z.number().min(1),
    anak: z.number().min(0).default(0),
    bayi: z.number().min(0).default(0),
    // Untuk menyederhanakan MVP, kita paksa pesanan 1 unit kamar per transaksi agar unit bisa langsung di-assign
    jumlahKamar: z.number().min(1).max(1, { message: 'Saat ini hanya mendukung pemesanan 1 kamar per transaksi' }),
    tamuPemesanan: z.array(z.object({
      nama: z.string().min(2),
      email: z.string().email().optional(),
      telepon: z.string().optional(),
      tipeTamu: z.enum(['DEWASA', 'ANAK', 'BAYI']).default('DEWASA')
    })).min(1, { message: 'Data tamu harus diisi minimal 1' })
  }),
});

export const updateStatusPemesananSchema = z.object({
  body: z.object({
    status: z.enum(['MENUNGGU_PEMBAYARAN', 'PEMBAYARAN', 'DIKONFIRMASI', 'CHECK_IN', 'SELESAI', 'DIBATALKAN', 'KADALUARSA', 'DIKEMBALIKAN'])
  }),
});

// Endpoint untuk Tamu: Membuat Pemesanan
export const createPemesanan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tamuId = req.pengguna.id as string;
    const { 
      tipeKamarId, paketHargaId, waktuCheckIn, waktuCheckOut, 
      dewasa, anak, bayi, jumlahKamar, tamuPemesanan 
    } = req.body;

    const checkInDate = new Date(waktuCheckIn);
    const checkOutDate = new Date(waktuCheckOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ status: 'error', message: 'Waktu check-out harus setelah check-in' });
    }

    // Hitung jumlah malam
    const selisihWaktu = checkOutDate.getTime() - checkInDate.getTime();
    const jumlahMalam = Math.ceil(selisihWaktu / (1000 * 3600 * 24));

    // 1. Ambil data tipe kamar dan paket harga untuk validasi kapasitas & harga
    const tipeKamar = await prisma.tipeKamar.findUnique({
      where: { id: tipeKamarId, status: 'AKTIF' },
      include: { properti: true }
    });

    if (!tipeKamar) {
      return res.status(404).json({ status: 'error', message: 'Tipe kamar tidak ditemukan atau tidak aktif' });
    }

    if (dewasa > tipeKamar.maksDewasa || anak > tipeKamar.maksAnak) {
      return res.status(400).json({ status: 'error', message: 'Kapasitas kamar tidak mencukupi untuk jumlah tamu ini' });
    }

    const paketHarga = await prisma.paketHarga.findUnique({
      where: { id: paketHargaId, tipeKamarId, status: 'AKTIF' }
    });

    if (!paketHarga) {
      return res.status(404).json({ status: 'error', message: 'Paket harga tidak valid' });
    }

    // 2. Cek Ketersediaan Unit Fisik dan alokasikan 1 unit yang kosong
    const availableUnits = await prisma.unitKamar.findMany({
      where: {
        tipeKamarId,
        status: 'TERSEDIA',
        blokir: {
          none: {
            status: 'AKTIF',
            tanggalMulai: { lt: checkOutDate },
            tanggalSelesai: { gt: checkInDate }
          }
        },
        pemesanan: {
          none: {
            status: { in: ['MENUNGGU_PEMBAYARAN', 'PEMBAYARAN', 'DIKONFIRMASI', 'CHECK_IN'] },
            waktuCheckIn: { lt: checkOutDate },
            waktuCheckOut: { gt: checkInDate }
          }
        }
      },
      take: 1
    });

    if (availableUnits.length < 1) {
      return res.status(400).json({ status: 'error', message: 'Maaf, kamar tidak tersedia pada tanggal tersebut' });
    }

    const unitKamarId = availableUnits[0].id;

    // 3. Hitung Harga
    const hargaPerMalam = Number(paketHarga.harga);
    const subtotal = hargaPerMalam * jumlahMalam;
    const biayaLayanan = subtotal * 0.05; // Contoh 5% service charge
    const pajak = subtotal * 0.11; // PPN 11%
    const totalHarga = subtotal + biayaLayanan + pajak;

    // 4. Buat Pemesanan dengan Transaction
    const pemesanan = await prisma.pemesanan.create({
      data: {
        nomorPemesanan: generateNomorPemesanan(),
        tamuId,
        propertiId: tipeKamar.propertiId,
        tipeKamarId,
        unitKamarId,
        paketHargaId,
        waktuCheckIn: checkInDate,
        waktuCheckOut: checkOutDate,
        dewasa,
        anak,
        bayi,
        jumlahKamar: 1,
        jumlahMalam,
        subtotal,
        biayaLayanan,
        pajak,
        totalHarga,
        status: 'MENUNGGU_PEMBAYARAN',
        kadaluarsaPada: new Date(Date.now() + 60 * 60 * 1000), // 1 jam untuk bayar
        tamuPemesanan: {
          create: tamuPemesanan
        }
      },
      include: {
        tamuPemesanan: true,
        properti: { select: { nama: true } },
        tipeKamar: { select: { nama: true } }
      }
    });

    res.status(201).json({ status: 'success', data: pemesanan });
  } catch (error) {
    logger.error({ err: error }, 'Error saat membuat pemesanan');
    next(error);
  }
};

// Endpoint untuk Tamu: Lihat Riwayat Pesanan Sendiri
export const getMyBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tamuId = req.pengguna.id as string;
    const pemesanan = await prisma.pemesanan.findMany({
      where: { tamuId },
      orderBy: { dibuatPada: 'desc' },
      include: {
        properti: { select: { nama: true, kota: true } },
        tipeKamar: { select: { nama: true } }
      }
    });
    res.json({ status: 'success', data: pemesanan });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil daftar pesanan tamu');
    next(error);
  }
};

// Endpoint untuk Tuan Rumah: Lihat Pesanan Masuk
export const getHostBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const hostId = req.pengguna.id as string;
    
    // Cari semua properti milik host
    const myProperties = await prisma.properti.findMany({
      where: { tuanRumahId: hostId },
      select: { id: true }
    });
    
    const propertyIds = myProperties.map(p => p.id);

    const pemesanan = await prisma.pemesanan.findMany({
      where: { propertiId: { in: propertyIds } },
      orderBy: { dibuatPada: 'desc' },
      include: {
        properti: { select: { nama: true } },
        tipeKamar: { select: { nama: true } },
        tamu: { select: { nama: true, email: true } }
      }
    });

    res.json({ status: 'success', data: pemesanan });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil daftar pesanan host');
    next(error);
  }
};

// Endpoint untuk Tuan Rumah/Admin: Update Status Pemesanan
export const updateBookingStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.peran;
    const { status } = req.body;

    const existing = await prisma.pemesanan.findUnique({
      where: { id },
      include: { properti: true }
    });

    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Pemesanan tidak ditemukan' });
    }

    if (peran === 'TUAN_RUMAH' && existing.properti.tuanRumahId !== penggunaId) {
      return res.status(403).json({ status: 'error', message: 'Tidak diizinkan mengubah pemesanan ini' });
    }

    const pemesanan = await prisma.pemesanan.update({
      where: { id },
      data: { status }
    });

    res.json({ status: 'success', data: pemesanan });
  } catch (error) {
    logger.error({ err: error }, 'Error saat update status pemesanan');
    next(error);
  }
};

export const checkInSchema = z.object({
  body: z.object({
    unitKamarId: z.string().uuid({ message: "ID unit kamar wajib diisi" })
  })
});

export const processPhysicalCheckIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const pemesananId = req.params.id as string;
    const { unitKamarId } = req.body;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.peran;

    const pemesanan = await prisma.pemesanan.findUnique({
      where: { id: pemesananId },
      include: { properti: true }
    });

    if (!pemesanan) {
      return res.status(404).json({ status: 'error', message: 'Pemesanan tidak ditemukan' });
    }

    if (pemesanan.properti.tuanRumahId !== penggunaId && peran !== 'ADMIN') {
      return res.status(403).json({ status: 'error', message: 'Hanya tuan rumah/admin yang bisa melakukan check-in' });
    }

    if (pemesanan.status !== 'DIKONFIRMASI') {
      return res.status(400).json({ status: 'error', message: 'Pemesanan belum dikonfirmasi atau sudah diproses' });
    }

    // Pastikan kamar benar-benar tersedia / bagian dari tipe kamar yang dipesan
    const unitKamar = await prisma.unitKamar.findUnique({
      where: { id: unitKamarId }
    });

    if (!unitKamar || unitKamar.tipeKamarId !== pemesanan.tipeKamarId) {
      return res.status(400).json({ status: 'error', message: 'Unit kamar tidak cocok atau tidak ditemukan' });
    }

    const transaction = await prisma.$transaction([
      // 1. Buat log CheckIn
      prisma.checkIn.create({
        data: {
          pemesananId,
          unitKamarId,
          discanOleh: req.pengguna.nama || penggunaId
        }
      }),
      // 2. Ubah status pemesanan
      prisma.pemesanan.update({
        where: { id: pemesananId },
        data: {
          status: 'CHECK_IN',
          unitKamarId // Assign tamu secara fisik ke kamar tersebut
        }
      })
    ]);

    res.json({ status: 'success', message: 'Check-In berhasil dicatat', data: transaction[0] });
  } catch (error) {
    logger.error({ err: error }, 'Error saat melakukan physical check-in');
    next(error);
  }
};

export const createWalkInBookingSchema = z.object({
  body: z.object({
    tipeKamarId: z.string().uuid(),
    paketHargaId: z.string().uuid(),
    waktuCheckIn: z.string().datetime(),
    waktuCheckOut: z.string().datetime(),
    dewasa: z.number().min(1),
    anak: z.number().min(0).default(0),
    bayi: z.number().min(0).default(0),
    jumlahKamar: z.number().min(1).max(1),
    metodePembayaran: z.string().min(1, { message: "Metode pembayaran wajib diisi" }),
    tamuPemesanan: z.array(z.object({
      nama: z.string().min(2),
      email: z.string().email().optional(),
      telepon: z.string().optional(),
      tipeTamu: z.enum(['DEWASA', 'ANAK', 'BAYI']).default('DEWASA')
    })).min(1)
  }),
});

export const createWalkInBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resepsionisId = req.pengguna.id as string;
    const {
      tipeKamarId, paketHargaId, waktuCheckIn, waktuCheckOut,
      dewasa, anak, bayi, jumlahKamar, metodePembayaran, tamuPemesanan
    } = req.body;

    const checkInDate = new Date(waktuCheckIn);
    const checkOutDate = new Date(waktuCheckOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ status: 'error', message: 'Waktu check-out harus setelah check-in' });
    }

    const selisihWaktu = checkOutDate.getTime() - checkInDate.getTime();
    const jumlahMalam = Math.ceil(selisihWaktu / (1000 * 3600 * 24));

    const tipeKamar = await prisma.tipeKamar.findUnique({
      where: { id: tipeKamarId, status: 'AKTIF' },
      include: { properti: true, unit: { include: { blokir: true, pemesanan: true } } }
    });

    if (!tipeKamar) {
      return res.status(404).json({ status: 'error', message: 'Tipe kamar tidak ditemukan' });
    }

    if (tipeKamar.properti.tuanRumahId !== resepsionisId && req.pengguna.peran !== 'ADMIN') {
       return res.status(403).json({ status: 'error', message: 'Akses ditolak' });
    }

    const paketHarga = await prisma.paketHarga.findUnique({
      where: { id: paketHargaId, tipeKamarId, status: 'AKTIF' }
    });

    if (!paketHarga) return res.status(404).json({ status: 'error', message: 'Paket harga tidak valid' });

    let unitKamarId: string | null = null;
    for (const unit of tipeKamar.unit) {
      const isBlocked = unit.blokir.some(b => b.tanggalMulai < checkOutDate && b.tanggalSelesai > checkInDate);
      const isBooked = unit.pemesanan.some(p => p.status !== 'DIBATALKAN' && p.status !== 'DIKEMBALIKAN' && p.waktuCheckIn < checkOutDate && p.waktuCheckOut > checkInDate);
      if (!isBlocked && !isBooked) {
        unitKamarId = unit.id;
        break;
      }
    }

    if (!unitKamarId) {
      return res.status(400).json({ status: 'error', message: 'Kamar tidak tersedia pada tanggal tersebut' });
    }

    const subtotal = Number(paketHarga.harga) * jumlahMalam;
    const biayaLayanan = 0; // Bebas biaya layanan online
    const pajak = subtotal * 0.11;
    const totalHarga = subtotal + biayaLayanan + pajak;
    const nomorPemesanan = generateNomorPemesanan();

    const transaction = await prisma.$transaction(async (tx) => {
      const pemesanan = await tx.pemesanan.create({
        data: {
          nomorPemesanan,
          tamuId: resepsionisId, // ID Kasir
          propertiId: tipeKamar.propertiId,
          tipeKamarId,
          unitKamarId,
          paketHargaId,
          waktuCheckIn: checkInDate,
          waktuCheckOut: checkOutDate,
          dewasa, anak, bayi, jumlahKamar, jumlahMalam,
          subtotal, biayaLayanan, pajak, totalHarga,
          status: 'DIKONFIRMASI', // Langsung terkonfirmasi
          tamuPemesanan: { create: tamuPemesanan }
        },
        include: { tamuPemesanan: true }
      });

      const pembayaran = await tx.pembayaran.create({
        data: {
          pemesananId: pemesanan.id,
          jumlah: totalHarga,
          metodePembayaran: metodePembayaran,
          statusTransaksi: 'settlement',
          dibayarPada: new Date()
        }
      });

      return { pemesanan, pembayaran };
    });

    res.status(201).json({ status: 'success', data: transaction });
  } catch (error) {
    logger.error({ err: error }, 'Error membuat walk-in booking');
    next(error);
  }
};

export const getTiketByNomor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nomor = req.params.nomor as string;
    
    const pemesanan = await prisma.pemesanan.findUnique({
      where: { nomorPemesanan: nomor },
      include: {
        tamuPemesanan: true,
        properti: { select: { nama: true, kota: true } },
        tipeKamar: { select: { nama: true } },
        pembayaran: true
      }
    });

    if (!pemesanan) {
      return res.status(404).json({ status: 'error', message: 'Tiket tidak ditemukan' });
    }

    res.json({ status: 'success', data: pemesanan });
  } catch (error) {
    logger.error({ err: error }, 'Error mengambil tiket');
    next(error);
  }
};
