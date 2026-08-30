import Image from "next/image";
export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Wallet, Building2, Check, ShieldCheck, MapPin } from "lucide-react";
import { redirect } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import CheckoutClient from "@/components/property/CheckoutClient";

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
      // We also need paketHargaId for the API payload
      const paketHargaId = room.paketHarga?.[0]?.id || '';
      
      cartDetails.push({
        ...room,
        count: item.count,
        paketHargaId
      });
    }
  });

  const subtotal = basePricePerNight * nights;
  const serviceFee = subtotal * 0.05; // 5% service fee
  const tax = subtotal * 0.11; // 11% tax
  const total = subtotal + serviceFee + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const propertyImage = property.fotoProperti && property.fotoProperti.length > 0 
    ? property.fotoProperti[0].urlFoto 
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <AuthGuard>
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
                <div className="flex justify-between">
                  <span className="text-slate-500">Pajak (11%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 mt-3">
                  <span className="font-bold text-forest-900 text-base">Total Keseluruhan</span>
                  <span className="font-bold text-primary text-xl">{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Payment Modal & Form */}
        <CheckoutClient 
          propertyId={propertyId}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          cartDetails={cartDetails}
        />

      </div>
      </div>
    </AuthGuard>
  );
}
