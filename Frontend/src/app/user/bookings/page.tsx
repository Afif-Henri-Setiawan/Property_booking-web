"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar, MapPin, Building, CreditCard, ChevronRight } from "lucide-react";

interface Booking {
  id: string;
  totalHarga: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  statusPembayaran: string;
  statusPemesanan: string;
  properti: {
    nama: string;
    kota: string;
  };
  tipeKamar: {
    nama: string;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // In a real app with Clerk + Custom Backend, you'd sync the user 
        // or pass a custom token here.
        // For now, we try to fetch from the API. If it fails (e.g. 401), 
        // we show empty or mock data.
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        
        // Try getting the token from local storage (if custom auth is used)
        const token = localStorage.getItem('token'); 
        
        const res = await fetch(`${apiUrl}/pemesanan/my-bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch bookings. Please make sure you are logged in.');
        }

        const data = await res.json();
        if (data.status === 'success') {
          setBookings(data.data);
        } else {
          throw new Error(data.message || 'Error fetching bookings');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
        
        // Provide some mock data for UI demonstration since Auth is not fully synced
        setBookings([
          {
            id: "mock-1",
            totalHarga: 2500000,
            tanggalMulai: new Date().toISOString(),
            tanggalSelesai: new Date(Date.now() + 86400000 * 3).toISOString(),
            statusPembayaran: "LUNAS",
            statusPemesanan: "DIKONFIRMASI",
            properti: {
              nama: "Modern Ocean Villa",
              kota: "Bali",
            },
            tipeKamar: {
              nama: "Deluxe Ocean View"
            }
          },
          {
            id: "mock-2",
            totalHarga: 1200000,
            tanggalMulai: new Date(Date.now() - 86400000 * 10).toISOString(),
            tanggalSelesai: new Date(Date.now() - 86400000 * 8).toISOString(),
            statusPembayaran: "LUNAS",
            statusPemesanan: "SELESAI",
            properti: {
              nama: "Urban Studio Apartment",
              kota: "Jakarta",
            },
            tipeKamar: {
              nama: "Studio Premium"
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DIKONFIRMASI': return 'bg-green-100 text-green-700';
      case 'MENUNGGU': return 'bg-yellow-100 text-yellow-700';
      case 'SELESAI': return 'bg-blue-100 text-blue-700';
      case 'DIBATALKAN': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="space-y-4">
          <div className="h-40 w-full bg-gray-100 rounded-xl"></div>
          <div className="h-40 w-full bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A4F]">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage all your past and upcoming reservations.</p>
        {error && (
           <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
             Note: Backend API returned an error ({error}). Showing mock data for demonstration.
           </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-900 font-medium">No bookings found</h3>
            <p className="text-gray-500 text-sm mt-1">You haven't made any reservations yet.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="group border border-gray-100 hover:border-gray-200 bg-white rounded-2xl p-5 md:p-6 transition-all hover:shadow-md cursor-pointer flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              
              {/* Info Kiri */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusColor(booking.statusPemesanan)}`}>
                    {booking.statusPemesanan}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">ID: {booking.id.substring(0,8)}...</span>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-[#1E2A4F]">{booking.properti.nama}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin size={14} /> {booking.properti.kota}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Building size={14} /> {booking.tipeKamar.nama}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <Calendar size={16} className="text-gray-400" />
                    <div className="text-xs">
                      <span className="text-gray-500 block">Check-in</span>
                      <span className="font-semibold text-gray-900">{format(new Date(booking.tanggalMulai), "dd MMM yyyy")}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <Calendar size={16} className="text-gray-400" />
                    <div className="text-xs">
                      <span className="text-gray-500 block">Check-out</span>
                      <span className="font-semibold text-gray-900">{format(new Date(booking.tanggalSelesai), "dd MMM yyyy")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Kanan & Harga */}
              <div className="flex flex-col items-start md:items-end w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div className="flex flex-col items-start md:items-end mb-4">
                  <span className="text-sm text-gray-500 mb-1">Total Price</span>
                  <span className="text-2xl font-bold text-[#1E2A4F]">
                    Rp {booking.totalHarga.toLocaleString('id-ID')}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium mt-1 text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    <CreditCard size={12} /> {booking.statusPembayaran}
                  </span>
                </div>
                <button className="w-full md:w-auto px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 hover:text-black transition-colors">
                  View Details
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
