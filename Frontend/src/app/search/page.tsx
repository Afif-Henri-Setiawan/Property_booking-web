import Image from "next/image";
import Link from "next/link";
import TopNavBar from "@/components/layout/TopNavBar";
import DateRangeInputs from "@/components/search/DateRangeInputs";
import { MapPin, Star, Bed, Bath, Users, Heart } from "lucide-react";

// Server component that fetches data based on search params
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { kota, tanggalMulai, tanggalSelesai, dewasa, anak, jumlahKamar } = searchParams;
  
  // Build query string
  const query = new URLSearchParams();
  if (kota) query.append('kota', kota as string);
  if (tanggalMulai) query.append('tanggalMulai', tanggalMulai as string);
  if (tanggalSelesai) query.append('tanggalSelesai', tanggalSelesai as string);
  if (dewasa) query.append('dewasa', dewasa as string);
  if (anak) query.append('anak', anak as string);
  if (jumlahKamar) query.append('jumlahKamar', jumlahKamar as string);

  let properties = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const queryString = query.toString();
    const url = `${apiUrl}/search${queryString ? `?${queryString}` : ''}`;
    
    const res = await fetch(url, { next: { revalidate: 0 } }); // No cache for dynamic search
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success') {
        properties = json.data;
      }
    }
  } catch (error) {
    console.error("Failed to fetch search results:", error);
  }

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen flex flex-col">
      <TopNavBar />
      
      <main className="pt-24 px-4 md:px-16 max-w-7xl mx-auto w-full flex-1 mb-20 flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full md:w-1/4 h-fit bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
          <h2 className="text-xl font-semibold text-primary mb-6">Filter</h2>
          
          <form className="flex flex-col gap-6" action="/search" method="GET">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi / Destinasi</label>
              <input 
                type="text" 
                name="kota" 
                defaultValue={kota as string || ''}
                placeholder="Mau ke mana?" 
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            
            <DateRangeInputs 
              initialCheckIn={tanggalMulai as string} 
              initialCheckOut={tanggalSelesai as string} 
              layout="vertical" 
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamu Dewasa</label>
                <input 
                  type="number" 
                  name="dewasa" 
                  min="1"
                  defaultValue={dewasa as string || '1'}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kamar</label>
                <input 
                  type="number" 
                  name="jumlahKamar" 
                  min="1"
                  defaultValue={jumlahKamar as string || '1'}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>
            </div>
            
            <hr className="border-gray-100" />
            
            <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-[#1b3b36] transition-colors">
              Terapkan Filter
            </button>
          </form>
        </aside>

        {/* Search Results */}
        <div className="w-full md:w-3/4">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-primary">
              {properties.length > 0 ? `${properties.length} Properti ditemukan` : 'Tidak ada properti ditemukan'}
              {kota ? ` di ${kota}` : ''}
            </h1>
            <p className="text-gray-500 mt-1">Pilih akomodasi terbaik untuk perjalanan Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.length > 0 ? (
              properties.map((property: any) => {
                const fotoUtama = property.fotoUtama || 'https://via.placeholder.com/400x300';
                const harga = property.hargaMulaiDari 
                  ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(property.hargaMulaiDari) 
                  : 'N/A';
                
                return (
                  <Link href={`/property/${property.id}`} key={property.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full">
                    <div className="relative h-56 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `url('${fotoUtama}')`,
                        }}
                      ></div>
                      <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/70 backdrop-blur flex items-center justify-center text-primary hover:text-red-500 transition-colors z-10">
                        <Heart size={20} />
                      </button>
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/70 backdrop-blur flex items-center gap-1 z-10">
                        <span className="text-xs font-semibold text-primary">{property.tipe}</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-semibold text-primary mb-2 truncate group-hover:text-emerald-700 transition-colors">
                        {property.nama}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                        <MapPin size={16} /> {property.kota}, {property.provinsi}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400">Mulai dari</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl text-primary font-bold">{harga}</span>
                            <span className="text-xs text-gray-500">/malam</span>
                          </div>
                        </div>
                        <span className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium group-hover:bg-primary group-hover:text-white transition-colors">
                          Lihat
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-1 md:col-span-2 bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <MapPin size={32} />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Pencarian Tidak Membuahkan Hasil</h3>
                <p className="text-gray-500 mb-6">Coba ubah lokasi, tanggal, atau kriteria pencarian Anda.</p>
                <Link href="/search" className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-[#1b3b36] transition-colors inline-block">
                  Reset Filter
                </Link>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
