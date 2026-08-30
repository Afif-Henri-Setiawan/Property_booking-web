"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Building2, Check, ShieldCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth, useUser } from "@clerk/nextjs";

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
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");

  // Pre-fill user data when loaded
  useEffect(() => {
    if (isLoaded && user) {
      if (!nama && user.fullName) {
        setNama(user.fullName);
      }
      if (!email && user.primaryEmailAddress) {
        setEmail(user.primaryEmailAddress.emailAddress);
      }
    }
  }, [isLoaded, user]);

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

      const pemesananId = data.data.id;

      // 2. Fetch Payment Token from Midtrans
      const paymentRes = await fetch(`${apiUrl}/pembayaran/${pemesananId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(paymentData.message || "Gagal mendapatkan token pembayaran.");
      }

      const snapToken = paymentData.data.paymentGateway.token;

      // 3. Trigger Midtrans Snap
      // @ts-ignore
      if (window.snap) {
        // @ts-ignore
        window.snap.pay(snapToken, {
          onSuccess: function(result: any) {
            router.push("/user/bookings?status=success");
          },
          onPending: function(result: any) {
            router.push("/user/bookings?status=pending");
          },
          onError: function(result: any) {
            setErrorMsg("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: function() {
            router.push("/user/bookings");
          }
        });
      } else {
        throw new Error("Sistem pembayaran belum siap, silakan refresh halaman.");
      }

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
              <span className="font-bold text-forest-900">Informasi Tamu</span>
            </div>
          </div>

          {/* Form Data Tamu */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nama Lengkap</label>
              <input 
                type="text" 
                placeholder="Masukkan nama lengkap" 
                value={nama}
                onChange={e => setNama(e.target.value)}
                className="w-full text-sm p-3 rounded-lg border border-slate-200 outline-none focus:border-primary transition-colors bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Alamat Email</label>
              <input 
                type="email" 
                placeholder="Masukkan email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-sm p-3 rounded-lg border border-slate-200 outline-none focus:border-primary transition-colors bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nomor Telepon</label>
              <input 
                type="tel" 
                placeholder="Masukkan nomor telepon" 
                value={telepon}
                onChange={e => setTelepon(e.target.value)}
                className="w-full text-sm p-3 rounded-lg border border-slate-200 outline-none focus:border-primary transition-colors bg-slate-50 focus:bg-white"
              />
            </div>
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
