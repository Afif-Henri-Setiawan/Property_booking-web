"use client";

import { useState } from "react";

interface DateRangeInputsProps {
  initialCheckIn?: string;
  initialCheckOut?: string;
  layout?: "horizontal" | "vertical";
}

export default function DateRangeInputs({
  initialCheckIn = "",
  initialCheckOut = "",
  layout = "vertical",
}: DateRangeInputsProps) {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    
    // Jika tanggal check-out saat ini lebih awal dari tanggal check-in baru, sesuaikan check-out
    if (checkOut && newCheckIn > checkOut) {
      setCheckOut(newCheckIn);
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckOut(e.target.value);
  };

  if (layout === "horizontal") {
    // For Landing Page Search Bar
    return (
      <div className="flex items-center gap-2">
        <input
          name="tanggalMulai"
          type="date"
          value={checkIn}
          onChange={handleCheckInChange}
          className="bg-transparent border-none p-0 focus:ring-0 text-primary text-sm h-6 w-full focus:outline-none"
          title="Check In"
          required
        />
        <span className="text-primary/50">-</span>
        <input
          name="tanggalSelesai"
          type="date"
          min={checkIn} // Secure checkout date so it cannot be before checkin
          value={checkOut}
          onChange={handleCheckOutChange}
          className="bg-transparent border-none p-0 focus:ring-0 text-primary text-sm h-6 w-full focus:outline-none"
          title="Check Out"
          required
        />
      </div>
    );
  }

  // For Search Page Sidebar
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Check In
        </label>
        <input
          type="date"
          name="tanggalMulai"
          value={checkIn}
          onChange={handleCheckInChange}
          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-gray-600"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Check Out
        </label>
        <input
          type="date"
          name="tanggalSelesai"
          min={checkIn} // Secure checkout date so it cannot be before checkin
          value={checkOut}
          onChange={handleCheckOutChange}
          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-gray-600"
          required
        />
      </div>
    </div>
  );
}
