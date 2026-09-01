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
    propertiId: z.string().uuid(),
    waktuCheckIn: z.string().datetime(),
    waktuCheckOut: z.string().datetime(),
    dewasa: z.number().min(1),
    anak: z.number().min(0).default(0),
    bayi: z.number().min(0).default(0),
    kamar: z.array(z.object({
      tipeKamarId: z.string().uuid(),
      paketHargaId: z.string().uuid(),
      jumlahKamar: z.number().min(1)
    })).min(1, { message: 'Pilih minimal 1 kamar' }),
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
      propertiId, waktuCheckIn, waktuCheckOut, 
      dewasa, anak, bayi, kamar, tamuPemesanan 
    } = req.body;

    const checkInDate = new Date(waktuCheckIn);
    const checkOutDate = new Date(waktuCheckOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ status: 'error', message: 'Waktu check-out harus setelah check-in' });
    }

    // Hitung jumlah malam
    const selisihWaktu = checkOutDate.getTime() - checkInDate.getTime();
    const jumlahMalam = Math.ceil(selisihWaktu / (1000 * 3600 * 24));

    let totalMaksDewasa = 0;
    let totalMaksAnak = 0;
    let totalSubtotal = 0;
    const detailPemesanan = [];

    // Validasi dan kalkulasi untuk setiap item di keranjang
    for (const item of kamar) {
      const tipeKamar = await prisma.tipeKamar.findUnique({
        where: { id: item.tipeKamarId, propertiId, status: 'AKTIF' }
      });

      if (!tipeKamar) {
        return res.status(404).json({ status: 'error', message: `Tipe kamar ${item.tipeKamarId} tidak ditemukan atau tidak aktif` });
      }

      totalMaksDewasa += (tipeKamar.maksDewasa || 0) * item.jumlahKamar;
      totalMaksAnak += (tipeKamar.maksAnak || 0) * item.jumlahKamar;

      const paketHarga = await prisma.paketHarga.findUnique({
        where: { id: item.paketHargaId, tipeKamarId: item.tipeKamarId, status: 'AKTIF' }
      });

      if (!paketHarga) {
        return res.status(404).json({ status: 'error', message: 'Paket harga tidak valid' });
      }

      // Cek Tanggal Blokir
      const blockedDates = await prisma.tanggalBlokir.findMany({
        where: {
          tipeKamarId: item.tipeKamarId,
          tanggal: {
            gte: checkInDate,
            lt: checkOutDate, // lt karena hari checkout tidak dihitung menginap
          }
        }
      });

      if (blockedDates.length > 0) {
        return res.status(400).json({ status: 'error', message: `Kamar tipe ${tipeKamar.nama} sedang ditutup/diblokir pada sebagian atau seluruh tanggal yang Anda pilih` });
      }

      // Cek Ketersediaan Kamar
      const totalUnits = await prisma.unitKamar.count({
        where: {
          tipeKamarId: item.tipeKamarId,
          status: { in: ['TERSEDIA', 'TERISI'] },
          blokir: { none: { status: 'AKTIF', tanggalMulai: { lt: checkOutDate }, tanggalSelesai: { gt: checkInDate } } }
        }
      });

      const overlappingBookings = await prisma.detailPemesanan.aggregate({
        _sum: {
          jumlahKamar: true
        },
        where: {
          tipeKamarId: item.tipeKamarId,
          pemesanan: {
            status: { in: ['MENUNGGU_PEMBAYARAN', 'PEMBAYARAN', 'DIKONFIRMASI', 'CHECK_IN'] },
            waktuCheckIn: { lt: checkOutDate },
            waktuCheckOut: { gt: checkInDate }
          }
        }
      });

      const bookedRoomsCount = overlappingBookings._sum.jumlahKamar || 0;
      const availableRoomsCount = totalUnits - bookedRoomsCount;

      if (availableRoomsCount < item.jumlahKamar) {
        return res.status(400).json({ status: 'error', message: `Kamar tipe ${tipeKamar.nama} pada rentang waktu yang dipilih telah penuh. Anda bisa ganti jadwal atau ubah ke tipe kamar lain yang tersedia.` });
      }

      const hargaSatuan = Number(paketHarga.harga);
      const subtotalItem = hargaSatuan * jumlahMalam * item.jumlahKamar;
      totalSubtotal += subtotalItem;

      for (let i = 0; i < item.jumlahKamar; i++) {
        detailPemesanan.push({
          tipeKamarId: item.tipeKamarId,
          paketHargaId: item.paketHargaId,
          jumlahKamar: 1, // Split menjadi per kamar
          hargaSatuan,
          subtotal: hargaSatuan * jumlahMalam
        });
      }
    }

    const totalTamu = dewasa + anak;
    const totalKapasitas = totalMaksDewasa + totalMaksAnak;

    if (totalTamu > totalKapasitas) {
      return res.status(400).json({ status: 'error', message: 'Kapasitas total kamar tidak mencukupi untuk jumlah tamu ini' });
    }

    const biayaLayanan = totalSubtotal * 0.05; 
    const pajak = totalSubtotal * 0.11; 
    const totalHarga = totalSubtotal + biayaLayanan + pajak;

    const pemesanan = await prisma.pemesanan.create({
      data: {
        nomorPemesanan: generateNomorPemesanan(),
        tamuId,
        propertiId,
        waktuCheckIn: checkInDate,
        waktuCheckOut: checkOutDate,
        dewasa,
        anak,
        bayi,
        jumlahMalam,
        subtotal: totalSubtotal,
        biayaLayanan,
        pajak,
        totalHarga,
        status: 'MENUNGGU_PEMBAYARAN',
        kadaluarsaPada: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam
        detail: {
          create: detailPemesanan
        },
        tamuPemesanan: {
          create: tamuPemesanan
        }
      },
      include: {
        detail: { include: { tipeKamar: { select: { nama: true } } } },
        tamuPemesanan: true,
        properti: { select: { nama: true } }
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
    // Auto-batalkan pesanan yang sudah melewati batas waktu (24 jam)
    await prisma.pemesanan.updateMany({
      where: {
        status: 'MENUNGGU_PEMBAYARAN',
        kadaluarsaPada: { lt: new Date() }
      },
      data: { status: 'DIBATALKAN' }
    });

    const tamuId = req.pengguna.id as string;
    const pemesanan = await prisma.pemesanan.findMany({
      where: { tamuId },
      orderBy: { dibuatPada: 'desc' },
      include: {
        properti: { select: { nama: true, kota: true } },
        detail: { include: { tipeKamar: { select: { nama: true } } } },
        ulasan: { select: { id: true } }
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
    // Auto-batalkan pesanan yang sudah melewati batas waktu (24 jam)
    await prisma.pemesanan.updateMany({
      where: {
        status: 'MENUNGGU_PEMBAYARAN',
        kadaluarsaPada: { lt: new Date() }
      },
      data: { status: 'DIBATALKAN' }
    });

    const hostId = req.pengguna.id as string;
    
    // Cari semua properti di mana pengguna menjadi staf (MANAGER atau RECEPTIONIST)
    const myProperties = await prisma.propertyStaff.findMany({
      where: { penggunaId: hostId },
      select: { propertiId: true }
    });
    
    const propertyIds = myProperties.map(p => p.propertiId);

    const pemesanan = await prisma.pemesanan.findMany({
      where: { propertiId: { in: propertyIds } },
      orderBy: { dibuatPada: 'desc' },
      include: {
        properti: { select: { nama: true } },
        detail: { include: { tipeKamar: { select: { nama: true } }, unitKamar: { select: { nomorUnit: true } } } },
        tamu: { select: { nama: true, email: true } }
      }
    });

    res.json({ status: 'success', data: pemesanan });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil daftar pesanan host');
    next(error);
  }
};

// Endpoint untuk Tamu atau Tuan Rumah: Lihat Detail Pesanan berdasarkan ID
export const getPemesananById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Auto-batalkan pesanan yang sudah melewati batas waktu (24 jam)
    await prisma.pemesanan.updateMany({
      where: {
        status: 'MENUNGGU_PEMBAYARAN',
        kadaluarsaPada: { lt: new Date() }
      },
      data: { status: 'DIBATALKAN' }
    });

    const id = req.params.id as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;

    const pemesanan = await prisma.pemesanan.findUnique({
      where: { id },
      include: {
        properti: {
          select: { id: true, nama: true, kota: true, alamat: true, tuanRumahId: true, foto: true, tuanRumah: { select: { nama: true, email: true } } }
        },
        detail: {
          include: {
            tipeKamar: { select: { id: true, nama: true, foto: true } },
            paketHarga: { select: { id: true, nama: true } },
            unitKamar: { select: { id: true, nomorUnit: true } }
          }
        },
        tamuPemesanan: true,
        tamu: { select: { nama: true, email: true } },
        pembayaran: true
      }
    });

    if (!pemesanan) {
      return res.status(404).json({ status: 'error', message: 'Pemesanan tidak ditemukan' });
    }

    // Cek apakah pengguna adalah staf untuk properti ini
    const isStaff = await prisma.propertyStaff.findUnique({
      where: {
        propertiId_penggunaId: {
          propertiId: pemesanan.properti.id,
          penggunaId: penggunaId
        }
      }
    });

    // Hanya tamu bersangkutan, tuan rumah, atau staf yang bisa melihat
    if (pemesanan.tamuId !== penggunaId && pemesanan.properti.tuanRumahId !== penggunaId && !isStaff) {
      return res.status(403).json({ status: 'error', message: 'Akses ditolak' });
    }

    res.json({ status: 'success', data: pemesanan });
  } catch (error) {
    logger.error({ err: error }, 'Error saat mengambil detail pesanan');
    next(error);
  }
};

// Endpoint untuk Tuan Rumah/Admin: Update Status Pemesanan
export const updateBookingStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;
    const { status } = req.body;

    const existing = await prisma.pemesanan.findUnique({
      where: { id },
      include: { properti: true }
    });

    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Pemesanan tidak ditemukan' });
    }

    if (peran === 'HOST') {
      const isStaff = await prisma.propertyStaff.findUnique({
        where: {
          propertiId_penggunaId: {
            propertiId: existing.propertiId,
            penggunaId: penggunaId
          }
        }
      });
      if (!isStaff) {
        return res.status(403).json({ status: 'error', message: 'Tidak diizinkan mengubah pemesanan ini' });
      }
    }

    if (status === 'CHECK_IN') {
      const details = await prisma.detailPemesanan.findMany({ where: { pemesananId: id } });
      for (const detail of details) {
        if (!detail.unitKamarId) {
          // Cari kamar yang tersedia untuk tipe ini
          const availableUnits = await prisma.unitKamar.findMany({
            where: { tipeKamarId: detail.tipeKamarId, status: 'TERSEDIA' },
            take: detail.jumlahKamar
          });

          if (availableUnits.length < detail.jumlahKamar) {
            return res.status(400).json({ status: 'error', message: 'Kamar tidak cukup/tersedia untuk check-in' });
          }

          // Untuk saat ini, kita gunakan unit pertama untuk detail ini
          // (ideal: jika jumlahKamar > 1, skema perlu mendukung multiple unitKamar per detail)
          const assignedUnit = availableUnits[0];

          await prisma.detailPemesanan.update({
            where: { id: detail.id },
            data: { unitKamarId: assignedUnit.id }
          });

          await prisma.checkIn.create({
            data: {
              pemesananId: id,
              unitKamarId: assignedUnit.id,
              discanOleh: req.pengguna.nama || penggunaId
            }
          });

          await prisma.unitKamar.update({
            where: { id: assignedUnit.id },
            data: { status: 'TERISI' }
          });
        }
      }
    }

    if (status === 'SELESAI' || status === 'DIBATALKAN') {
      const details = await prisma.detailPemesanan.findMany({ where: { pemesananId: id } });
      for (const detail of details) {
        if (detail.unitKamarId) {
          await prisma.unitKamar.update({
            where: { id: detail.unitKamarId },
            data: { status: 'TERSEDIA' }
          });
        }
      }
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
    detailPemesananId: z.string().uuid({ message: "ID detail pemesanan wajib diisi" }),
    unitKamarId: z.string().uuid({ message: "ID unit kamar wajib diisi" })
  })
});

