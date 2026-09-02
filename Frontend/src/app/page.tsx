import Image from "next/image";
import Link from "next/link";
export const dynamic = 'force-dynamic';
import TopNavBar from "@/components/layout/TopNavBar";
import DateRangeInputs from "@/components/search/DateRangeInputs";
import FadeIn from "@/components/animations/FadeIn";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import {
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Search,
  Heart,
  Star,
  Bed,
  Bath,
  ChevronLeft,
  ChevronRight,
  Building,
  Home as HomeIcon,
  Castle,
  Hotel,
  Tent,
  ShieldCheck,
  Headset,
  FileText,
} from "lucide-react";

export default async function Home() {
  let properties = [];
  let testimonials = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
    const resProperties = await fetch(`${apiUrl}/properti`, { next: { revalidate: 0 } });
    if (resProperties.ok) {
      const json = await resProperties.json();
      if (json.status === 'success') {
        properties = json.data;
      }
    }

    const resTestimonials = await fetch(`${apiUrl}/ulasan/terbaik`, { next: { revalidate: 0 } });
    if (resTestimonials.ok) {
      const json = await resTestimonials.json();
      if (json.status === 'success') {
        testimonials = json.data;
      }
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  return (
    <div className="bg-surface font-sans text-on-surface antialiased overflow-x-hidden min-h-screen">
      {/* Top Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto mt-4 mb-24 pt-4">
          <FadeIn direction="up" duration={0.8}>
          <div className="relative w-full h-[600px] rounded-[2.5rem] overflow-hidden group bg-cover bg-center shadow-sm"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
            }}>
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#e0e5ff]/90 via-[#e0e5ff]/50 to-transparent"></div>

            {/* Trusted Pill */}
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-full py-2 px-4 flex items-center gap-3 shadow-sm border border-white/50">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 bg-cover bg-center" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=1')" }}></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 bg-cover bg-center" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=2')" }}></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400 bg-cover bg-center" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=3')" }}></div>
              </div>
              <span className="text-sm text-[#1E2A4F] font-semibold">Dipercaya oleh 25Ribu+</span>
            </div>

            {/* Left side text */}
            <div className="relative h-full flex flex-col justify-center px-8 md:px-16 w-full md:w-3/5 lg:w-1/2">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1E2A4F] tracking-tight mb-2">
                Temukan<br />Hunian Impianmu
              </h1>
              <p className="text-lg text-[#1E2A4F]/80 max-w-md font-medium">
                Sewa properti eksklusif dengan mudah, aman, dan nyaman.
              </p>
            </div>

            {/* Search Filter Bar */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] md:w-auto z-30">
              <form action="/search" method="GET" className="bg-white border border-gray-100 rounded-[2rem] p-3 flex flex-col md:flex-row items-center gap-2 shadow-2xl">

                <div className="flex-1 flex flex-col justify-center px-6 py-2 min-w-[200px] border-b md:border-b-0 md:border-r border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 mb-1">Lokasi</span>
                  <div className="flex items-center gap-2">
                    <input
                      name="kota"
                      className="bg-transparent border-none p-0 focus:ring-0 text-[#1E2A4F] placeholder-gray-400 text-sm font-semibold w-full focus:outline-none"
                      placeholder="Mau ke mana?"
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center px-6 py-2 min-w-[180px] border-b md:border-b-0 md:border-r border-gray-100 relative">
                  <span className="text-xs font-semibold text-gray-400 mb-1">Tipe Properti</span>
                  <div className="flex items-center gap-2 w-full">
                    <select
                      name="tipe"
                      className="bg-transparent border-none p-0 focus:ring-0 text-[#1E2A4F] text-sm font-semibold w-full focus:outline-none cursor-pointer appearance-none"
                    >
                      <option value="">Semua Tipe</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Vila">Vila</option>
                      <option value="Apartemen">Apartemen</option>
                      <option value="Rumah">Rumah</option>
                      <option value="Kabin">Kabin</option>
                    </select>
                    <ChevronRight size={16} className="text-gray-400 shrink-0 rotate-90 absolute right-6 pointer-events-none" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center px-6 py-2 min-w-[180px] relative">
                  <span className="text-xs font-semibold text-gray-400 mb-1">Rentang Harga</span>
                  <div className="flex items-center gap-2 w-full">
                    <select
                      name="harga"
                      className="bg-transparent border-none p-0 focus:ring-0 text-[#1E2A4F] text-sm font-semibold w-full focus:outline-none cursor-pointer appearance-none"
                    >
                      <option value="">Semua Harga</option>
                      <option value="0-500000">Di bawah Rp 500.000</option>
                      <option value="500000-1000000">Rp 500.000 - Rp 1.000.000</option>
                      <option value="1000000-2000000">Rp 1.000.000 - Rp 2.000.000</option>
                      <option value="2000000-5000000">Rp 2.000.000 - Rp 5.000.000</option>
                      <option value="5000000-">Di atas Rp 5.000.000</option>
                    </select>
                    <ChevronRight size={16} className="text-gray-400 shrink-0 rotate-90 absolute right-6 pointer-events-none" />
                  </div>
                </div>

                <button type="submit" className="w-full md:w-auto h-14 px-8 rounded-full bg-[#1E2A4F] text-white flex items-center justify-center hover:bg-[#111827] transition-colors shadow-sm shrink-0 font-medium text-sm">
                  <Search size={18} className="mr-2" /> Cari
                </button>
              </form>
            </div>
          </div>
          </FadeIn>
        </section>

        {/* 4 Feature Row */}
        <section id="layanan" className="px-4 md:px-16 max-w-7xl mx-auto mb-24">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StaggerItem className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#fafafa] p-6 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <HomeIcon size={24} strokeWidth={2} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1E2A4F]">Properti Terverifikasi</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Semua properti diverifikasi demi ketenangan pikiran Anda.</p>
              </div>
            </StaggerItem>
            <StaggerItem className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#fafafa] p-6 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={24} strokeWidth={2} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1E2A4F]">Aman & Terlindungi</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Keamanan Anda adalah prioritas kami dalam setiap transaksi.</p>
              </div>
            </StaggerItem>
            <StaggerItem className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#fafafa] p-6 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Headset size={24} strokeWidth={2} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1E2A4F]">Dukungan 24/7</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Tim kami siap membantu Anda kapanpun, dimanapun.</p>
              </div>
            </StaggerItem>
            <StaggerItem className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#fafafa] p-6 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                <Star size={24} strokeWidth={2} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1E2A4F]">Jaminan Harga Terbaik</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Dapatkan penawaran terbaik dengan harga terbaik.</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* More Than Just A Property Section */}
        <section id="tentang-kami" className="px-4 md:px-16 max-w-7xl mx-auto mb-24">
          <FadeIn direction="up">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-5/12 flex flex-col gap-6">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mengapa Memilih StayNest</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1E2A4F] leading-tight">
                Lebih Dari Sekadar<br />Sebuah Properti
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                Kami menawarkan lebih dari sekadar ruangan. Kami menghadirkan pengalaman yang sesuai dengan kehidupan dan masa depan Anda.
              </p>
              <ul className="flex flex-col gap-4 mt-2">
                <li className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 text-xs">✓</div>
                  Berbagai pilihan sewa premium
                </li>
                <li className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 text-xs">✓</div>
                  Syarat sewa fleksibel & perjanjian mudah
                </li>
                <li className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 text-xs">✓</div>
                  Rekomendasi yang dipersonalisasi
                </li>
                <li className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 text-xs">✓</div>
                  Dipercaya oleh ribuan klien yang bahagia
                </li>
              </ul>
              <div className="mt-4">
                <button className="px-8 py-3.5 rounded-full bg-[#1E2A4F] text-white hover:bg-[#111827] transition-colors shadow-sm font-semibold text-sm">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>
            <div className="lg:w-7/12 relative w-full h-[400px] lg:h-[500px] rounded-[2rem] overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')" }}></div>
            </div>
          </div>
          </FadeIn>
        </section>

        {/* Explore Property Types */}
        <section id="tipe-properti" className="px-4 md:px-16 max-w-7xl mx-auto mb-20">
          <FadeIn direction="up">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-black">Jelajahi Tipe Properti</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="border border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer bg-white group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-black">Apartemen</h4>
                <p className="text-xs text-gray-500">1.245 Properti</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer bg-white group">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HomeIcon size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-black">Rumah</h4>
                <p className="text-xs text-gray-500">2.345 Properti</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer bg-white group">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Castle size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-black">Vila</h4>
                <p className="text-xs text-gray-500">856 Properti</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer bg-white group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Hotel size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-black">Hotel</h4>
                <p className="text-xs text-gray-500">1.032 Properti</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer bg-white group hidden lg:flex">
              <div className="w-12 h-12 rounded-xl bg-stone-50 text-stone-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Tent size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-black">Kabin</h4>
                <p className="text-xs text-gray-500">321 Properti</p>
              </div>
            </div>
          </div>
          </FadeIn>
        </section>

        {/* Featured Properties */}
        <section id="properti-pilihan" className="px-4 md:px-16 max-w-7xl mx-auto mb-32">
          <FadeIn direction="up">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-black">Properti Pilihan</h2>
            <Link href="/search" className="text-black font-semibold hover:underline flex items-center gap-1 text-sm">
              Lihat Semua Properti <ArrowRight size={16} />
            </Link>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {properties.length > 0 ? (
              properties.slice(0, 4).map((property: any) => {
                const fotoUtama = property.foto?.find((f: any) => f.isUtama)?.url || property.foto?.[0]?.url || 'https://via.placeholder.com/400x300';
                const tipeKamarDasar = property.tipeKamar?.[0];
                const harga = tipeKamarDasar?.hargaDasar
                  ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(tipeKamarDasar.hargaDasar)
                  : 'N/A';
                const beds = tipeKamarDasar?.maksDewasa || 2;
                const baths = tipeKamarDasar?.maksAnak || 2;
                const guests = tipeKamarDasar?.maksTamu || 4;

                return (
                  <Link href={`/property/${property.id}`} key={property.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col">
                    <div className="relative h-48 overflow-hidden p-2">
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white text-black text-xs font-bold shadow-sm z-10">
                        Pilihan
                      </div>
                      <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10 shadow-sm">
                        <Heart size={16} />
                      </button>
                      <div
                        className="w-full h-full rounded-xl bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `url('${fotoUtama}')`,
                        }}
                      ></div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-black mb-1 truncate">
                        {property.nama}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                        <MapPin size={14} /> {property.kota}, {property.provinsi}
                      </p>
                      <div className="text-lg text-black font-bold mb-4">
                        {harga} <span className="text-xs text-gray-500 font-normal">/malam</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-auto border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium whitespace-nowrap">
                          <Bed size={14} /> {beds} Kasur
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium whitespace-nowrap">
                          <Bath size={14} /> {baths} Kamar Mandi
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium whitespace-nowrap">
                          <Users size={14} /> {guests} Tamu
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-4 text-center py-12 text-gray-500">
                Belum ada properti yang tersedia saat ini.
              </div>
            )}
          </div>
          </FadeIn>
        </section>



        {/* Testimonials Section */}
        <section id="ulasan" className="px-4 md:px-16 max-w-7xl mx-auto mb-32">
          <FadeIn direction="up">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-black">Apa Kata Klien Kami</h2>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full border border-gray-200 text-black flex items-center justify-center hover:bg-gray-100 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-200 text-black flex items-center justify-center hover:bg-gray-100 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial: any) => (
                <div key={testimonial.id} className="min-w-[300px] md:min-w-[400px] bg-white p-8 rounded-2xl border border-gray-100 snap-center shadow-sm flex flex-col">
                  <div className="text-5xl text-black font-serif leading-none h-8 text-opacity-30">"</div>
                  <p className="text-sm text-gray-600 mb-8 flex-1 leading-relaxed">
                    {testimonial.komentar || 'Pengalaman yang luar biasa!'}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: "url('https://i.pravatar.cc/150')" }}></div>
                      <div>
                        <h4 className="font-semibold text-black text-sm line-clamp-1">{testimonial.pengguna?.nama || 'Anonim'}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {testimonial.kota || 'User'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-yellow-400">
                      {[...Array(testimonial.penilaian)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="min-w-[300px] md:min-w-[400px] bg-white p-8 rounded-2xl border border-gray-100 snap-center shadow-sm flex items-center justify-center text-gray-500 w-full">
                Belum ada ulasan saat ini.
              </div>
            )}
          </div>
          </FadeIn>
        </section>

        {/* Newsletter CTA */}
        <section className="px-4 md:px-16 max-w-7xl mx-auto mb-32">
          <FadeIn direction="up">
          <div className="bg-[#111827] rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/3 h-48 md:h-auto self-stretch bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}></div>
            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Dapatkan Pembaruan Properti Eksklusif</h3>
                <p className="text-gray-400 text-sm">Berlangganan nawala kami dan jadilah yang pertama tahu tentang daftar properti baru dan penawaran spesial.</p>
              </div>
              <form className="flex w-full md:w-auto bg-white rounded-full p-1 pl-4 items-center flex-shrink-0">
                <input type="email" placeholder="Masukkan alamat email Anda" className="bg-transparent border-none focus:ring-0 text-sm w-full md:w-64 outline-none px-2 font-medium" />
                <button type="submit" className="px-6 py-3 rounded-full bg-[#059669] text-white text-sm font-semibold hover:bg-[#047857] transition-colors whitespace-nowrap">Berlangganan</button>
              </form>
            </div>
          </div>
          </FadeIn>
        </section>
      </main>

      {/* Footer */}
      <footer id="kontak" className="w-full py-20 bg-[#111827] border-t border-gray-800 text-white">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 px-4 md:px-16 max-w-7xl mx-auto">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
            <Link
              href="/"
              className="font-bold text-2xl text-white flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-black">
                <MapPin size={18} />
              </div>
              StayNest
            </Link>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Mitra tepercaya Anda dalam menemukan properti yang sempurna.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white cursor-pointer transition-colors"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white cursor-pointer transition-colors"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white cursor-pointer transition-colors"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-white cursor-pointer transition-colors"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white mb-2">Tautan Cepat</h4>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Beli</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Sewa</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Jual</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Agen</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Kontak</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white mb-2">Tipe Properti</h4>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Apartemen</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Rumah</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Vila</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Kondominium</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Townhouse</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Tanah</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white mb-2">Perusahaan</h4>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Tentang Kami</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Karir</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">FAQ</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Kebijakan Privasi</Link>
          </div>
        </div>

        <div className="px-4 md:px-16 max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2024 StayNest. Hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
