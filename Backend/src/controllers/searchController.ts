import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const searchProperti = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const kota = req.query.kota as string;
    const tipe = req.query.tipe as string;
    const hargaStr = req.query.harga as string;
    const tanggalMulai = req.query.tanggalMulai ? new Date(req.query.tanggalMulai as string) : undefined;
    const tanggalSelesai = req.query.tanggalSelesai ? new Date(req.query.tanggalSelesai as string) : undefined;
    const jumlahKamar = req.query.jumlahKamar ? parseInt(req.query.jumlahKamar as string, 10) : undefined;
    const dewasa = req.query.dewasa ? parseInt(req.query.dewasa as string, 10) : undefined;
    const anak = req.query.anak ? parseInt(req.query.anak as string, 10) : undefined;

    let hargaMin: number | undefined;
    let hargaMax: number | undefined;
    if (hargaStr) {
      const parts = hargaStr.split('-');
      if (parts.length === 2) {
        if (parts[0]) hargaMin = Number(parts[0]);
        if (parts[1]) hargaMax = Number(parts[1]);
      }
    }

    // 1. Ambil semua properti yang DITERBITKAN dan cocok dengan lokasi serta kapasitas dasar kamar
    const properties = await prisma.properti.findMany({
      where: {
        status: 'DITERBITKAN',
        OR: kota ? [
          { kota: { contains: kota, mode: 'insensitive' } },
          { alamat: { contains: kota, mode: 'insensitive' } },
          { provinsi: { contains: kota, mode: 'insensitive' } }
        ] : undefined,
        tipe: tipe ? { nama: { contains: tipe, mode: 'insensitive' } } : undefined,
        tipeKamar: {
          some: {
            status: 'AKTIF',
            maksDewasa: dewasa ? { gte: dewasa } : undefined,
            maksAnak: anak ? { gte: anak } : undefined,
            hargaDasar: {
              gte: hargaMin !== undefined ? hargaMin : undefined,
              lte: hargaMax !== undefined ? hargaMax : undefined
            }
          }
        }
      },
      include: {
        tipe: true,
        foto: { where: { isUtama: true } },
        tipeKamar: {
          where: {
            status: 'AKTIF',
            maksDewasa: dewasa ? { gte: dewasa } : undefined,
            maksAnak: anak ? { gte: anak } : undefined,
            hargaDasar: {
              gte: hargaMin !== undefined ? hargaMin : undefined,
              lte: hargaMax !== undefined ? hargaMax : undefined
            }
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
                    pemesanan: {
                      status: {
                        in: ['MENUNGGU_PEMBAYARAN', 'PEMBAYARAN', 'DIKONFIRMASI', 'CHECK_IN']
                      },
                      OR: [
                        {
                          waktuCheckIn: { lt: tanggalSelesai },
                          waktuCheckOut: { gt: tanggalMulai }
                        }
                      ]
                    }
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
          return availableUnitsCount >= (jumlahKamar || 1);
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
