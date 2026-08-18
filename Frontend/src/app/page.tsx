import Image from "next/image";
import Link from "next/link";
import TopNavBar from "@/components/layout/TopNavBar";
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
  Globe,
} from "lucide-react";

export default async function Home() {
  let properties = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${apiUrl}/properti`, { next: { revalidate: 0 } });
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success') {
        properties = json.data;
      }
    }
  } catch (error) {
    console.error("Failed to fetch properties:", error);
  }

  return (
    <div className="bg-surface font-sans text-on-surface antialiased overflow-x-hidden min-h-screen">
      {/* Top Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative px-4 md:px-16 max-w-7xl mx-auto mt-8 mb-32">
          <div
            className="relative w-full h-[600px] rounded-3xl overflow-hidden group bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBVd8YTQueNEOqCLGuNlhji2TM4WMvaINmecGKaiPoVC4GCXxhk0gm6fRHV9gr65VxaNy4CjG_pz0-9PrUvHhuYe1RWuVgwQ0RDdfazjkM5pSlks0hjV35-cSq_x9GkZzqg_6JH0O1n0GOe4-uO3jDHplJHRb8EOJKnCtyATLIa9afYKDZhHmW8deT-p8T3hW_uiFjtg4zCtkkokWEzMtOxqUJL9DWHv393qZqUMzvt0Pn_ovdwLjbl')",
            }}
          >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1b3b36]/40 to-transparent"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
              <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white font-medium text-sm mb-6 shadow-sm">
                No.1 Property Rental Platform
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white max-w-4xl drop-shadow-lg mb-12 tracking-tight">
                Turning Your Vacation Dreams into Reality
              </h1>
            </div>

            {/* Floating Search Filter (Glassmorphism) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-white/70 backdrop-blur-xl border border-white/30 rounded-[100px] p-2 flex flex-col md:flex-row items-center gap-2 shadow-[0px_20px_40px_rgba(27,59,54,0.15)] z-20">
              <div className="flex-1 flex items-center gap-4 px-6 py-4 w-full md:w-auto border-b md:border-b-0 md:border-r border-white/20">
                <MapPin className="text-primary/70" />
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-medium text-primary/70">
                    Destination
                  </span>
                  <input
                    className="bg-transparent border-none p-0 focus:ring-0 text-primary placeholder-primary/50 text-sm h-6 w-full focus:outline-none"
                    placeholder="Where to?"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-4 px-6 py-4 w-full md:w-auto border-b md:border-b-0 md:border-r border-white/20">
                <Calendar className="text-primary/70" />
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-medium text-primary/70">
                    Check in - out
                  </span>
                  <input
                    className="bg-transparent border-none p-0 focus:ring-0 text-primary placeholder-primary/50 text-sm h-6 w-full focus:outline-none"
                    placeholder="Add dates"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-4 px-6 py-4 w-full md:w-auto">
                <Users className="text-primary/70" />
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-medium text-primary/70">
                    Guests
                  </span>
                  <input
                    className="bg-transparent border-none p-0 focus:ring-0 text-primary placeholder-primary/50 text-sm h-6 w-full focus:outline-none"
                    placeholder="Add guests"
                    type="text"
                  />
                </div>
              </div>
              <button className="w-full md:w-auto h-14 md:w-14 rounded-full bg-primary text-white flex items-center justify-center hover:bg-[#1b3b36] transition-colors shadow-md mx-2 mb-2 md:mb-0 shrink-0">
                <Search size={20} />
                <span className="md:hidden ml-2">Search</span>
              </button>
            </div>
          </div>
        </section>

        {/* Explore Properties */}
        <section className="px-4 md:px-16 max-w-7xl mx-auto mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <h2 className="text-3xl font-semibold text-primary">
              Explore our latest properties
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              <button className="px-6 py-2 rounded-full bg-primary text-white text-sm whitespace-nowrap">
                All Types
              </button>
              <button className="px-6 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm whitespace-nowrap">
                Villa
              </button>
              <button className="px-6 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm whitespace-nowrap">
                Hotel
              </button>
              <button className="px-6 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm whitespace-nowrap">
                Resort
              </button>
              <button className="px-6 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm whitespace-nowrap">
                Cabin
              </button>
              <button className="px-6 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm whitespace-nowrap">
                Apartment
              </button>
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.length > 0 ? (
              properties.map((property: any) => {
                const fotoUtama = property.foto?.find((f: any) => f.isUtama)?.url || property.foto?.[0]?.url || 'https://via.placeholder.com/400x300';
                const tipeKamarDasar = property.tipeKamar?.[0];
                const harga = tipeKamarDasar?.hargaDasar 
                  ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(tipeKamarDasar.hargaDasar) 
                  : 'N/A';
                const beds = tipeKamarDasar?.maksDewasa || 2;
                const baths = tipeKamarDasar?.maksAnak || 2; // placeholder logic
                const guests = tipeKamarDasar?.maksTamu || 4;
                
                return (
                  <Link href={`/property/${property.id}`} key={property.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col">
                    <div className="relative h-64 overflow-hidden">
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
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-primary font-bold">4.9</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-semibold text-primary mb-2 truncate">
                        {property.nama}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                        <MapPin size={16} /> {property.kota}, {property.provinsi}
                      </p>
                      <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Bed size={18} /> {beds} Beds
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Bath size={18} /> {baths} Baths
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Users size={18} /> {guests} Guests
                        </div>
                      </div>
                      <div className="mt-auto flex justify-between items-center">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl text-primary font-bold">{harga}</span>
                          <span className="text-sm text-gray-500">/night</span>
                        </div>
                        <button className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm font-medium">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                Belum ada properti yang tersedia saat ini.
              </div>
            )}
          </div>

          <div className="flex justify-center mt-12">
            <button className="px-8 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors font-medium flex items-center gap-2">
              View All Properties
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-4 md:px-16 max-w-7xl mx-auto mb-32">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3 flex flex-col gap-6">
              <h2 className="text-3xl font-semibold text-primary">
                Discover what clients are saying about us
              </h2>
              <p className="text-gray-500">
                Hear from our community of travelers and hosts about their
                experiences with StayNest. Real stories from real people.
              </p>
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <ChevronLeft size={24} />
                </button>
                <button className="w-12 h-12 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
            <div className="md:w-2/3 flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x">
              {/* Card 1 */}
              <div className="min-w-[300px] md:min-w-[400px] bg-white p-8 rounded-2xl border border-gray-100 snap-center shadow-sm">
                <div className="flex gap-1 text-yellow-500 mb-4">
                  <Star size={20} className="fill-yellow-500" />
                  <Star size={20} className="fill-yellow-500" />
                  <Star size={20} className="fill-yellow-500" />
                  <Star size={20} className="fill-yellow-500" />
                  <Star size={20} className="fill-yellow-500" />
                </div>
                <p className="text-lg text-gray-600 italic mb-6">
                  "The villa in Aspen exceeded all our expectations. The booking
                  process was seamless, and the property was exactly as
                  described. A truly luxurious experience."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div>
                    <h4 className="font-semibold text-primary">Sarah Jenkins</h4>
                    <p className="text-sm text-gray-500">
                      Stayed at The Grandview
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="min-w-[300px] md:min-w-[400px] bg-white p-8 rounded-2xl border border-gray-100 snap-center shadow-sm">
                <div className="flex gap-1 text-yellow-500 mb-4">
                  <Star size={20} className="fill-yellow-500" />
                  <Star size={20} className="fill-yellow-500" />
                  <Star size={20} className="fill-yellow-500" />
                  <Star size={20} className="fill-yellow-500" />
                  <Star size={20} className="fill-yellow-500" />
                </div>
                <p className="text-lg text-gray-600 italic mb-6">
                  "Our family vacation at Royal Crest Manor was unforgettable.
                  The amenities were top-notch and the location was perfect. We
                  will definitely use StayNest again."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div>
                    <h4 className="font-semibold text-primary">Michael Chen</h4>
                    <p className="text-sm text-gray-500">
                      Stayed at Royal Crest Manor
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News & Updates Section */}
        <section className="px-4 md:px-16 max-w-7xl mx-auto mb-32">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-semibold text-primary">
              Latest News & Updates
            </h2>
            <button className="hidden md:flex px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors font-medium items-center gap-2">
              View All Articles
            </button>
          </div>

          {/* Highlight Card */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col md:flex-row mb-8 group cursor-pointer hover:shadow-2xl transition-all duration-300">
            <div
              className="md:w-1/2 h-64 md:h-auto bg-cover bg-center bg-gray-200"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCy3Ps_CdX2BN15cVk11qpxXxWNqfx1ovXW3n7BAsV2Kj5UIB8PJ6tp_o_TN3FaV6I-hlMVGaZW1Hlc-5Ery-PgRSoGPiusalxxlUSc_d43ScEV_-mq00P-PR5QaDvTbICy3C4E1fwsFmR41I08OjomlSZFxV3ImT55aX7CtbPMrLJ3pdaBf-Wx3aUN5YuNb77E7MhkNmGCrjlz7jkm_xdLWjE2JzNBJ77rpT9--uMO5P7ClsPOV7Wr')",
              }}
            ></div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  Travel Guide
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  Oct 15, 2024
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-primary mb-4 group-hover:text-[#1b3b36] transition-colors">
                The Ultimate Guide to Luxury Winter Getaways in the Swiss Alps
              </h3>
              <p className="text-gray-500 mb-6">
                Discover the most exclusive chalets and hidden gems for your
                next winter escape. From ski-in/ski-out access to private chefs,
                here's everything you need to know.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium">
                Read Article <ArrowRight size={18} />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="flex gap-3 mb-3">
                  <span className="text-sm font-medium text-primary">
                    Host Stories
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2 line-clamp-2">
                  How I Turned My Coastal Villa into a Top-Rated StayNest
                </h4>
                <p className="text-gray-500 line-clamp-2">
                  Learn the secrets of successful hosting from one of our
                  top-rated property owners in Malibu.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="flex gap-3 mb-3">
                  <span className="text-sm font-medium text-primary">
                    Travel Guide
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2 line-clamp-2">
                  Top 10 Hidden Beach Retreats for Summer 2024
                </h4>
                <p className="text-gray-500 line-clamp-2">
                  Beat the crowds and discover pristine beaches with our
                  curated list of secluded coastal properties.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 hidden lg:block">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="flex gap-3 mb-3">
                  <span className="text-sm font-medium text-primary">
                    Platform News
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2 line-clamp-2">
                  Introducing the New StayNest Concierge Service
                </h4>
                <p className="text-gray-500 line-clamp-2">
                  Elevate your stay with our new 24/7 personalized concierge
                  service, available exclusively for premium bookings.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-20 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-16 max-w-7xl mx-auto">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <Link
              href="/"
              className="font-bold text-xl text-primary flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
                <MapPin size={18} />
              </div>
              StayNest
            </Link>
            <p className="text-gray-500 mt-4">
              Turning your vacation dreams into reality with premium, curated
              luxury rentals worldwide.
            </p>
          </div>

          {/* Links Columns */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8 pt-4 md:pt-0">
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-primary mb-2">Company</h4>
              <Link
                href="#"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                Careers
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-primary mb-2">Legal</h4>
              <Link
                href="#"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-16 max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500">© 2024 StayNest. All rights reserved.</p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <Globe size={20} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
