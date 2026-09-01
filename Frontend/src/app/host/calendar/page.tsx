"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import AvailabilityCalendar from "@/components/host/AvailabilityCalendar";

interface TipeKamar {
  id: string;
  nama: string;
  totalUnit: number;
}

interface Properti {
  id: string;
  nama: string;
  tipeKamar: TipeKamar[];
}

export default function HostCalendarPage() {
  const { getToken } = useAuth();
  const [properties, setProperties] = useState<Properti[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [selectedTipeKamar, setSelectedTipeKamar] = useState<TipeKamar | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properti/host/my-properties`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      
      if (result.status === "success") {
        setProperties(result.data);
        if (result.data.length > 0) {
          setSelectedPropertyId(result.data[0].id);
          if (result.data[0].tipeKamar && result.data[0].tipeKamar.length > 0) {
            setSelectedTipeKamar(result.data[0].tipeKamar[0]);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kalender Ketersediaan</h1>
          <p className="text-slate-500 mt-2">
            Kelola ketersediaan kamar, lihat jadwal pesanan, dan blokir tanggal secara manual.
          </p>
        </div>
      </div>

      <Card className="border-slate-200">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Anda belum memiliki properti.
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Pilih Properti</label>
                <Select
                  value={selectedPropertyId}
                  onValueChange={(val) => {
                    setSelectedPropertyId(val);
                    const prop = properties.find(p => p.id === val);
                    if (prop && prop.tipeKamar && prop.tipeKamar.length > 0) {
                      setSelectedTipeKamar(prop.tipeKamar[0]);
                    } else {
                      setSelectedTipeKamar(null);
                    }
                  }}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Pilih Properti">
                      {selectedProperty ? selectedProperty.nama : ""}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Pilih Tipe Kamar</label>
                <Select
                  value={selectedTipeKamar?.id || ""}
                  onValueChange={(val) => {
                    if (selectedProperty) {
                      const tk = selectedProperty.tipeKamar.find(t => t.id === val);
                      setSelectedTipeKamar(tk || null);
                    }
                  }}
                  disabled={!selectedProperty || !selectedProperty.tipeKamar || selectedProperty.tipeKamar.length === 0}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Pilih Tipe Kamar">
                      {selectedTipeKamar ? `${selectedTipeKamar.nama} (${selectedTipeKamar.totalUnit} Unit)` : ""}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProperty?.tipeKamar?.map((tk) => (
                      <SelectItem key={tk.id} value={tk.id}>
                        {tk.nama} ({tk.totalUnit} Unit)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedTipeKamar ? (
            <AvailabilityCalendar 
              tipeKamarId={selectedTipeKamar.id} 
              totalUnit={selectedTipeKamar.totalUnit} 
            />
          ) : !isLoading && properties.length > 0 && (
            <div className="text-center py-10 text-slate-500 border rounded-lg bg-slate-50">
              Properti ini belum memiliki tipe kamar. Tambahkan tipe kamar terlebih dahulu.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
