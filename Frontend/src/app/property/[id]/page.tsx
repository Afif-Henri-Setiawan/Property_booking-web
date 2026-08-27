import TopNavBar from "@/components/layout/TopNavBar";
export const dynamic = 'force-dynamic';
import {
  Star, Share, Heart, MapPin, ChevronRight, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyDetailsClient from "@/components/property/PropertyDetailsClient";
import AuthGuard from "@/components/auth/AuthGuard";

export default async function PropertyDetail(props: { params: Promise<{ id: string }> }) {
  // Fetch data from backend
  const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
  const params = await props.params;
  const { id } = params;
  const res = await fetch(`${apiUrl}/properti/${id}`, { next: { revalidate: 0 } });

  if (!res.ok) {
    if (res.status === 404) return notFound();
    const errorText = await res.text();
    console.error("Backend Error:", res.status, res.statusText, errorText);
    throw new Error(`Failed to fetch property details: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const property = json.data;
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
    <AuthGuard>
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

        {/* Client component for interactive booking and room selection */}
        <PropertyDetailsClient property={property} />

      </main>
      </div>
    </AuthGuard>
  );
}
