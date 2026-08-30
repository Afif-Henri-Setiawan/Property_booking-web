"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar, MapPin, CreditCard, ChevronLeft, Building, Loader2, Info, ChevronRight, RefreshCw, Printer } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface BookingDetail {
  id: string;
  nomorPemesanan: string;
  waktuCheckIn: string;
  waktuCheckOut: string;
  dewasa: number;
  anak: number;
  jumlahMalam: number;
  subtotal: number;
  biayaLayanan: number;
  pajak: number;
  totalHarga: number;
  status: string;
  properti: {
    nama: string;
    kota: string;
    alamat: string;
    foto: any;
  };
  detail: Array<{
    tipeKamar: {
      nama: string;
      foto: any;
    };
    paketHarga: {
      nama: string;
    };
    jumlahKamar: number;
    hargaSatuan: number;
    subtotal: number;
  }>;
  tamuPemesanan: Array<{
    nama: string;
    email: string;
    telepon: string;
  }>;
  tamu: {
    nama: string;
    email: string;
  };
  pembayaran?: {
    orderIdMidtrans: string;
    metodePembayaran: string | null;
    statusTransaksi: string;
    dibayarPada: string | null;
  };
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!isLoaded || !isSignedIn || !bookingId) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = await getToken();
        
        const res = await fetch(`${apiUrl}/pemesanan/${bookingId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Gagal memuat pesanan');
        
        setBooking(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [isLoaded, isSignedIn, getToken, bookingId]);

  // Auto-sync effect for pending payments
  useEffect(() => {
    if (booking?.status === 'MENUNGGU_PEMBAYARAN' && booking.pembayaran?.orderIdMidtrans) {
      const autoSync = async () => {
        try {
          const token = await getToken();
          const response = await fetch(`http://localhost:5000/api/v1/pembayaran/${booking.id}/sync`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.data?.statusPemesanan === 'DIKONFIRMASI') {
              window.location.reload();
            }
          }
        } catch (e) {
          console.error("Auto-sync failed silently", e);
        }
      };
      // Kasih delay sedikit sebelum auto-sync
      const timeoutId = setTimeout(autoSync, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [booking, getToken]);

  const handlePaymentRetry = async () => {
    try {
      setIsPaymentLoading(true);
      
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`http://localhost:5000/api/v1/pembayaran/${booking?.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Gagal memproses pembayaran');
      }

      if (data.data?.paymentGateway?.token) {
        // @ts-ignore
        window.snap.pay(data.data.paymentGateway.token, {
          onSuccess: async function (result: any) {
            console.log('payment success!', result);
            // Auto sync immediately on success
            try {
              await fetch(`http://localhost:5000/api/v1/pembayaran/${booking?.id}/sync`, {
                headers: { 'Authorization': `Bearer ${await getToken()}` }
              });
            } catch (e) {}
            window.location.reload();
          },
          onPending: function (result: any) {
            console.log('payment pending!', result);
          },
          onError: function (result: any) {
            console.log('payment error!', result);
          },
          onClose: function () {
            console.log('payment popup closed');
            window.location.reload();
          }
        });
      } else {
        throw new Error('Token pembayaran tidak diterima dari server');
      }
    } catch (err: any) {
      console.error("Payment retry error:", err);
      alert(err.message || 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleSyncPayment = async () => {
    try {
      setIsPaymentLoading(true);
      
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`http://localhost:5000/api/v1/pembayaran/${booking?.id}/sync`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Sinkronisasi berhasil: " + data.message);
        window.location.reload();
      } else {
        throw new Error(data.message || 'Gagal sinkronisasi pembayaran');
      }
    } catch (err: any) {
      console.error("Payment sync error:", err);
      alert(err.message || 'Terjadi kesalahan saat sinkronisasi pembayaran.');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DIKONFIRMASI': return 'bg-green-100 text-green-700 border-green-200';
      case 'MENUNGGU_PEMBAYARAN': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'SELESAI': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DIBATALKAN': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 flex flex-col items-center justify-center min-h-[200px]">
        <Info className="w-12 h-12 mb-3 opacity-50" />
        <h3 className="font-bold text-lg mb-1">Pesanan Tidak Ditemukan</h3>
        <p className="text-sm">{error || "Terjadi kesalahan saat memuat detail pesanan."}</p>
        <Link href="/user/bookings" className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-semibold transition-colors">
          Kembali ke Riwayat
        </Link>
      </div>
    );
  }

  return (
    <>
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10 print:hidden">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/user/bookings" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
          <ChevronLeft size={16} /> Kembali ke Riwayat Pesanan
        </Link>
        {(booking.status === 'DIKONFIRMASI' || booking.status === 'SELESAI') && (
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Printer size={16} /> Cetak E-Tiket
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-[#1E2A4F]">{booking.properti.nama}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                {booking.status.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin size={14} /> {booking.properti.alamat}, {booking.properti.kota}
            </div>
            <div className="mt-4 bg-gray-50 inline-block px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-100">
              Order ID: <span className="font-mono font-bold text-black">{booking.nomorPemesanan}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[240px]">
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-50">
              <div className="flex justify-between items-center mb-1 text-sm text-gray-500">
                <span>Check-in</span>
                <span>Check-out</span>
              </div>
              <div className="flex justify-between items-center font-bold text-[#1E2A4F]">
                <span>{format(new Date(booking.waktuCheckIn), "dd MMM yy")}</span>
                <ChevronRight size={16} className="text-gray-300 mx-2" />
                <span>{format(new Date(booking.waktuCheckOut), "dd MMM yy")}</span>
              </div>
              <div className="mt-3 text-center text-xs font-medium text-primary bg-blue-100/50 py-1.5 rounded-md">
                {booking.jumlahMalam} Malam &bull; {booking.dewasa + booking.anak} Tamu
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="font-bold text-lg mb-4 text-[#1E2A4F]">Detail Kamar</h3>
              <div className="space-y-4">
                {booking.detail.map((room, i) => (
                  <div key={i} className="flex items-center gap-4 border border-gray-100 p-4 rounded-xl hover:border-primary/20 transition-colors">
                    <div className="bg-gray-50 w-16 h-16 rounded-lg flex items-center justify-center text-primary/50">
                      <Building className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{room.jumlahKamar}x {room.tipeKamar.nama}</h4>
                      <p className="text-sm text-gray-500">Paket: {room.paketHarga.nama}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-4 text-[#1E2A4F]">Informasi Pemesan</h3>
              <div className="bg-gray-50 p-5 rounded-xl space-y-4 text-sm border border-gray-100">
                <div className="grid grid-cols-3 gap-2 border-b border-gray-200/60 pb-3">
                  <span className="text-gray-500">Nama</span>
                  <span className="col-span-2 font-semibold text-gray-900">{booking.tamuPemesanan[0]?.nama || booking.tamu.nama}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-gray-200/60 pb-3">
                  <span className="text-gray-500">Email</span>
                  <span className="col-span-2 font-semibold text-gray-900">{booking.tamuPemesanan[0]?.email || booking.tamu.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-500">Telepon</span>
                  <span className="col-span-2 font-semibold text-gray-900">{booking.tamuPemesanan[0]?.telepon || "-"}</span>
                </div>
              </div>
            </section>

            {booking.pembayaran && (
              <section>
                <h3 className="font-bold text-lg mb-4 text-[#1E2A4F]">Riwayat Transaksi</h3>
                <div className="bg-gray-50 p-5 rounded-xl space-y-4 text-sm border border-gray-100">
                  <div className="grid grid-cols-3 gap-2 border-b border-gray-200/60 pb-3">
                    <span className="text-gray-500">Order ID (Gateway)</span>
                    <span className="col-span-2 font-mono text-gray-900">{booking.pembayaran.orderIdMidtrans || "-"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-b border-gray-200/60 pb-3">
                    <span className="text-gray-500">Metode</span>
                    <span className="col-span-2 font-semibold text-gray-900 uppercase">
                      {booking.pembayaran.metodePembayaran ? booking.pembayaran.metodePembayaran.replace(/_/g, ' ') : "-"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-b border-gray-200/60 pb-3">
                    <span className="text-gray-500">Status Gateway</span>
                    <span className="col-span-2 font-semibold text-gray-900 uppercase">{booking.pembayaran.statusTransaksi}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500">Waktu Bayar</span>
                    <span className="col-span-2 font-semibold text-gray-900">
                      {booking.pembayaran.dibayarPada ? format(new Date(booking.pembayaran.dibayarPada), "dd MMM yyyy HH:mm") : "-"}
                    </span>
                  </div>
                </div>
              </section>
            )}
          </div>

          <div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-24 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-[#1E2A4F]">Rincian Biaya</h3>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal Kamar</span>
                  <span>Rp {Number(booking.subtotal).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Biaya Layanan</span>
                  <span>Rp {Number(booking.biayaLayanan).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pajak (11%)</span>
                  <span>Rp {Number(booking.pajak).toLocaleString('id-ID')}</span>
                </div>
                <div className="w-full h-px bg-gray-200 my-4"></div>
                <div className="flex justify-between font-bold text-xl text-[#1E2A4F]">
                  <span>Total Harga</span>
                  <span>Rp {Number(booking.totalHarga).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {booking.status === 'MENUNGGU_PEMBAYARAN' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-yellow-50/50 border border-yellow-200 rounded-lg text-xs text-yellow-800 leading-relaxed font-medium">
                    <Info className="w-4 h-4 inline-block mr-1 mb-0.5" /> Selesaikan pembayaran Anda segera untuk mengonfirmasi pesanan ini.
                  </div>
                  <button 
                    onClick={handlePaymentRetry}
                    disabled={isPaymentLoading}
                    className="w-full bg-[#1E2A4F] hover:bg-[#2A3B6F] text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-md shadow-blue-900/10 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isPaymentLoading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                  </button>
                  {booking.pembayaran?.orderIdMidtrans && (
                    <button 
                      onClick={handleSyncPayment}
                      disabled={isPaymentLoading}
                      className="w-full mt-2 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-xl font-bold transition-all border border-gray-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={14} className={isPaymentLoading ? 'animate-spin' : ''} /> Cek Status (Sinkronisasi)
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* STRUK/INVOICE KHUSUS PRINT */}
    <div className="hidden print:block w-full max-w-[80mm] mx-auto text-black p-2 font-mono text-sm leading-snug bg-white" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
        <h1 className="font-bold text-3xl tracking-wider mb-1">StayNest</h1>
        <p className="text-xs">Sistem Pemesanan Properti Terpercaya</p>
        <p className="text-xs mt-3">Order ID: {booking.nomorPemesanan}</p>
        <p className="text-xs">{format(new Date(), "dd MMM yyyy HH:mm")}</p>
      </div>

      {/* Properti Info */}
      <div className="border-b-2 border-dashed border-gray-400 pb-4 mb-4 text-center">
        <p className="font-bold text-lg mb-1 leading-tight">{booking.properti.nama}</p>
        <p className="text-xs break-words">{booking.properti.alamat}</p>
        <p className="text-xs">{booking.properti.kota}</p>
      </div>

      {/* Detail Tamu & Waktu */}
      <div className="border-b-2 border-dashed border-gray-400 pb-4 mb-4 text-xs">
        <div className="flex justify-between mb-1">
          <span>Check-in:</span>
          <span className="font-bold">{format(new Date(booking.waktuCheckIn), "dd/MM/yyyy")}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Check-out:</span>
          <span className="font-bold">{format(new Date(booking.waktuCheckOut), "dd/MM/yyyy")}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Jml Malam:</span>
          <span>{booking.jumlahMalam} Malam</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Total Tamu:</span>
          <span>{booking.dewasa + booking.anak} Orang</span>
        </div>
        <div className="flex justify-between">
          <span>Pemesan:</span>
          <span className="text-right truncate ml-4 font-bold">{booking.tamuPemesanan[0]?.nama || booking.tamu.nama}</span>
        </div>
      </div>

      {/* Rincian Kamar */}
      <div className="border-b-2 border-dashed border-gray-400 pb-4 mb-4 text-xs">
        <p className="font-bold mb-2">Item Booking:</p>
        {booking.detail.map((room, i) => (
          <div key={i} className="mb-3">
            <p className="font-bold">{room.jumlahKamar}x {room.tipeKamar.nama}</p>
            <div className="flex justify-between mt-1">
              <span className="truncate mr-2">[{room.paketHarga.nama}]</span>
              <span>Rp{Number(room.subtotal).toLocaleString('id-ID')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rincian Harga */}
      <div className="border-b-2 border-dashed border-gray-400 pb-4 mb-4 text-xs">
        <div className="flex justify-between mb-1">
          <span>Subtotal</span>
          <span>Rp{Number(booking.subtotal).toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Biaya Layanan</span>
          <span>Rp{Number(booking.biayaLayanan).toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Pajak (11%)</span>
          <span>Rp{Number(booking.pajak).toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t border-dashed border-gray-300 font-bold text-base">
          <span>TOTAL</span>
          <span>Rp{Number(booking.totalHarga).toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Status Pembayaran */}
      <div className="text-center pt-2">
        <p className="text-xs mb-2">Metode: {booking.pembayaran?.metodePembayaran?.replace(/_/g, ' ').toUpperCase() || '-'}</p>
        <div className="inline-block border-2 border-black px-6 py-2 my-2 font-bold text-xl tracking-widest uppercase">
          {booking.status === 'DIKONFIRMASI' || booking.status === 'SELESAI' ? 'LUNAS' : 'BELUM LUNAS'}
        </div>
        <p className="text-[10px] mt-6 italic">Terima kasih telah menggunakan layanan StayNest.</p>
        <p className="text-[10px] italic">Tunjukkan struk ini kepada resepsionis saat Check-In.</p>
      </div>
    </div>
    </>
  );
}
