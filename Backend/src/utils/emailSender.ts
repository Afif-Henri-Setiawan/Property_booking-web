import nodemailer from 'nodemailer';
import { logger } from './logger';
import dotenv from 'dotenv';

dotenv.config();

// Konfigurasi transporter Nodemailer (Default: SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface SendInvoiceEmailParams {
  tamuEmail: string;
  tamuNama: string;
  nomorPemesanan: string;
  namaProperti: string;
  totalHarga: number;
  waktuCheckIn: string;
  waktuCheckOut: string;
  pemesananId: string;
}

export const sendInvoiceEmail = async (params: SendInvoiceEmailParams) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('SMTP_USER atau SMTP_PASS belum dikonfigurasi. Mengabaikan pengiriman email.');
    return;
  }

  const invoiceUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/bookings/${params.pemesananId}/invoice`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1a56db; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0;">StayNest</h1>
      </div>
      <div style="padding: 20px;">
        <h2 style="color: #1a56db;">Pembayaran Berhasil!</h2>
        <p>Halo <strong>${params.tamuNama}</strong>,</p>
        <p>Terima kasih atas pesanan Anda. Pembayaran untuk pesanan Anda di <strong>${params.namaProperti}</strong> telah kami terima.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Nomor Pemesanan</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${params.nomorPemesanan}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Check-In</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${params.waktuCheckIn}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Check-Out</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${params.waktuCheckOut}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-size: 1.1em;"><strong>Total Harga</strong></td>
            <td style="padding: 8px; font-size: 1.1em; color: #1a56db;"><strong>Rp ${params.totalHarga.toLocaleString('id-ID')}</strong></td>
          </tr>
        </table>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${invoiceUrl}" style="background-color: #1a56db; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
            Lihat & Unduh Invoice
          </a>
        </div>
        
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
          Simpan email ini sebagai referensi. Jika Anda memiliki pertanyaan, silakan membalas pesan ini atau hubungi layanan pelanggan kami.
        </p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"StayNest" <${process.env.SMTP_USER}>`,
      to: params.tamuEmail,
      subject: `Invoice Pembayaran Berhasil: ${params.nomorPemesanan}`,
      html: htmlContent,
    });
    
    logger.info({ messageId: info.messageId }, 'Email invoice berhasil dikirim');
  } catch (error) {
    logger.error({ err: error }, 'Gagal mengirim email invoice');
  }
};
