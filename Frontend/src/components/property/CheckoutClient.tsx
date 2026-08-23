"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Building2, Check, ShieldCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@clerk/nextjs";

interface CheckoutClientProps {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  cartDetails: Array<{
    id: string;
    paketHargaId: string;
    count: number;
  }>;
}

export default function CheckoutClient({ propertyId, checkIn, checkOut, guests, cartDetails }: CheckoutClientProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");

  const handleConfirm = async () => {
    if (!nama || !email || !telepon) {
      setErrorMsg("Mohon lengkapi Data Tamu terlebih dahulu.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const token = await getToken();
      if (!token) {
        router.push("/sign-in");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const payload = {
        propertiId: propertyId,
        waktuCheckIn: new Date(checkIn).toISOString(),
        waktuCheckOut: new Date(checkOut).toISOString(),
        dewasa: guests,
        anak: 0,
        bayi: 0,
        kamar: cartDetails.map(room => ({
          tipeKamarId: room.id,
          paketHargaId: room.paketHargaId,
          jumlahKamar: room.count
        })),
        tamuPemesanan: [
          {
            nama,
            email,
            telepon,
            tipeTamu: "DEWASA"
          }
        ]
      };

      const res = await fetch(`${apiUrl}/pemesanan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat memproses pesanan.");
      }

      // If successful, redirect to bookings history page
      router.push("/user/bookings");

    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center pt-8">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-fixed to-primary" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-primary h-6 w-6" />
              <span className="font-bold text-forest-900">Pembayaran Aman</span>
            </div>
            <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">Simulasi</span>
          </div>

          {/* Form Data Tamu */}
          <div className="space-y-3 mb-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-sm font-bold text-forest-900 mb-2">Data Tamu Utama</p>
            <div>
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                value={nama}
                onChange={e => setNama(e.target.value)}
                className="w-full text-sm p-3 rounded-lg border border-slate-200 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Alamat Email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-sm p-3 rounded-lg border border-slate-200 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <input 
                type="tel" 
                placeholder="Nomor Telepon" 
                value={telepon}
                onChange={e => setTelepon(e.target.value)}
                className="w-full text-sm p-3 rounded-lg border border-slate-200 outline-none focus:border-primary transition-colors"
              />
            </div>
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
            {errorMsg && (
              <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-lg mb-4">
                {errorMsg}
              </div>
            )}
            <Button 
              onClick={handleConfirm}
              disabled={loading}
              className="w-full py-6 text-lg rounded-xl bg-primary hover:bg-primary-container text-white font-bold shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Konfirmasi Pemesanan"}
            </Button>
            <p className="text-center text-xs text-slate-400 mt-4">Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan kami.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
