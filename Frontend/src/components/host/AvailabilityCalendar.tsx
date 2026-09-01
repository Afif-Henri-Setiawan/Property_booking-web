"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

interface BookingData {
  checkIn: string;
  checkOut: string;
  jumlahKamar: number;
}

interface AvailabilityData {
  blockedDates: string[];
  bookings: BookingData[];
}

export default function AvailabilityCalendar({ tipeKamarId, totalUnit }: { tipeKamarId: string, totalUnit: number }) {
  const { getToken } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState<AvailabilityData>({ blockedDates: [], bookings: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (tipeKamarId) {
      fetchData();
    }
  }, [tipeKamarId, currentDate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // 1-12
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ketersediaan/tipe-kamar/${tipeKamarId}?tahun=${year}&bulan=${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      
      if (result.status === "success") {
        setData(result.data);
      } else {
        toast.error(result.message || "Gagal mengambil data ketersediaan");
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBlock = async (date: Date) => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      const token = await getToken();
      // YYYY-MM-DD
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ketersediaan/tipe-kamar/${tipeKamarId}/toggle-block`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ tanggal: dateStr })
      });
      const result = await res.json();
      
      if (result.status === "success") {
        toast.success(result.message);
        // Optimistic update
        if (result.action === 'BLOCKED') {
          setData(prev => ({ ...prev, blockedDates: [...prev.blockedDates, dateStr] }));
        } else {
          setData(prev => ({ ...prev, blockedDates: prev.blockedDates.filter(d => d.split('T')[0] !== dateStr) }));
        }
        await fetchData(); // Refresh to be safe
      } else {
        toast.error(result.message || "Gagal mengubah status tanggal");
      }
    } catch (error) {
      console.error("Failed to toggle block:", error);
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setIsToggling(false);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get leading empty days (0 = Sunday, 1 = Monday...)
  const startDay = monthStart.getDay();
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

  // Helper to get status of a day
  const getDayStatus = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    
    // Check blocked
    const isBlocked = data.blockedDates.some(d => d.startsWith(dateStr));
    if (isBlocked) return { type: 'blocked', text: 'Ditutup' };

    // Check bookings (calculate total booked units for this day)
    let bookedUnits = 0;
    data.bookings.forEach(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      // Ensure day is at midnight for comparison
      const dayTime = day.getTime();
      const inTime = new Date(format(checkIn, 'yyyy-MM-dd')).getTime();
      const outTime = new Date(format(checkOut, 'yyyy-MM-dd')).getTime();
      
      // Included if day is >= checkIn and < checkOut
      if (dayTime >= inTime && dayTime < outTime) {
        bookedUnits += booking.jumlahKamar;
      }
    });

    if (bookedUnits >= totalUnit && totalUnit > 0) {
      return { type: 'full', text: 'Penuh', units: bookedUnits };
    } else if (bookedUnits > 0) {
      return { type: 'partial', text: `${bookedUnits}/${totalUnit} Dipesan`, units: bookedUnits };
    }

    return { type: 'available', text: 'Tersedia' };
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Kalender Ketersediaan
          </CardTitle>
          <CardDescription>
            Klik pada tanggal untuk menutup/membuka secara manual.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold w-32 text-center text-slate-700 capitalize">
            {format(currentDate, "MMMM yyyy", { locale: id })}
          </div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-white border border-slate-300"></div> Tersedia</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-200"></div> Dipesan</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-200"></div> Penuh</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></div> Diblokir</div>
        </div>

        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
              <div key={day} className="text-center font-medium text-slate-500 py-2 text-sm">
                {day}
              </div>
            ))}
            
            {emptyDays.map(i => (
              <div key={`empty-${i}`} className="h-16 sm:h-24 rounded-md bg-slate-50 border border-transparent opacity-50"></div>
            ))}
            
            {daysInMonth.map(day => {
              const status = getDayStatus(day);
              const isPast = day < new Date(new Date().setHours(0,0,0,0));
              
              let bgClass = "bg-white hover:bg-slate-50 border-slate-200";
              if (status.type === 'blocked') bgClass = "bg-slate-100 border-slate-300";
              else if (status.type === 'full') bgClass = "bg-amber-50 border-amber-200 hover:bg-amber-100";
              else if (status.type === 'partial') bgClass = "bg-emerald-50 border-emerald-200 hover:bg-emerald-100";

              return (
                <div 
                  key={day.toString()} 
                  onClick={() => {
                    if (isPast) return toast.error("Tidak bisa mengubah tanggal di masa lalu");
                    handleToggleBlock(day);
                  }}
                  className={`
                    h-16 sm:h-24 p-1 sm:p-2 rounded-md border transition-colors cursor-pointer flex flex-col justify-between
                    ${bgClass} ${isPast ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="font-semibold text-slate-700 text-xs sm:text-sm">{format(day, 'd')}</div>
                  
                  <div className="text-[9px] sm:text-xs font-medium text-center">
                    {status.type === 'blocked' && <span className="text-slate-500">Diblokir</span>}
                    {status.type === 'full' && <span className="text-amber-600">Penuh</span>}
                    {status.type === 'partial' && <span className="text-emerald-600">{status.text}</span>}
                    {status.type === 'available' && <span className="text-slate-400">Tersedia</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