export const processPhysicalCheckIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const pemesananId = req.params.id as string;
    const { detailPemesananId, unitKamarId } = req.body;
    const penggunaId = req.pengguna.id as string;
    const peran = req.pengguna.role;

    const pemesanan = await prisma.pemesanan.findUnique({
      where: { id: pemesananId },
      include: { properti: true, detail: true }
    });

    if (!pemesanan) {
      return res.status(404).json({ status: 'error', message: 'Pemesanan tidak ditemukan' });
    }

    const detailItem = pemesanan.detail.find(d => d.id === detailPemesananId);
    if (!detailItem) {
      return res.status(404).json({ status: 'error', message: 'Detail pesanan tidak ditemukan' });
    }

    
    let isStaff = false;
    if (peran === 'HOST') {
      const staff = await prisma.propertyStaff.findUnique({
        where: { propertiId_penggunaId: { propertiId: pemesanan.propertiId, penggunaId } }
      });
      if (staff) isStaff = true;
    }
    if (!isStaff && peran !== 'ADMIN') {

      return res.status(403).json({ status: 'error', message: 'Hanya tuan rumah/admin yang bisa melakukan check-in' });
    }

    if (pemesanan.status !== 'DIKONFIRMASI' && pemesanan.status !== 'CHECK_IN') {
      return res.status(400).json({ status: 'error', message: 'Pemesanan belum dikonfirmasi' });
    }

    const unitKamar = await prisma.unitKamar.findUnique({
      where: { id: unitKamarId }
    });

    if (!unitKamar || unitKamar.tipeKamarId !== detailItem.tipeKamarId) {
      return res.status(400).json({ status: 'error', message: 'Unit kamar tidak cocok atau tidak ditemukan' });
    }

    const transaction = await prisma.$transaction([
      prisma.checkIn.create({
        data: {
          pemesananId,
          unitKamarId,
          discanOleh: req.pengguna.nama || penggunaId
        }
      }),
      prisma.detailPemesanan.update({
        where: { id: detailPemesananId },
        data: { unitKamarId }
      }),
      prisma.pemesanan.update({
        where: { id: pemesananId },
        data: { status: 'CHECK_IN' }
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
    propertiId: z.string().uuid(),
    waktuCheckIn: z.string().datetime(),
    waktuCheckOut: z.string().datetime(),
    dewasa: z.number().min(1),
    anak: z.number().min(0).default(0),
    bayi: z.number().min(0).default(0),
    metodePembayaran: z.string().min(1, { message: "Metode pembayaran wajib diisi" }),
    kamar: z.array(z.object({
      tipeKamarId: z.string().uuid(),
      paketHargaId: z.string().uuid(),
      jumlahKamar: z.number().min(1).max(1)
    })).min(1),
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
      propertiId, waktuCheckIn, waktuCheckOut,
      dewasa, anak, bayi, metodePembayaran, tamuPemesanan, kamar
    } = req.body;

    const checkInDate = new Date(waktuCheckIn);
    const checkOutDate = new Date(waktuCheckOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ status: 'error', message: 'Waktu check-out harus setelah check-in' });
    }

    const selisihWaktu = checkOutDate.getTime() - checkInDate.getTime();
    const jumlahMalam = Math.ceil(selisihWaktu / (1000 * 3600 * 24));
    
    let totalSubtotal = 0;
    const detailPemesanan: any[] = [];

    for (const item of kamar) {
      const tipeKamar = await prisma.tipeKamar.findUnique({
        where: { id: item.tipeKamarId, propertiId, status: 'AKTIF' },
        include: { properti: true, unit: { include: { blokir: true, pemesanan: { include: { pemesanan: true } } } } }
      });

      if (!tipeKamar) return res.status(404).json({ status: 'error', message: 'Tipe kamar tidak ditemukan' });
      if (tipeKamar.properti.tuanRumahId !== resepsionisId && req.pengguna.role !== 'ADMIN') return res.status(403).json({ status: 'error', message: 'Akses ditolak' });

      const paketHarga = await prisma.paketHarga.findUnique({
        where: { id: item.paketHargaId, tipeKamarId: item.tipeKamarId, status: 'AKTIF' }
      });

      if (!paketHarga) return res.status(404).json({ status: 'error', message: 'Paket harga tidak valid' });

      let unitKamarId: string | null = null;
      for (const unit of tipeKamar.unit) {
        const isBlocked = unit.blokir.some(b => b.tanggalMulai < checkOutDate && b.tanggalSelesai > checkInDate);
        const isBooked = unit.pemesanan.some(p => p.pemesanan.status !== 'DIBATALKAN' && p.pemesanan.status !== 'DIKEMBALIKAN' && p.pemesanan.waktuCheckIn < checkOutDate && p.pemesanan.waktuCheckOut > checkInDate);
        if (!isBlocked && !isBooked) {
          unitKamarId = unit.id;
          break;
        }
      }

      if (!unitKamarId) return res.status(400).json({ status: 'error', message: 'Kamar tidak tersedia pada tanggal tersebut' });

      const hargaSatuan = Number(paketHarga.harga);
      const subtotalItem = hargaSatuan * jumlahMalam * item.jumlahKamar;
      totalSubtotal += subtotalItem;
      
      detailPemesanan.push({
        tipeKamarId: item.tipeKamarId,
        paketHargaId: item.paketHargaId,
        unitKamarId,
        jumlahKamar: item.jumlahKamar,
        hargaSatuan,
        subtotal: subtotalItem
      });
    }

    const biayaLayanan = 0; // Bebas biaya layanan online
    const pajak = totalSubtotal * 0.11;
    const totalHarga = totalSubtotal + biayaLayanan + pajak;
    const nomorPemesanan = generateNomorPemesanan();

    const transaction = await prisma.$transaction(async (tx) => {
      const pemesanan = await tx.pemesanan.create({
        data: {
          nomorPemesanan,
          tamuId: resepsionisId, // ID Kasir
          propertiId,
          waktuCheckIn: checkInDate,
          waktuCheckOut: checkOutDate,
          dewasa, anak, bayi, jumlahMalam,
          subtotal: totalSubtotal, biayaLayanan, pajak, totalHarga,
          status: 'DIKONFIRMASI', // Langsung terkonfirmasi
          detail: { create: detailPemesanan },
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
        detail: { include: { tipeKamar: { select: { nama: true } } } },
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

export const checkAvailability = async (req: Request, res: Response): Promise<any> => {
  try {
    const { propertiId, checkIn, checkOut, kamar } = req.body;

    if (!propertiId || !checkIn || !checkOut || !kamar || !Array.isArray(kamar)) {
      return res.status(400).json({ status: 'error', message: 'Data tidak lengkap' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ status: 'error', message: 'Tanggal Check-out harus setelah Check-in' });
    }

    for (const item of kamar) {
      const tipeKamar = await prisma.tipeKamar.findUnique({
        where: { id: item.tipeKamarId, propertiId, status: 'AKTIF' }
      });

      if (!tipeKamar) {
        return res.json({ status: 'error', message: `Tipe kamar tidak ditemukan atau tidak aktif`, data: { available: false } });
      }

      // Cek Tanggal Blokir
      const blockedDates = await prisma.tanggalBlokir.findMany({
        where: {
          tipeKamarId: item.tipeKamarId,
          tanggal: {
            gte: checkInDate,
            lt: checkOutDate, // lt karena hari checkout tidak dihitung menginap
          }
        }
      });

      if (blockedDates.length > 0) {
        return res.json({ status: 'error', message: `Kamar tipe ${tipeKamar.nama} sedang ditutup/diblokir pada rentang tanggal yang Anda pilih`, data: { available: false } });
      }

      // Cek Ketersediaan Kamar
      const totalUnits = await prisma.unitKamar.count({
        where: {
          tipeKamarId: item.tipeKamarId,
          status: { in: ['TERSEDIA', 'TERISI'] },
          blokir: { none: { status: 'AKTIF', tanggalMulai: { lt: checkOutDate }, tanggalSelesai: { gt: checkInDate } } }
        }
      });

      const overlappingBookings = await prisma.detailPemesanan.aggregate({
        _sum: {
          jumlahKamar: true
        },
        where: {
          tipeKamarId: item.tipeKamarId,
          pemesanan: {
            status: { in: ['MENUNGGU_PEMBAYARAN', 'PEMBAYARAN', 'DIKONFIRMASI', 'CHECK_IN'] },
            waktuCheckIn: { lt: checkOutDate },
            waktuCheckOut: { gt: checkInDate }
          }
        }
      });

      const bookedRoomsCount = overlappingBookings._sum.jumlahKamar || 0;
      const availableRoomsCount = totalUnits - bookedRoomsCount;

      if (availableRoomsCount < item.jumlahKamar) {
        return res.json({ status: 'error', message: `Kamar tipe ${tipeKamar.nama} pada rentang waktu yang dipilih telah penuh. Anda bisa ganti jadwal atau ubah ke tipe kamar lain yang tersedia.`, data: { available: false } });
      }
    }

    return res.json({ status: 'success', message: 'Kamar tersedia', data: { available: true } });
  } catch (error) {
    logger.error({ err: error }, 'Error checkAvailability');
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }
};
