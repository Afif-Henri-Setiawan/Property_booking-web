"use client";

import { Users, BedDouble, Bath, MapPin, Wifi, Tv, Coffee, Car, CheckCircle2 } from "lucide-react";
import BookingWidget from "@/components/property/BookingWidget";
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 flex items-center justify-center animate-pulse text-slate-500">Memuat Peta...</div>
});

// A small helper to pick an icon based on amenity name
function getAmenityIcon(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("wifi")) return <Wifi size={20} />;
  if (lowerName.includes("tv")) return <Tv size={20} />;
  if (lowerName.includes("coffee") || lowerName.includes("kopi")) return <Coffee size={20} />;
  if (lowerName.includes("parkir") || lowerName.includes("car")) return <Car size={20} />;
  return <CheckCircle2 size={20} />;
}

export default function PropertyDetailsClient({ property }: { property: any }) {
  const propertyType = property.tipe?.nama || 'Properti';
  
  // Fixed maxGuests logic: we should show the max guests of the LARGEST room, not sum of all rooms
  const maxGuestsAnyRoom = property.tipeKamar?.reduce((max: number, room: any) => {
    const roomCapacity = (room.maksDewasa || 0) + (room.maksAnak || 0);
    return roomCapacity > max ? roomCapacity : max;
  }, 0) || 2;
  
  const totalRooms = property.tipeKamar?.reduce((acc: number, room: any) => acc + (room.totalUnit || 1), 0) || 1;

  return (
    <div className="flex flex-col lg:flex-row gap-12 relative">
      {/* Left Column (Details) */}
      <div className="flex-1 flex flex-col gap-10">
        {/* Host Info & Quick Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-gray-200">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-primary">{propertyType} ini dikelola oleh {property.tuanRumah?.nama || 'Host'}</h2>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1"><BedDouble size={18} /> {property.tipeKamar?.length || 1} tipe kamar</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Users size={18} /> Hingga {maxGuestsAnyRoom} tamu per kamar</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Bath size={18} /> {totalRooms} unit tersedia</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-md shrink-0">
            {property.tuanRumah?.nama?.charAt(0) || 'H'}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-4 pb-8 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-primary">Tentang tempat ini</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line text-justify">
            {property.deskripsi || "Tidak ada deskripsi yang tersedia."}
          </p>
        </div>

        {/* Room Types (Tipe Kamar) */}
        {property.tipeKamar && property.tipeKamar.length > 0 && (
          <div className="flex flex-col gap-6 pb-8 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-primary">Tipe Kamar yang Tersedia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.tipeKamar.map((kamar: any) => {
                return (
                  <div 
                    key={kamar.id} 
                    className="border p-5 rounded-2xl flex flex-col gap-3 transition-all bg-white border-gray-200 hover:shadow-md hover:border-primary/50"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg text-primary">{kamar.nama}</h4>
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
                        {kamar.totalUnit} unit
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{kamar.deskripsi}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1"><Users size={14} /> {kamar.maksDewasa} Dewasa, {kamar.maksAnak} Anak</span>
                      <span className="text-gray-300">•</span>
                      <span>{kamar.ukuranKamar || '-'} m²</span>
                    </div>
                    {kamar.kasur && kamar.kasur.length > 0 && (
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <BedDouble size={14} /> 
                          {kamar.kasur.map((k: any) => `${k.jumlah}x ${k.tipeKasur?.nama}`).join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
                      <span className="font-bold text-primary">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kamar.hargaDasar)}
                        <span className="text-xs font-normal text-gray-500">/malam</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Amenities */}
        <div className="flex flex-col gap-6 pb-8 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-primary">Fasilitas yang ditawarkan</h3>
          {property.fasilitas && property.fasilitas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {property.fasilitas.map((item: any) => (
                <div key={item.fasilitasId} className="flex items-center gap-4 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors cursor-default">
                  <div className="text-primary">
                    {getAmenityIcon(item.fasilitas.nama)}
                  </div>
                  <span className="font-medium">{item.fasilitas.nama}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Belum ada fasilitas yang ditambahkan.</p>
          )}
        </div>

        {/* House Rules & Location */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-6">
            <h3 className="text-xl font-semibold text-primary">Aturan Rumah</h3>
            <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Waktu Check-in</span>
                <span className="font-bold text-primary">{property.waktuCheckIn || '14:00'}</span>
              </div>
              <div className="w-full h-px bg-primary/10"></div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Waktu Check-out</span>
                <span className="font-bold text-primary">{property.waktuCheckOut || '12:00'}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-primary">Lokasi Anda</h3>
              {(property.garisLintang !== undefined && property.garisLintang !== null) && 
               (property.garisBujur !== undefined && property.garisBujur !== null) && (
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${property.garisLintang},${property.garisBujur}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  <MapPin size={16} /> Buka di Maps
                </a>
              )}
            </div>
            
            <div className="w-full h-[300px] bg-gray-100 rounded-2xl flex overflow-hidden relative shadow-inner">
              {(property.garisLintang !== undefined && property.garisLintang !== null) && 
               (property.garisBujur !== undefined && property.garisBujur !== null) ? (
                <div className="w-full h-full relative isolate z-0">
                  <MapPicker 
                    position={{ lat: property.garisLintang, lng: property.garisBujur }}
                    readOnly={true}
                  />
                </div>
              ) : (
                <>
                  <MapPin size={40} className="text-red-500 drop-shadow-md absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: "radial-gradient(#1b3b36 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }}></div>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100 inline-block w-fit">
              <MapPin size={16} className="inline mr-2 text-primary" />
              {property.kota}, {property.provinsi}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column (Sticky Booking Widget) */}
      <div className="w-full lg:w-[400px] shrink-0">
        <BookingWidget 
          propertyId={property.id} 
          allRooms={property.tipeKamar || []}
        />
      </div>
    </div>
  );
}
