import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// Validasi Webhook Mockup
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
      where: { id: pemesananId }
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

    // Cek apakah sudah ada percobaan pembayaran sebelumnya
    let pembayaran = await prisma.pembayaran.findUnique({
      where: { pemesananId }
    });

    const orderIdMidtrans = `ORDER-${pemesanan.nomorPemesanan}-${Date.now()}`;

    if (pembayaran) {
      pembayaran = await prisma.pembayaran.update({
        where: { pemesananId },
        data: {
          orderIdMidtrans,
          jumlah: pemesanan.totalHarga,
          statusTransaksi: 'pending'
        }
      });
    } else {
      pembayaran = await prisma.pembayaran.create({
        data: {
          pemesananId,
          orderIdMidtrans,
          jumlah: pemesanan.totalHarga,
          statusTransaksi: 'pending'
        }
      });
    }

    // Simulasi respons dari Payment Gateway (Midtrans)
    const mockupMidtransResponse = {
      token: `SIMULATION-TOKEN-${orderIdMidtrans}`,
      redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/SIMULATION-${orderIdMidtrans}`
    };

    res.json({
      status: 'success',
      data: {
        pembayaran,
        paymentGateway: mockupMidtransResponse
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
      await prisma.pemesanan.update({
        where: { id: pembayaran.pemesananId },
        data: { status: statusPemesanan as any }
      });
    }

    res.json({ status: 'success', message: 'Notifikasi pembayaran berhasil diproses' });
  } catch (error) {
    logger.error({ err: error }, 'Error pada webhook pembayaran');
    next(error);
  }
};
