import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet, Building2, Check, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-surface p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Order Summary */}
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-forest-900">Tinjau Pesanan Anda</h1>
            <p className="text-slate-500 mt-2">Sedikit lagi! Silakan tinjau detail Anda sebelum pembayaran.</p>
          </div>

          <Card className="border-slate-200 overflow-hidden shadow-sm">
            <div className="h-48 relative bg-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Property" 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-forest-900 mb-1">Modern Villa Bali</h2>
              <p className="text-slate-500 text-sm mb-4">Ubud, Bali, Indonesia</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-slate-500 font-medium">Check-in</p>
                  <p className="font-bold text-forest-900">12 Oct 2026</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Check-out</p>
                  <p className="font-bold text-forest-900">15 Oct 2026</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Tamu</p>
                  <p className="font-bold text-forest-900">2 Dewasa</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">$250 x 3 malam</span>
                  <span className="font-medium">$750.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Biaya Layanan</span>
                  <span className="font-medium">$50.00</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-bold text-forest-900 text-base">Total</span>
                  <span className="font-bold text-forest-900 text-xl font-mono">$800.00</span>
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
                <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">Midtrans</span>
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

                <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-primary/50 text-left transition-all">
                  <div className="p-2 bg-slate-50 rounded">
                    <Building2 className="text-slate-500 h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-forest-900">Transfer Bank</p>
                    <p className="text-xs text-slate-500">BCA, Mandiri, BNI</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-primary/50 text-left transition-all">
                  <div className="p-2 bg-slate-50 rounded">
                    <Wallet className="text-slate-500 h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-forest-900">E-Wallet</p>
                    <p className="text-xs text-slate-500">GoPay, ShopeePay</p>
                  </div>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t">
                <Button className="w-full py-6 text-lg rounded-xl bg-primary hover:bg-primary-container text-white font-bold shadow-lg shadow-primary/20">
                  Bayar $800.00
                </Button>
                <p className="text-center text-xs text-slate-400 mt-4">Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
