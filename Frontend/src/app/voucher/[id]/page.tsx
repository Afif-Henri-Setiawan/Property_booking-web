import { Badge } from "@/components/ui/badge";
import { QrCode, MapPin, Calendar, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VoucherPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-forest-900">Your E-Voucher</h1>
          <Button variant="outline" className="bg-white text-primary border-primary">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>

        {/* Ticket Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row relative">
          
          {/* Main Info */}
          <div className="p-8 flex-1 border-b md:border-b-0 md:border-r border-dashed border-slate-300 relative">
            <div className="absolute top-0 right-0 p-6">
              <Badge className="bg-status-published text-white px-3 py-1 rounded-full text-xs">CONFIRMED</Badge>
            </div>
            
            <p className="text-sm font-bold text-primary tracking-widest uppercase mb-2">StayNest Premium</p>
            <h2 className="text-3xl font-bold text-forest-900 mb-6">Modern Villa Bali</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Check In</p>
                <p className="font-bold text-forest-900">12 Oct 2026</p>
                <p className="text-sm text-slate-500">14:00 PM</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Check Out</p>
                <p className="font-bold text-forest-900">15 Oct 2026</p>
                <p className="text-sm text-slate-500">11:00 AM</p>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center gap-3">
                <MapPin className="text-slate-400 h-5 w-5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Location</p>
                  <p className="font-medium text-forest-900 text-sm">Jl. Monkey Forest, Ubud, Bali</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-slate-400 h-5 w-5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase">Guests</p>
                  <p className="font-medium text-forest-900 text-sm">2 Adults</p>
                </div>
              </div>
            </div>

            {/* Cutout curves */}
            <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full" />
            <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full" />
          </div>

          {/* QR Code Section */}
          <div className="p-8 bg-surface-container-lowest flex flex-col items-center justify-center md:w-64">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-4 text-center">Scan at check-in</p>
            <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
              <QrCode className="w-32 h-32 text-forest-900" />
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase mb-1">Booking ID</p>
              <p className="font-mono font-bold text-forest-900 text-lg tracking-widest">SN-8294B</p>
            </div>
          </div>
          
        </div>
        <p className="text-center text-sm text-slate-400 mt-6">Present this voucher upon arrival. Valid ID may be required.</p>
      </div>
    </div>
  );
}
