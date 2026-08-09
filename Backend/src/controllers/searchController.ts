import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const searchProperti = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const kota = req.query.kota as string;
    const tanggalMulai = req.query.tanggalMulai ? new Date(req.query.tanggalMulai as string) : undefined;
    const tanggalSelesai = req.query.tanggalSelesai ? new Date(req.query.tanggalSelesai as string) : undefined;
    const jumlahKamar = parseInt((req.query.jumlahKamar as string) || '1', 10);
    const dewasa = parseInt((req.query.dewasa as string) || '1', 10);
    const anak = parseInt((req.query.anak as string) || '0', 10);

    // 1. Ambil semua properti yang DITERBITKAN dan cocok dengan lokasi serta kapasitas dasar kamar
    const properties = await prisma.properti.findMany({
      where: {
        status: 'DITERBITKAN',
        OR: kota ? [
          { kota: { contains: kota, mode: 'insensitive' } },
          { alamat: { contains: kota, mode: 'insensitive' } },
          { provinsi: { contains: kota, mode: 'insensitive' } }
        ] : undefined,
        tipeKamar: {
          some: {
            status: 'AKTIF',
            maksDewasa: { gte: dewasa },
            maksAnak: { gte: anak }
          }
        }
      },
      include: {
        tipe: true,
        foto: { where: { isUtama: true } },
        tipeKamar: {
          where: {
            status: 'AKTIF',
            maksDewasa: { gte: dewasa },
            maksAnak: { gte: anak }
          },
          include: {
            paketHarga: { where: { status: 'AKTIF' } },
            unit: {
              where: { status: 'TERSEDIA' },
              include: {
                blokir: {
                  where: tanggalMulai && tanggalSelesai ? {
                    status: 'AKTIF',
                    OR: [
                      {
                        tanggalMulai: { lt: tanggalSelesai },
                        tanggalSelesai: { gt: tanggalMulai }
                      }
                    ]
                  } : undefined
                },
                pemesanan: {
                  where: tanggalMulai && tanggalSelesai ? {
                    status: {
                      in: ['MENUNGGU_PEMBAYARAN', 'PEMBAYARAN', 'DIKONFIRMASI', 'CHECK_IN']
                    },
                    OR: [
                      {
                        waktuCheckIn: { lt: tanggalSelesai },
                        waktuCheckOut: { gt: tanggalMulai }
                      }
                    ]
                  } : undefined
                }
              }
            }
          }
        }
      }
    });

    // 2. Filter in-memory berdasarkan ketersediaan unit yang riil (jika ada input tanggal)
    let availableProperties = properties;

    if (tanggalMulai && tanggalSelesai) {
      availableProperties = properties.filter(prop => {
        // Cek apakah ada minimal 1 tipe kamar yang punya cukup unit
        const hasAvailableRoomType = prop.tipeKamar.some(kamar => {
          // Unit dianggap tersedia jika tidak ada blokir dan tidak ada pemesanan yang tumpang tindih
          const availableUnitsCount = kamar.unit.filter(u => u.blokir.length === 0 && u.pemesanan.length === 0).length;
          return availableUnitsCount >= jumlahKamar;
        });
        return hasAvailableRoomType;
      });
    }

    // 3. Mapping data untuk response (bersihkan data relasional yang terlalu dalam)
    const result = availableProperties.map(prop => ({
      id: prop.id,
      nama: prop.nama,
      tipe: prop.tipe.nama,
      kota: prop.kota,
      provinsi: prop.provinsi,
      fotoUtama: prop.foto.length > 0 ? prop.foto[0].url : null,
      hargaMulaiDari: prop.tipeKamar.length > 0 ? Math.min(...prop.tipeKamar.map(k => Number(k.hargaDasar))) : null
    }));

    res.json({ status: 'success', data: result, total: result.length });
  } catch (error) {
    logger.error({ err: error }, 'Error saat melakukan pencarian properti');
    next(error);
  }
};
