"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Shield, UserCog } from "lucide-react";

export default function HostSettingsPage() {
  const { getToken } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  
  const [staffs, setStaffs] = useState<any[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("RECEPTIONIST");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  useEffect(() => {
    if (selectedPropertyId) {
      fetchStaff(selectedPropertyId);
    }
  }, [selectedPropertyId]);

  const fetchMyProperties = async () => {
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/properti/host/my-properties", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.status === "success" && result.data.length > 0) {
        setProperties(result.data);
        setSelectedPropertyId(result.data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  const fetchStaff = async (propId: string) => {
    setIsLoadingStaff(true);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/properti/${propId}/staff`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.status === "success") {
        setStaffs(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail || !selectedPropertyId) return;
    
    setIsAdding(true);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/properti/${selectedPropertyId}/staff`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ email: newStaffEmail, staffRole: newStaffRole })
      });
      const result = await res.json();
      
      if (result.status === "success") {
        alert("Staf berhasil ditambahkan!");
        setNewStaffEmail("");
        fetchStaff(selectedPropertyId);
      } else {
        alert(result.message || "Gagal menambahkan staf");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus staf ini?")) return;
    
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/properti/${selectedPropertyId}/staff/${staffId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      
      if (result.status === "success") {
        alert("Staf berhasil dihapus!");
        setStaffs(staffs.filter(s => s.id !== staffId));
      } else {
        alert(result.message || "Gagal menghapus staf");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-forest-900 mb-2">Pengaturan Properti</h1>
        <p className="text-slate-500">Kelola akses dan staf (resepsionis/manajer) untuk properti Anda.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manajemen Staf</CardTitle>
          <CardDescription>Tambahkan pengguna lain sebagai staf untuk mengelola pesanan properti ini.</CardDescription>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <p className="text-sm text-slate-500">Anda belum memiliki properti.</p>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Pilih Properti</label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="p-2 border rounded-md max-w-md bg-slate-50 outline-none focus:ring-2 focus:ring-primary"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <UserCog size={18} /> Tambah Staf Baru
                </h3>
                <form onSubmit={handleAddStaff} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Alamat Email Pengguna..." 
                    className="flex-1 p-2 border rounded-md"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    required
                  />
                  <select 
                    className="p-2 border rounded-md bg-white"
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                  >
                    <option value="RECEPTIONIST">Receptionist</option>
                    <option value="MANAGER">Manager</option>
                  </select>
                  <Button type="submit" disabled={isAdding} className="bg-forest-600 hover:bg-forest-700">
                    {isAdding ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Tambah Staf
                  </Button>
                </form>
                <p className="text-xs text-slate-500 mt-2">
                  Pengguna harus sudah mendaftar di StayNest sebelum dapat ditambahkan sebagai staf.
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100">
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingStaff ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-400" />
                        </TableCell>
                      </TableRow>
                    ) : staffs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                          Belum ada staf untuk properti ini.
                        </TableCell>
                      </TableRow>
                    ) : (
                      staffs.map(staff => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium text-slate-900">{staff.pengguna.nama}</TableCell>
                          <TableCell className="text-slate-600">{staff.pengguna.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={staff.staffRole === 'MANAGER' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}>
                              {staff.staffRole === 'MANAGER' ? <Shield size={12} className="mr-1" /> : null}
                              {staff.staffRole}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveStaff(staff.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
