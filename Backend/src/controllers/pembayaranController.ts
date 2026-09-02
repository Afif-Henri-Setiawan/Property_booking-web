import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';
import { snap } from '../utils/midtrans';
import { sendInvoiceEmail } from '../utils/emailSender';

const prisma = new PrismaClient();

// Validasi Webhook
export const webhookSchema = z.object({
  body: z.object({
    order_id: z.string(),
    transaction_status: z.string(),
    transaction_id: z.string().optional(),
    payment_type: z.string().optional(),
    fraud_status: z.string().optional(),
  }),
});

// Endpoint untuk Tamu: Membuat Invoice/Token Pembayaran
export const buatPembayaran = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const pemesananId = req.params.pemesananId as string;
    const tamuId = req.pengguna.id as string;

    const pemesanan = await prisma.pemesanan.findUnique({
      where: { id: pemesananId },
      include: { tamu: true, properti: true }
    });

    if (!pemesanan) {
      return res.status(404).json({ status: 'error', message: 'Pemesanan tidak ditemukan' });
    }

    if (pemesanan.tamuId !== tamuId) {
      return res.status(403).json({ status: 'error', message: 'Akses ditolak' });
    }

    if (pemesanan.status !== 'MENUNGGU_PEMBAYARAN') {
      return res.status(400).json({ status: 'error', message: 'Status pesanan saat ini tidak dapat dibayar' });
    }

    let pembayaran = await prisma.pembayaran.findUnique({
      where: { pemesananId }
    });

    const orderIdMidtrans = `ORDER-${pemesanan.nomorPemesanan}-${Date.now()}`;
    const jumlahBiaya = Math.round(Number(pemesanan.totalHarga)); // Midtrans expects integer/number for IDR

    if (pembayaran) {
      pembayaran = await prisma.pembayaran.update({
        where: { pemesananId },
        data: {
          orderIdMidtrans,
          jumlah: jumlahBiaya,
          statusTransaksi: 'pending'
        }
      });
    } else {
      pembayaran = await prisma.pembayaran.create({
        data: {
          pemesananId,
          orderIdMidtrans,
          jumlah: jumlahBiaya,
          statusTransaksi: 'pending'
        }
      });
    }

    // Buat parameter transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderIdMidtrans,
        gross_amount: jumlahBiaya
      },
      customer_details: {
        first_name: pemesanan.tamu.nama,
        email: pemesanan.tamu.email
      },
      item_details: [{
        id: pemesanan.propertiId,
        price: jumlahBiaya,
        quantity: 1,
        name: `Pemesanan ${pemesanan.properti.nama}`.substring(0, 50)
      }]
    };

    const transaction = await snap.createTransaction(parameter);

    res.json({
      status: 'success',
      data: {
        pembayaran,
        paymentGateway: transaction // contains token and redirect_url
      }
    });
  } catch (error) {
    logger.error({ err: error }, 'Error saat membuat pembayaran');
    next(error);
  }
};

// Endpoint Publik: Webhook (Menerima Notifikasi dari Midtrans)
export const webhookPembayaran = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id, transaction_status, transaction_id, payment_type, fraud_status } = req.body;

    const pembayaran = await prisma.pembayaran.findUnique({
      where: { orderIdMidtrans: order_id }
    });

    if (!pembayaran) {
      return res.status(404).json({ status: 'error', message: 'Order tidak ditemukan' });
    }

    // Update status tabel pembayaran
    await prisma.pembayaran.update({
      where: { id: pembayaran.id },
      data: {
        transaksiIdMidtrans: transaction_id,
        metodePembayaran: payment_type,
        statusTransaksi: transaction_status,
        statusPenipuan: fraud_status,
        dibayarPada: transaction_status === 'settlement' || transaction_status === 'capture' ? new Date() : null
      }
    });

    // Sesuaikan status tabel pemesanan
    let statusPemesanan = 'MENUNGGU_PEMBAYARAN';
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      statusPemesanan = 'DIKONFIRMASI';
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      statusPemesanan = 'DIBATALKAN';
    }

    if (statusPemesanan !== 'MENUNGGU_PEMBAYARAN') {
      const updatedPemesanan = await prisma.pemesanan.update({
        where: { id: pembayaran.pemesananId },
        data: { status: statusPemesanan as any },
        include: {
          tamu: true,
          properti: true
        }
      });

      // Kirim email invoice jika status menjadi DIKONFIRMASI
      if (statusPemesanan === 'DIKONFIRMASI' && updatedPemesanan.tamu) {
        sendInvoiceEmail({
          tamuEmail: updatedPemesanan.tamu.email,
          tamuNama: updatedPemesanan.tamu.nama,
          nomorPemesanan: updatedPemesanan.id.split('-')[0].toUpperCase(),
          namaProperti: updatedPemesanan.properti.nama,
          totalHarga: Number(updatedPemesanan.totalHarga),
          waktuCheckIn: updatedPemesanan.waktuCheckIn.toISOString().split('T')[0],
          waktuCheckOut: updatedPemesanan.waktuCheckOut.toISOString().split('T')[0],
          pemesananId: updatedPemesanan.id
        }).catch(err => logger.error({ err }, 'Gagal mengirim email secara asinkron di webhook'));
      }
    }

    res.json({ status: 'success', message: 'Notifikasi pembayaran berhasil diproses' });
  } catch (error) {
    logger.error({ err: error }, 'Error pada webhook pembayaran');
    next(error);
  }
};

// Endpoint untuk cek status transaksi manual (Sync dari Midtrans)
export const syncStatusPembayaran = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const pemesananId = req.params.pemesananId as string;
    
    const pembayaran = await prisma.pembayaran.findUnique({
      where: { pemesananId }
    });

    if (!pembayaran || !pembayaran.orderIdMidtrans) {
      return res.status(404).json({ status: 'error', message: 'Transaksi pembayaran tidak ditemukan' });
    }

    // Gunakan Snap client untuk mengecek status dari Midtrans
    const statusResponse = await snap.transaction.status(pembayaran.orderIdMidtrans);
    const { transaction_status, transaction_id, payment_type, fraud_status } = statusResponse;

    // Update status tabel pembayaran
    await prisma.pembayaran.update({
      where: { id: pembayaran.id },
      data: {
        transaksiIdMidtrans: transaction_id,
        metodePembayaran: payment_type,
        statusTransaksi: transaction_status,
        statusPenipuan: fraud_status,
        dibayarPada: transaction_status === 'settlement' || transaction_status === 'capture' ? new Date() : null
      }
    });

    // Sesuaikan status tabel pemesanan
    let statusPemesanan = 'MENUNGGU_PEMBAYARAN';
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      statusPemesanan = 'DIKONFIRMASI';
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      statusPemesanan = 'DIBATALKAN';
    }

    if (statusPemesanan !== 'MENUNGGU_PEMBAYARAN') {
      await prisma.pemesanan.update({
        where: { id: pembayaran.pemesananId },
        data: { status: statusPemesanan as any }
      });
    }

    res.json({ 
      status: 'success', 
      message: 'Status pembayaran berhasil disinkronisasi',
      data: {
        statusTransaksi: transaction_status,
        statusPemesanan
      }
    });
  } catch (error) {
    logger.error({ err: error }, 'Error saat sinkronisasi status pembayaran');
    // Jika tidak ditemukan di midtrans, mungkin belum dibayar atau order invalid
    return res.status(500).json({ status: 'error', message: 'Gagal mendapatkan status dari payment gateway' });
  }
};
