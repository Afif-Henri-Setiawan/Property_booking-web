import TopNavBar from "@/components/layout/TopNavBar";
import { 
  Star, Share, Heart, MapPin, Users, BedDouble, Bath, 
  ChevronRight, Calendar, ArrowRight, ShieldCheck,
  Wifi, Tv, Coffee, Car, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// A small helper to pick an icon based on amenity name
function getAmenityIcon(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("wifi")) return <Wifi size={20} />;
  if (lowerName.includes("tv")) return <Tv size={20} />;
  if (lowerName.includes("coffee") || lowerName.includes("kopi")) return <Coffee size={20} />;
  if (lowerName.includes("parkir") || lowerName.includes("car")) return <Car size={20} />;
  return <CheckCircle2 size={20} />;
}

export default async function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  // Fetch data from backend
  const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
  const { id } = await params;
  const res = await fetch(`${apiUrl}/properti/${id}`, { next: { revalidate: 0 } });
  
  if (!res.ok) {
    if (res.status === 404) return notFound();
    const errorText = await res.text();
    console.error("Backend Error:", res.status, res.statusText, errorText);
    throw new Error(`Failed to fetch property details: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const property = json.data;

  // Extract base room for price & capacity
  const baseRoom = property.tipeKamar?.[0] || null;
  const price = baseRoom?.hargaDasar 
    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(baseRoom.hargaDasar) 
    : 'N/A';
  const maxGuests = property.tipeKamar?.reduce((acc: number, room: any) => acc + (room.maksDewasa || 0) + (room.maksAnak || 0), 0) || 2;
  const totalRooms = property.tipeKamar?.reduce((acc: number, room: any) => acc + (room.totalUnit || 1), 0) || 1;
  const propertyType = property.tipe?.nama || 'Properti';

  // Extract photos (ensure at least 5 for the bento grid)
  const photos = property.foto || [];
  const mainPhoto = photos.find((f: any) => f.isUtama)?.url || photos[0]?.url || 'https://via.placeholder.com/800x600';
  const gridPhotos = [
    photos[1]?.url || mainPhoto,
    photos[2]?.url || mainPhoto,
    photos[3]?.url || mainPhoto,
    photos[4]?.url || mainPhoto,
  ];

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen pb-20">
      <TopNavBar />

      <main className="pt-28 px-4 md:px-16 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight size={14} />
          <Link href="#" className="hover:text-primary transition-colors">{property.negara || 'Indonesia'}</Link>
          <ChevronRight size={14} />
          <span className="text-primary font-medium truncate">{property.nama}</span>
        </div>

        {/* Title & Actions Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">{property.nama}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium mt-1">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">{propertyType}</span>
              <div className="flex items-center gap-1 text-primary">
                <Star size={16} className="fill-yellow-500 text-yellow-500" />
                <span>4.96</span>
                <span className="text-gray-500 underline cursor-pointer hover:text-primary">(128 ulasan)</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-gray-600">
                <ShieldCheck size={16} className="text-green-600" />
                <span>Terverifikasi</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-gray-600 hover:text-primary cursor-pointer underline">
                <MapPin size={16} />
                <span>{property.alamat}, {property.kota}, {property.provinsi}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-sm font-medium transition-colors">
              <Share size={16} />
              Bagikan
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-sm font-medium transition-colors group">
              <Heart size={16} className="group-hover:fill-red-600" />
              Simpan
            </button>
          </div>
        </div>

        {/* Bento Grid Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[300px] md:h-[500px] rounded-3xl overflow-hidden relative">
          <div className="col-span-1 md:col-span-2 relative group cursor-pointer h-full">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
              style={{ backgroundImage: `url('${mainPhoto}')` }} 
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div className="hidden md:grid col-span-2 grid-cols-2 grid-rows-2 gap-4 h-full">
            {gridPhotos.map((url, i) => (
              <div key={i} className="relative group cursor-pointer h-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                  style={{ backgroundImage: `url('${url}')` }} 
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
            ))}
          </div>
          <button className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 backdrop-blur border border-gray-200 rounded-xl text-sm font-medium shadow-sm hover:bg-white flex items-center gap-2 transition-colors">
            Lihat semua foto
          </button>
        </div>

        {/* Main Content Split */}
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
                  <span className="flex items-center gap-1"><Users size={18} /> Kapasitas total {maxGuests} tamu</span>
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
                  {property.tipeKamar.map((kamar: any) => (
                    <div key={kamar.id} className="border border-gray-200 p-5 rounded-2xl flex flex-col gap-3 hover:shadow-md transition-shadow bg-white">
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
                      <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
                        <span className="font-bold text-primary">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(kamar.hargaDasar)}
                          <span className="text-xs font-normal text-gray-500">/malam</span>
                        </span>
                        <button className="text-sm text-primary font-semibold hover:underline">Pilih</button>
                      </div>
                    </div>
                  ))}
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
                <h3 className="text-xl font-semibold text-primary">Lokasi Anda</h3>
                <p className="text-sm text-gray-600">{property.kota}, {property.provinsi}</p>
                <div className="w-full h-[150px] bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center overflow-hidden relative shadow-inner">
                  <MapPin size={40} className="text-red-500 drop-shadow-md absolute z-10" />
                  <div className="absolute inset-0 opacity-20" style={{
                     backgroundImage: "radial-gradient(#1b3b36 1px, transparent 1px)",
                     backgroundSize: "20px 20px"
                  }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sticky Booking Widget) */}
          <div className="w-full lg:w-[400px] shrink-0">
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

              <div className="border border-gray-300 rounded-2xl overflow-hidden flex flex-col">
                <div className="flex border-b border-gray-300">
                  <div className="flex-1 p-3 border-r border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="block text-[10px] font-bold uppercase text-primary">Check-in</span>
                    <span className="text-sm text-gray-600">Tambah tanggal</span>
                  </div>
                  <div className="flex-1 p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="block text-[10px] font-bold uppercase text-primary">Check-out</span>
                    <span className="text-sm text-gray-600">Tambah tanggal</span>
                  </div>
                </div>
                <div className="p-3 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-primary">Tamu</span>
                    <span className="text-sm text-gray-600">1 tamu</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>

              <button className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2">
                Cek Ketersediaan
              </button>

              <div className="text-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                Anda belum akan dikenakan biaya
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
