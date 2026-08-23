"use client";

import { useState, useRef, useEffect } from "react";
import { Star, ChevronRight, Minus, Plus, BedDouble, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingWidgetProps {
  propertyId: string;
  allRooms?: any[];
}

export default function BookingWidget({ propertyId, allRooms = [] }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  
  // cart: roomId -> count
  const [cart, setCart] = useState<Record<string, number>>({});
  
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  
  const guestPickerRef = useRef<HTMLDivElement>(null);
  const roomPickerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setShowGuestPicker(false);
      }
      if (roomPickerRef.current && !roomPickerRef.current.contains(event.target as Node)) {
        setShowRoomPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [errorMsg, setErrorMsg] = useState("");

  // Calculate constraints based on cart
  let totalRoomsInCart = 0;
  let maxGuestsTotal = 0;
  let basePricePerNight = 0;

  Object.entries(cart).forEach(([roomId, count]) => {
    if (count > 0) {
      const room = allRooms.find(r => r.id === roomId);
      if (room) {
        totalRoomsInCart += count;
        maxGuestsTotal += ((room.maksDewasa || 0) + (room.maksAnak || 0)) * count;
        basePricePerNight += (room.hargaDasar || 0) * count;
      }
    }
  });

  // Enforce guest limit if cart changes
  useEffect(() => {
    if (guests > maxGuestsTotal && maxGuestsTotal > 0) {
      setGuests(maxGuestsTotal);
    }
  }, [maxGuestsTotal, guests]);

  const updateCart = (roomId: string, delta: number) => {
    setCart(prev => {
      const room = allRooms.find(r => r.id === roomId);
      if (!room) return prev;
      
      const currentCount = prev[roomId] || 0;
      const newCount = currentCount + delta;
      
      if (newCount < 0) return prev;
      if (newCount > (room.totalUnit || 1)) return prev;

      const newCart = { ...prev };
      if (newCount === 0) {
        delete newCart[roomId];
      } else {
        newCart[roomId] = newCount;
      }
      return newCart;
    });
    setErrorMsg("");
  };

  const handleCheckAvailability = () => {
    setErrorMsg("");

    if (!checkIn) {
      setErrorMsg("Silakan pilih tanggal Check-in terlebih dahulu.");
      return;
    }
    if (!checkOut) {
      setErrorMsg("Silakan pilih tanggal Check-out terlebih dahulu.");
      return;
    }
    if (totalRoomsInCart === 0) {
      setErrorMsg("Silakan pilih minimal 1 tipe kamar.");
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      setErrorMsg("Tanggal Check-out harus setelah tanggal Check-in.");
      return;
    }

    // Build the cart array for the URL
    const cartArray = Object.entries(cart).map(([roomId, count]) => ({
      roomId,
      count
    }));

    const params = new URLSearchParams();
    params.set("checkIn", checkIn);
    params.set("checkOut", checkOut);
    params.set("guests", guests.toString());
    params.set("cart", JSON.stringify(cartArray));
    
    router.push(`/property/${propertyId}/book?${params.toString()}`);
  };

  // Calculate total price
  let nights = 1;
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate > checkInDate) {
      nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
    }
  }

  const totalPriceNum = basePricePerNight * nights;
  const formattedTotalPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPriceNum);
  const formattedBasePrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(basePricePerNight);

  const cheapestRoom = allRooms.length > 0 ? [...allRooms].sort((a, b) => (a.hargaDasar || 0) - (b.hargaDasar || 0))[0] : null;
  const startingPrice = cheapestRoom ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(cheapestRoom.hargaDasar) : 'Rp 0';

  return (
    <div className="sticky top-28 bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-3xl p-8 flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-2xl font-bold text-primary">
            {totalRoomsInCart > 0 ? formattedBasePrice : startingPrice}
          </span>
          <span className="text-gray-500 font-medium">
             {totalRoomsInCart === 0 && <span className="text-xs mr-1 text-gray-400">Mulai dari</span>} 
             / malam
          </span>
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
              onChange={(e) => {
                setCheckIn(e.target.value);
                setErrorMsg("");
              }}
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
              onChange={(e) => {
                setCheckOut(e.target.value);
                setErrorMsg("");
              }}
              className="w-full text-sm text-gray-700 bg-transparent outline-none cursor-pointer"
              min={checkIn || new Date().toISOString().split('T')[0]} 
            />
          </div>
        </div>
        
        {/* Room Picker Toggle */}
        {allRooms && allRooms.length > 0 && (
          <div 
            className="p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center relative"
            onClick={() => {
              setShowRoomPicker(!showRoomPicker);
              setShowGuestPicker(false);
            }}
          >
            <div className="overflow-hidden">
              <span className="block text-[10px] font-bold uppercase text-primary">Tipe Kamar</span>
              <span className="text-sm text-gray-700 truncate block">
                {totalRoomsInCart === 0 ? "Pilih Tipe Kamar" : `${totalRoomsInCart} kamar dipilih`}
              </span>
            </div>
            <ChevronRight size={18} className={`text-gray-400 transition-transform ${showRoomPicker ? 'rotate-90' : ''}`} />
            
            {/* Room Picker Dropdown */}
            {showRoomPicker && (
              <div 
                ref={roomPickerRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 flex flex-col overflow-hidden max-h-[300px] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {allRooms.map((room) => {
                  const count = cart[room.id] || 0;
                  return (
                    <div 
                      key={room.id}
                      className={`p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 flex flex-col gap-2 ${count > 0 ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-gray-800">{room.nama}</span>
                          <span className="text-xs text-gray-500 font-medium mt-1">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(room.hargaDasar)}/malam
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end mt-1">
                        <span className="text-xs text-gray-500 flex flex-col">
                          <span>Maks { (room.maksDewasa || 0) + (room.maksAnak || 0) } tamu</span>
                          <span>Tersedia {room.totalUnit} unit</span>
                        </span>
                        
                        {/* Quantity controls */}
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateCart(room.id, -1)}
                            disabled={count <= 0}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-4 text-center font-bold text-sm">{count}</span>
                          <button 
                            onClick={() => updateCart(room.id, 1)}
                            disabled={count >= (room.totalUnit || 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Guest Picker Toggle */}
        <div 
          className="p-3 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center rounded-b-2xl relative"
          onClick={() => {
            setShowGuestPicker(!showGuestPicker);
            setShowRoomPicker(false);
          }}
        >
          <div>
            <span className="block text-[10px] font-bold uppercase text-primary">Tamu</span>
            <span className="text-sm text-gray-700">{guests} tamu</span>
          </div>
          <ChevronRight size={18} className={`text-gray-400 transition-transform ${showGuestPicker ? 'rotate-90' : ''}`} />
          
          {/* Guest Picker Dropdown */}
          {showGuestPicker && (
            <div 
              ref={guestPickerRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 z-50 flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">Jumlah Tamu</h4>
                  <p className="text-xs text-gray-500">Total keseluruhan</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { if (guests > 1) setGuests(guests - 1); }}
                    disabled={guests <= 1}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-4 text-center font-medium">{guests}</span>
                  <button 
                    onClick={() => { if (guests < maxGuestsTotal) setGuests(guests + 1); }}
                    disabled={guests >= maxGuestsTotal || maxGuestsTotal === 0}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500 pt-3 border-t border-gray-100">
                {totalRoomsInCart > 0 
                  ? `Kapasitas maksimal ${maxGuestsTotal} tamu berdasarkan tipe kamar yang Anda pilih.`
                  : "Silakan pilih tipe kamar terlebih dahulu untuk melihat kapasitas maksimal."}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Total Price Breakdown */}
        {totalRoomsInCart > 0 && (
          <div className="flex flex-col gap-2 pt-2 text-sm text-gray-700">
            <div className="flex justify-between items-center">
              <span className="underline">
                {formattedBasePrice} x {nights} malam
              </span>
              <span>{formattedTotalPrice}</span>
            </div>
            <div className="w-full h-px bg-gray-200 my-1"></div>
            <div className="flex justify-between items-center font-bold text-gray-900 text-base">
              <span>Total Estimasi</span>
              <span>{formattedTotalPrice}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {errorMsg && (
            <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded-lg">
              {errorMsg}
            </div>
          )}
          <button 
            onClick={handleCheckAvailability}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            Cek Ketersediaan
          </button>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 pt-2 border-t border-gray-100">
        Anda belum akan dikenakan biaya
      </div>
    </div>
  );
}
