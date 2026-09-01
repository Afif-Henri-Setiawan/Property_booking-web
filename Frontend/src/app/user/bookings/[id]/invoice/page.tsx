"use client";

import { useEffect, useState, use } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Printer, ArrowLeft, Download, Building, User, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface BookingDetail {
  id: string;
  totalHarga: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  statusPembayaran: string;
  statusPemesanan: string;
  tamu: {
    nama: string;
    email: string;
  };
  properti: {
    nama: string;
    alamat: string;
    kota: string;
    tuanRumah: {
      nama: string;
      email: string;
    };
  };
  detail: {
    id: string;
    jumlahMalam: number;
    subtotal: number;
    tipeKamar: {
      nama: string;
    };
    unitKamar: {
      nomorUnit: string;
    } | null;
  }[];
}

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!isLoaded || !isSignedIn) return;
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5000/api/v1/pemesanan/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = await res.json();
        if (data.status === 'success') {
          setBooking(data.data);
        } else {
          toast.error("Gagal mengambil data pesanan");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan sistem");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, isLoaded, isSignedIn, getToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Faktur untuk pesanan ini tidak dapat dimuat.</p>
          <Link href="/user/history" className="text-primary hover:underline">
            Kembali ke Riwayat Pesanan
          </Link>
        </div>
      </div>
    );
  }

  const invoiceNumber = `INV-${booking.id.split('-')[0].toUpperCase()}`;
  const totalMalam = booking.detail.length > 0 ? booking.detail[0].jumlahMalam : 1;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
      <div className="max-w-4xl mx-auto">
        {/* Kontrol (Disembunyikan saat dicetak) */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Link 
            href={`/user/bookings/${id}`}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Detail
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 mr-2" />
            Cetak / Simpan PDF
          </button>
        </div>

        {/* Kertas Invoice */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none">
          {/* Header */}
          <div className="bg-primary px-8 py-10 text-white flex justify-between items-center print:bg-white print:text-black print:border-b-2 print:border-gray-200">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">StayNest</h1>
              <p className="text-primary-100 mt-1 print:text-gray-500">Bukti Pembayaran Reservasi</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-1">INVOICE</h2>
              <p className="font-mono text-primary-100 print:text-gray-600">{invoiceNumber}</p>
            </div>
          </div>

          <div className="p-8">
            {/* Informasi Kontak */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Ditagihkan Kepada
                </h3>
                <div className="text-gray-900 font-medium text-lg">{booking.tamu.nama}</div>
                <div className="text-gray-600 mt-1">{booking.tamu.email}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Informasi Properti
                </h3>
                <div className="text-gray-900 font-medium text-lg">{booking.properti.nama}</div>
                <div className="text-gray-600 mt-1">{booking.properti.alamat}, {booking.properti.kota}</div>
                <div className="text-gray-500 mt-1 text-sm">Host: {booking.properti.tuanRumah.nama}</div>
              </div>
            </div>

            {/* Rincian Reservasi */}
            <div className="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100 print:border-gray-300 print:bg-transparent">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Check-In</div>
                  <div className="font-semibold text-gray-900">
                    {format(new Date(booking.waktuCheckIn), "dd MMM yyyy", { locale: localeId })}
                  </div>
                  <div className="text-sm text-gray-500">14:00</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Check-Out</div>
                  <div className="font-semibold text-gray-900">
                    {format(new Date(booking.waktuCheckOut), "dd MMM yyyy", { locale: localeId })}
                  </div>
                  <div className="text-sm text-gray-500">12:00</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Durasi</div>
                  <div className="font-semibold text-gray-900">{totalMalam} Malam</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    {booking.statusPembayaran === 'LUNAS' ? 'LUNAS' : booking.statusPemesanan}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabel Item */}
            <div className="mb-10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-sm text-gray-600">
                    <th className="pb-3 font-semibold">Tipe Kamar</th>
                    <th className="pb-3 font-semibold">Nomor Kamar</th>
                    <th className="pb-3 font-semibold text-center">Malam</th>
                    <th className="pb-3 font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {booking.detail.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-4">{item.tipeKamar.nama}</td>
                      <td className="py-4 text-gray-500">{item.unitKamar?.nomorUnit || '-'}</td>
                      <td className="py-4 text-center">{item.jumlahMalam}</td>
                      <td className="py-4 text-right font-medium">Rp {item.subtotal.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Section */}
            <div className="flex justify-end">
              <div className="w-full md:w-1/2">
                <div className="flex justify-between py-3 border-b border-gray-100 text-gray-600">
                  <span>Subtotal Pemesanan</span>
                  <span className="font-medium text-gray-900">Rp {booking.totalHarga.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100 text-gray-600">
                  <span>Pajak & Biaya Layanan (Termasuk)</span>
                  <span className="font-medium text-gray-900">Rp 0</span>
                </div>
                <div className="flex justify-between py-4 mt-2">
                  <span className="text-xl font-bold text-gray-900">Total Dibayar</span>
                  <span className="text-2xl font-bold text-primary">Rp {booking.totalHarga.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>Ini adalah tanda terima sah yang dihasilkan oleh sistem secara otomatis.</p>
              <p className="mt-1">Terima kasih telah menggunakan layanan StayNest!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
