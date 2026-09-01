"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Calendar, MapPin, ChevronLeft, Building, Loader2, Info, ChevronRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useParams } from "next/navigation";

interface BookingDetail {
  id: string;
  nomorPemesanan: string;
  waktuCheckIn: string;
  waktuCheckOut: string;
  dewasa: number;
  anak: number;
  jumlahMalam: number;
  totalHarga: number;
  status: string;
  properti: {
    nama: string;
    kota: string;
    alamat: string;
  };
  detail: Array<{
    tipeKamar: {
      nama: string;
    };
    paketHarga: {
      nama: string;
    };
    unitKamar?: {
      nomorUnit: string;
    };
    jumlahKamar: number;
    hargaSatuan: number;
  }>;
  tamu: {
    nama: string;
    email: string;
  };
}

export default function HostBookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <Link href="/host/bookings" className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-semibold transition-colors">
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10">
      <div className="flex items-center justify-between">
        <Link href="/host/bookings" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
          <ChevronLeft size={16} /> Kembali ke Daftar Pesanan
        </Link>
        {(booking.status === 'DIKONFIRMASI' || booking.status === 'SELESAI') && (
          <Link 
            href={`/host/bookings/${booking.id}/invoice`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            Lihat Invoice
          </Link>
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
                <span>{format(new Date(booking.waktuCheckIn), "dd MMM yy", { locale: localeId })}</span>
                <ChevronRight size={16} className="text-gray-300 mx-2" />
                <span>{format(new Date(booking.waktuCheckOut), "dd MMM yy", { locale: localeId })}</span>
              </div>
              <div className="mt-3 text-center text-xs font-medium text-primary bg-blue-100/50 py-1.5 rounded-md">
                {booking.jumlahMalam} Malam &bull; {booking.dewasa + booking.anak} Tamu
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <section>
              <h3 className="font-bold text-lg mb-4 text-[#1E2A4F]">Detail Kamar</h3>
              <div className="space-y-4">
                {booking.detail.map((room, i) => (
                  <div key={i} className="flex items-center gap-4 border border-gray-100 p-4 rounded-xl hover:border-primary/20 transition-colors">
                    <div className="bg-gray-50 w-16 h-16 rounded-lg flex items-center justify-center text-primary/50">
                      <Building className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-gray-900">{room.tipeKamar.nama}</h4>
                        {room.unitKamar && (
                          <span className="bg-forest-100 text-forest-700 text-xs px-2 py-1 rounded font-bold">
                            Kamar {room.unitKamar.nomorUnit}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{room.paketHarga.nama}</p>
                      <p className="text-xs font-medium text-primary mt-1">{room.jumlahKamar} Kamar x Rp {room.hargaSatuan.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div>
            <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-4 text-[#1E2A4F]">Informasi Tamu</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Nama</span>
                  <span className="font-medium text-gray-900">{booking.tamu.nama}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{booking.tamu.email}</span>
                </div>
              </div>
            </section>
            
            <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mt-6">
              <h3 className="font-bold text-lg mb-4 text-[#1E2A4F]">Pembayaran</h3>
              <div className="pt-3 border-t border-gray-200 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Harga</span>
                  <span className="font-bold text-lg text-primary">Rp {booking.totalHarga.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
