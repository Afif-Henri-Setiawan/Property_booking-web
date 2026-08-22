"use client";

import { useState, useRef, useEffect } from "react";
import { Star, ChevronRight, Minus, Plus, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingWidgetProps {
  price: string;
  propertyId: string;
}

export default function BookingWidget({ price, propertyId }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  
  const guestPickerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close guest picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setShowGuestPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckAvailability = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("guests", guests.toString());
    
    router.push(`/property/${propertyId}/book?${params.toString()}`);
  };

  return (
    <div className="sticky top-28 bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-3xl p-8 flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-2xl font-bold text-primary">{price}</span>
          <span className="text-gray-500 font-medium"> / malam</span>
        </div>
        <div className="flex flex-col items-end text-sm">
          <div className="flex items-center gap-1 font-medium">
            <Star size={14} className="fill-yellow-500 text-yellow-500" />
            4.96
          </div>
          <span className="text-gray-500 underline">128 ulasan</span>
        </div>
      </div>

      <div className="border border-gray-300 rounded-2xl flex flex-col relative bg-white">
        <div className="flex border-b border-gray-300">
          <div className="flex-1 p-3 border-r border-gray-300 transition-colors relative">
            <label htmlFor="checkin" className="block text-[10px] font-bold uppercase text-primary mb-1">Check-in</label>
            <input 
              id="checkin"
              type="date" 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full text-sm text-gray-700 bg-transparent outline-none cursor-pointer" 
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="flex-1 p-3 transition-colors relative">
            <label htmlFor="checkout" className="block text-[10px] font-bold uppercase text-primary mb-1">Check-out</label>
            <input 
              id="checkout"
              type="date" 
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full text-sm text-gray-700 bg-transparent outline-none cursor-pointer"
              min={checkIn || new Date().toISOString().split('T')[0]} 
            />
          </div>
        </div>
        
        {/* Guest Picker Toggle */}
        <div 
          className="p-3 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center rounded-b-2xl"
          onClick={() => setShowGuestPicker(!showGuestPicker)}
        >
          <div>
            <span className="block text-[10px] font-bold uppercase text-primary">Tamu</span>
            <span className="text-sm text-gray-700">{guests} tamu</span>
          </div>
          <ChevronRight size={18} className={`text-gray-400 transition-transform ${showGuestPicker ? 'rotate-90' : ''}`} />
        </div>

        {/* Guest Picker Dropdown */}
        {showGuestPicker && (
          <div 
            ref={guestPickerRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 z-50 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Tamu</h4>
                <p className="text-xs text-gray-500">Usia 13 tahun ke atas</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); if (guests > 1) setGuests(guests - 1); }}
                  disabled={guests <= 1}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-4 text-center font-medium">{guests}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setGuests(guests + 1); }}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 pt-3 border-t border-gray-100">
              Kapasitas properti ini adalah maksimum unit, Anda dapat menyesuaikan tamu dan kamar nanti.
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={handleCheckAvailability}
        className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2"
      >
        Cek Ketersediaan
      </button>

      <div className="text-center text-sm text-gray-500 pt-2 border-t border-gray-100">
        Anda belum akan dikenakan biaya
      </div>
    </div>
  );
}
