"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AdminPropertiesPage() {
  const { getToken } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/properti/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.status === "success") {
        setProperties(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch pending properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (id: string, status: 'DITERBITKAN' | 'DITOLAK') => {
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/properti/${id}/verifikasi`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      
      const result = await res.json();
      if (result.status === "success") {
        // Remove from list
        setProperties(properties.filter(p => p.id !== id));
        alert(`Properti berhasil ${status === 'DITERBITKAN' ? 'disetujui' : 'ditolak'}`);
      } else {
        alert(result.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error("Failed to verify property:", error);
      alert('Terjadi kesalahan sistem');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Persetujuan Properti</h1>
        <p className="text-slate-500 mt-1">Review dan setujui properti baru yang didaftarkan oleh Host.</p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Nama Properti</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Tanggal Daftar</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Tidak ada properti yang menunggu persetujuan.
                </TableCell>
              </TableRow>
            ) : (
              properties.map((prop) => (
                <TableRow key={prop.id}>
                  <TableCell className="font-medium">{prop.nama}</TableCell>
                  <TableCell>
                    {prop.tuanRumah?.nama}<br/>
                    <span className="text-xs text-slate-500">{prop.tuanRumah?.email}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-100">{prop.tipe?.nama}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(prop.dibuatPada).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleVerify(prop.id, 'DITOLAK')}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Tolak
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleVerify(prop.id, 'DITERBITKAN')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Setujui
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
