import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Wallet, Building2, Check, ShieldCheck, MapPin } from "lucide-react";
import { redirect } from "next/navigation";

// Interface for cart item
interface CartItem {
  roomId: string;
  count: number;
}

export default async function BookPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const propertyId = params.id;
  
  // Parse Search Params
  const checkIn = searchParams.checkIn as string;
  const checkOut = searchParams.checkOut as string;
  const guests = parseInt(searchParams.guests as string) || 1;
  const cartParam = searchParams.cart as string;
  
  if (!checkIn || !checkOut || !cartParam) {
    // Missing required parameters, redirect back to property page
    redirect(`/property/${propertyId}`);
  }

  let cart: CartItem[] = [];
  try {
    cart = JSON.parse(cartParam);
  } catch (e) {
    redirect(`/property/${propertyId}`);
  }

  if (cart.length === 0) {
    redirect(`/property/${propertyId}`);
  }

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24)));

  // Fetch Property Data
  const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
  const res = await fetch(`${apiUrl}/properti/${propertyId}`, { next: { revalidate: 0 } });
  
  if (!res.ok) {
    return <div className="p-8 text-center text-red-500">Gagal memuat data properti.</div>;
  }
  
  const responseData = await res.json();
  const property = responseData.data;

  // Format Dates
  const formattedCheckIn = checkInDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedCheckOut = checkOutDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  // Calculate Total
  let basePricePerNight = 0;
  const cartDetails: any[] = [];
  
  cart.forEach(item => {
    const room = property.tipeKamar?.find((r: any) => r.id === item.roomId);
    if (room && item.count > 0) {
      basePricePerNight += (room.hargaDasar * item.count);
      cartDetails.push({
        ...room,
        count: item.count
      });
    }
  });

  const subtotal = basePricePerNight * nights;
  const serviceFee = subtotal * 0.05; // Example 5% service fee
  const total = subtotal + serviceFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const propertyImage = property.fotoProperti && property.fotoProperti.length > 0 
    ? property.fotoProperti[0].urlFoto 
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="min-h-screen bg-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Order Summary */}
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-forest-900">Tinjau Pesanan Anda</h1>
            <p className="text-slate-500 mt-2">Sedikit lagi! Silakan tinjau detail pesanan Anda sebelum melakukan pembayaran.</p>
          </div>

          <Card className="border-slate-200 overflow-hidden shadow-sm">
            <div className="h-48 relative bg-slate-200">
              <img 
                src={propertyImage} 
                alt={property.judul || 'Properti'} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-forest-900 mb-1">{property.judul || 'Properti'}</h2>
              <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                <MapPin size={14} />
                {property.kota}, {property.provinsi}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="text-slate-500 font-medium">Check-in</p>
                  <p className="font-bold text-forest-900">{formattedCheckIn}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Check-out</p>
                  <p className="font-bold text-forest-900">{formattedCheckOut}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Total Tamu</p>
                  <p className="font-bold text-forest-900">{guests} Tamu</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Durasi Menginap</p>
                  <p className="font-bold text-forest-900">{nights} Malam</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-forest-900 mb-3">Detail Kamar</h3>
                <div className="space-y-3">
                  {cartDetails.map((room) => (
                    <div key={room.id} className="flex justify-between items-start text-sm">
                      <div>
                        <p className="font-medium text-forest-900">{room.count}x {room.nama}</p>
                        <p className="text-slate-500">{formatPrice(room.hargaDasar)} / malam</p>
                      </div>
                      <p className="font-medium text-forest-900">{formatPrice(room.hargaDasar * room.count * nights)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal ({nights} malam)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Biaya Layanan (5%)</span>
                  <span className="font-medium">{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 mt-3">
                  <span className="font-bold text-forest-900 text-base">Total Keseluruhan</span>
                  <span className="font-bold text-primary text-xl">{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Payment Modal Simulation */}
        <div className="flex items-start justify-center pt-8">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-fixed to-primary" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-primary h-6 w-6" />
                  <span className="font-bold text-forest-900">Pembayaran Aman</span>
                </div>
                <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">Simulasi</span>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-500 mb-2">Pilih Metode Pembayaran</p>
                
                <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-primary bg-primary/5 text-left transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded shadow-sm">
                      <CreditCard className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-forest-900">Kartu Kredit</p>
                      <p className="text-xs text-slate-500">Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-primary/50 text-left transition-all opacity-60">
                  <div className="p-2 bg-slate-50 rounded">
                    <Building2 className="text-slate-500 h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-forest-900">Transfer Bank</p>
                    <p className="text-xs text-slate-500">BCA, Mandiri, BNI</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-primary/50 text-left transition-all opacity-60">
                  <div className="p-2 bg-slate-50 rounded">
                    <Wallet className="text-slate-500 h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-forest-900">E-Wallet</p>
                    <p className="text-xs text-slate-500">GoPay, ShopeePay</p>
                  </div>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <Button className="w-full py-6 text-lg rounded-xl bg-primary hover:bg-primary-container text-white font-bold shadow-lg shadow-primary/20">
                  Konfirmasi Pemesanan
                </Button>
                <p className="text-center text-xs text-slate-400 mt-4">Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan kami.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
