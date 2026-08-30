"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Calendar, Search, MapPin, Loader2, CheckCircle2, User, CreditCard, Clock } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HostBookingsPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/pemesanan/host/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.status === "success") {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    setProcessingId(bookingId);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/pemesanan/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Refresh
        await fetchBookings();
      } else {
        const error = await res.json();
        alert(error.message || "Gagal mengubah status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Terjadi kesalahan pada jaringan.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.tamu?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.properti?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "MENUNGGU_PEMBAYARAN":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Menunggu Pembayaran</span>;
      case "DIKONFIRMASI":
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Dikonfirmasi</span>;
      case "CHECK_IN":
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">Checked-In</span>;
      case "SELESAI":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Selesai</span>;
      case "DIBATALKAN":
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Dibatalkan</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-forest-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pesanan (Receptionist)</h1>
          <p className="text-slate-500 mt-1">Kelola Check-In dan Check-Out tamu Anda hari ini.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari ID, Tamu, atau Properti..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">ID / Tamu</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Properti & Kamar</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Jadwal (In - Out)</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Total Harga</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada pesanan yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{booking.tamu?.nama || "Tamu"}</span>
                        <span className="text-xs text-slate-500 font-mono mt-1" title={booking.id}>
                          {booking.id.split("-")[0]}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <MapPin size={14} className="text-slate-400" />
                          {booking.properti?.nama || "Properti"}
                        </span>
                        <span className="text-sm text-slate-500 mt-1">
                          {booking.detail?.[0]?.tipeKamar?.nama || "Kamar"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400" />
                          <span>In: {format(new Date(booking.detail?.[0]?.waktuMulai || booking.dibuatPada), "dd MMM yyyy", { locale: localeId })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          <span>Out: {format(new Date(booking.detail?.[0]?.waktuSelesai || booking.dibuatPada), "dd MMM yyyy", { locale: localeId })}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        Rp {booking.totalHarga.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {booking.status === "DIKONFIRMASI" && (
                          <button
                            onClick={() => handleUpdateStatus(booking.id, "CHECK_IN")}
                            disabled={processingId === booking.id}
                            className="bg-forest-600 hover:bg-forest-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {processingId === booking.id && <Loader2 size={14} className="animate-spin" />}
                            Check-In Tamu
                          </button>
                        )}
                        {booking.status === "CHECK_IN" && (
                          <button
                            onClick={() => handleUpdateStatus(booking.id, "SELESAI")}
                            disabled={processingId === booking.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {processingId === booking.id && <Loader2 size={14} className="animate-spin" />}
                            Tandai Selesai
                          </button>
                        )}
                        <Link href={`/user/bookings/${booking.id}`} target="_blank" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                          Detail
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
