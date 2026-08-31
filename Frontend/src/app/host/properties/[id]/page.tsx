"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Building, Users, BedDouble, Key, Trash2, Edit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 flex items-center justify-center animate-pulse text-slate-500">Memuat Peta...</div>
});

export default function PropertyManagementPage() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"INFO" | "KAMAR" | "STAF">("INFO");
  const [property, setProperty] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [allFasilitas, setAllFasilitas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Staf Form
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  // Dynamic Facility Form
  const [newFacilityName, setNewFacilityName] = useState("");
  const [isAddingFacility, setIsAddingFacility] = useState(false);

  // Property Form Data
  const [isEditPropertyOpen, setIsEditPropertyOpen] = useState(false);
  const [propertyFormData, setPropertyFormData] = useState({
    nama: "",
    deskripsi: "",
    alamat: "",
    kota: "",
    provinsi: "",
    garisLintang: 0,
    garisBujur: 0,
    fasilitasIds: [] as string[]
  });

  // Tipe Kamar Form
  const [isAddTipeKamarOpen, setIsAddTipeKamarOpen] = useState(false);
  const [isEditTipeKamarOpen, setIsEditTipeKamarOpen] = useState(false);
  const [selectedTipeKamar, setSelectedTipeKamar] = useState<any>(null);
  
  const [tkFormData, setTkFormData] = useState({
    nama: "", deskripsi: "", hargaDasar: 0, maksDewasa: 2, maksAnak: 0, maksTamu: 2, fasilitasIds: [] as string[]
  });
  
  // Unit Kamar Form
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [selectedTkIdForUnit, setSelectedTkIdForUnit] = useState("");
  const [unitFormData, setUnitFormData] = useState({ nomorUnit: "", lantai: "" });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      
      // Fetch facilities
      const facRes = await fetch(`http://localhost:5000/api/v1/fasilitas`);
      const facData = await facRes.json();
      if (facData.status === "success") {
        setAllFasilitas(facData.data);
      }

      // Fetch property details
      const propRes = await fetch(`http://localhost:5000/api/v1/properti/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const propData = await propRes.json();
      if (propData.status === "success") {
        setProperty(propData.data);
      }

      // Fetch staff
      const staffRes = await fetch(`http://localhost:5000/api/v1/properti/${id}/staff`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const staffData = await staffRes.json();
      if (staffData.status === "success") {
        setStaff(staffData.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- PROPERTY ACTIONS ---
  const openEditProperty = () => {
    setPropertyFormData({
      nama: property.nama,
      deskripsi: property.deskripsi,
      alamat: property.alamat,
      kota: property.kota,
      provinsi: property.provinsi,
      garisLintang: property.garisLintang || 0,
      garisBujur: property.garisBujur || 0,
      fasilitasIds: property.fasilitas ? property.fasilitas.map((f: any) => f.fasilitasId) : []
    });
    setIsEditPropertyOpen(true);
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/properti/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(propertyFormData)
      });
      
      if (res.ok) {
        setIsEditPropertyOpen(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menyimpan info properti");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan");
    }
  };

  const handlePropertyFasilitasToggle = (fasilitasId: string) => {
    setPropertyFormData(prev => {
      const current = prev.fasilitasIds;
      if (current.includes(fasilitasId)) {
        return { ...prev, fasilitasIds: current.filter(id => id !== fasilitasId) };
      } else {
        return { ...prev, fasilitasIds: [...current, fasilitasId] };
      }
    });
  };

  // --- DYNAMIC FACILITY & GEOCODING ---
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleGeocode = async () => {
    if (!propertyFormData.kota && !propertyFormData.provinsi) {
      alert("Isi kota atau provinsi terlebih dahulu!");
      return;
    }
    setIsGeocoding(true);
    try {
      const query = `${propertyFormData.kota || ''} ${propertyFormData.provinsi || ''}`.trim();
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        setPropertyFormData(p => ({
          ...p,
          garisLintang: parseFloat(data[0].lat),
          garisBujur: parseFloat(data[0].lon)
        }));
      } else {
        alert("Lokasi tidak ditemukan berdasarkan kota/provinsi. Silakan geser pin secara manual.");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mencari lokasi ke server peta.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleAddFacility = async () => {
    if (!newFacilityName.trim()) return;
    setIsAddingFacility(true);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/fasilitas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nama: newFacilityName })
      });
      const data = await res.json();
      if (res.ok) {
        setAllFasilitas([...allFasilitas, data.data]);
        setNewFacilityName("");
        
        // Auto select it
        if (isEditPropertyOpen) {
          setPropertyFormData(p => ({ ...p, fasilitasIds: [...p.fasilitasIds, data.data.id] }));
        } else if (isAddTipeKamarOpen || isEditTipeKamarOpen) {
          setTkFormData(p => ({ ...p, fasilitasIds: [...p.fasilitasIds, data.data.id] }));
        }
      } else {
        alert(data.message || "Gagal menambah fasilitas");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsAddingFacility(false);
    }
  };

  // --- STAFF ACTIONS ---
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingStaff(true);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/properti/${id}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: newStaffEmail, staffRole: "RECEPTIONIST" })
      });
      const result = await res.json();
      if (res.ok) {
        setNewStaffEmail("");
        alert("Resepsionis berhasil ditambahkan!");
        fetchData();
      } else {
        alert(result.message || "Gagal menambah staf");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsAddingStaff(false);
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    if (!confirm("Hapus staf ini?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/properti/${id}/staff/${staffId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menghapus staf");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  // --- TIPE KAMAR ACTIONS ---
  const handleSaveTipeKamar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const url = selectedTipeKamar 
        ? `http://localhost:5000/api/v1/tipekamar/${selectedTipeKamar.id}`
        : "http://localhost:5000/api/v1/tipekamar";
      
      const method = selectedTipeKamar ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...tkFormData, propertiId: id })
      });
      
      if (res.ok) {
        setIsAddTipeKamarOpen(false);
        setIsEditTipeKamarOpen(false);
        setSelectedTipeKamar(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menyimpan tipe kamar");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan");
    }
  };

  const handleDeleteTipeKamar = async (tkId: string) => {
    if (!confirm("Yakin ingin menghapus tipe kamar ini? Sistem akan menolak jika ada riwayat pesanan aktif.")) return;
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/tipekamar/${tkId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
      else alert("Gagal menghapus tipe kamar (kemungkinan masih ada pesanan terhubung).");
    } catch (error) {
      alert("Terjadi kesalahan jaringan");
    }
  };

  const openEditTipeKamar = (tk: any) => {
    setSelectedTipeKamar(tk);
    setTkFormData({
      nama: tk.nama,
      deskripsi: tk.deskripsi || "",
      hargaDasar: Number(tk.hargaDasar),
      maksDewasa: tk.maksDewasa,
      maksAnak: tk.maksAnak,
      maksTamu: tk.maksTamu,
      fasilitasIds: tk.fasilitas ? tk.fasilitas.map((f: any) => f.fasilitasId) : []
    });
    setIsEditTipeKamarOpen(true);
  };

  const openAddTipeKamar = () => {
    setSelectedTipeKamar(null);
    setTkFormData({ nama: "", deskripsi: "", hargaDasar: 0, maksDewasa: 2, maksAnak: 0, maksTamu: 2, fasilitasIds: [] });
    setIsAddTipeKamarOpen(true);
  };

  const handleTkFasilitasToggle = (fasilitasId: string) => {
    setTkFormData(prev => {
      const current = prev.fasilitasIds;
      if (current.includes(fasilitasId)) {
        return { ...prev, fasilitasIds: current.filter(id => id !== fasilitasId) };
      } else {
        return { ...prev, fasilitasIds: [...current, fasilitasId] };
      }
    });
  };

  // --- UNIT KAMAR ACTIONS ---
  const handleSaveUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/unit-kamar", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...unitFormData, tipeKamarId: selectedTkIdForUnit })
      });
      if (res.ok) {
        setIsAddUnitOpen(false);
        setUnitFormData({ nomorUnit: "", lantai: "" });
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menambah unit ruangan");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan");
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (!confirm("Yakin ingin menghapus ruangan ini?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/unit-kamar/${unitId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
      else alert("Gagal menghapus ruangan");
    } catch (error) {
      alert("Terjadi kesalahan jaringan");
    }
  };

  const openAddUnit = (tkId: string) => {
    setSelectedTkIdForUnit(tkId);
    setUnitFormData({ nomorUnit: "", lantai: "" });
    setIsAddUnitOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-forest-600" />
      </div>
    );
  }

  if (!property) return <div>Properti tidak ditemukan.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/host/dashboard")}>
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{property.nama}</h1>
          <p className="text-slate-500">{property.kota}, {property.provinsi}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("INFO")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "INFO" ? "border-forest-600 text-forest-700" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
        >
          <div className="flex items-center gap-2"><Building size={16} /> Info Properti</div>
        </button>
        <button
          onClick={() => setActiveTab("KAMAR")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "KAMAR" ? "border-forest-600 text-forest-700" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
        >
          <div className="flex items-center gap-2"><BedDouble size={16} /> Tipe Kamar & Unit</div>
        </button>
        <button
          onClick={() => setActiveTab("STAF")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "STAF" ? "border-forest-600 text-forest-700" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
        >
          <div className="flex items-center gap-2"><Users size={16} /> Manajemen Staf</div>
        </button>
      </div>

      {/* Content */}
      <div className="pt-4">
        {activeTab === "INFO" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Informasi Dasar</CardTitle>
              <Button variant="outline" size="sm" onClick={openEditProperty}>
                <Edit size={14} className="mr-2" /> Edit Info
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-sm text-slate-500 font-medium">Alamat Lengkap</span>
                  <p className="text-slate-900 mt-1">{property.alamat}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 font-medium">Kota & Provinsi</span>
                  <p className="text-slate-900 mt-1">{property.kota}, {property.provinsi}</p>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-slate-500 font-medium">Titik Koordinat (Peta)</span>
                {property.garisLintang && property.garisBujur ? (
                  <p className="text-slate-900 mt-1 font-mono text-sm">Lat: {property.garisLintang}, Lng: {property.garisBujur}</p>
                ) : (
                  <p className="text-slate-400 mt-1 italic text-sm">Belum diatur</p>
                )}
                {property.garisLintang && property.garisBujur && (
                  <div className="mt-2 h-48 rounded-md overflow-hidden opacity-80 border border-slate-200 pointer-events-none grayscale">
                    <MapPicker position={{ lat: property.garisLintang, lng: property.garisBujur }} onChange={() => {}} />
                  </div>
                )}
              </div>

              <div>
                <span className="text-sm text-slate-500 font-medium">Deskripsi</span>
                <p className="text-slate-900 mt-1 whitespace-pre-wrap">{property.deskripsi}</p>
              </div>

              <div>
                <span className="text-sm text-slate-500 font-medium">Fasilitas Properti</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {property.fasilitas?.length > 0 ? property.fasilitas.map((f: any) => (
                    <span key={f.fasilitasId} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs border border-slate-200">
                      {f.fasilitas.nama}
                    </span>
                  )) : (
                    <p className="text-slate-400 italic text-sm">Belum ada fasilitas yang dipilih</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "KAMAR" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Daftar Tipe Kamar</h3>
              <Button onClick={openAddTipeKamar} className="bg-forest-600 hover:bg-forest-700 gap-2">
                <Plus size={16} /> Tambah Tipe Kamar
              </Button>
            </div>
            
            {property.tipeKamar?.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-500">Belum ada tipe kamar. Silakan tambahkan tipe kamar pertama Anda.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {property.tipeKamar?.map((tk: any) => (
                  <Card key={tk.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{tk.nama}</CardTitle>
                          <p className="text-sm text-slate-500 mt-1">Rp {Number(tk.hargaDasar || 0).toLocaleString("id-ID")}/malam</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditTipeKamar(tk)}><Edit size={14} className="mr-2" /> Edit</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTipeKamar(tk.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-xs text-slate-500 font-medium">Fasilitas Kamar:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tk.fasilitas?.length > 0 ? tk.fasilitas.map((f: any) => (
                            <span key={f.fasilitasId} className="px-1.5 py-0.5 bg-forest-50 text-forest-700 rounded text-[10px] border border-forest-100">
                              {f.fasilitas?.nama || "Fasilitas"}
                            </span>
                          )) : (
                            <span className="text-xs text-slate-400 italic">Tidak ada</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Key size={14} className="text-slate-400" /> Unit Ruangan ({tk.totalUnit})
                          </h4>
                          <Button variant="ghost" size="sm" onClick={() => openAddUnit(tk.id)} className="h-8 text-xs text-primary">
                            <Plus size={12} className="mr-1" /> Tambah Unit
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tk.unit?.length > 0 ? tk.unit.map((u: any) => (
                            <div key={u.id} className="group relative flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                              <span className="text-sm font-mono font-medium">{u.nomorUnit}</span>
                              <button onClick={() => handleDeleteUnit(u.id)} className="ml-1 text-slate-400 hover:text-red-500 hidden group-hover:block transition-colors">
                                &times;
                              </button>
                            </div>
                          )) : (
                            <span className="text-xs text-slate-500 italic">Belum ada ruangan yang didaftarkan pada tipe ini.</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "STAF" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Undang Resepsionis</CardTitle>
                <p className="text-sm text-slate-500">Tambahkan akun staf yang sudah terdaftar di StayNest ke properti ini.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddStaff} className="flex gap-4">
                  <Input 
                    type="email" 
                    placeholder="Alamat email karyawan (juki@example.com)" 
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    required
                    className="max-w-md"
                  />
                  <Button type="submit" disabled={isAddingStaff} className="bg-forest-600 hover:bg-forest-700">
                    {isAddingStaff ? <Loader2 className="animate-spin w-4 h-4" /> : "Tambahkan"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daftar Staf Properti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-slate-100">
                  {staff.map((s) => (
                    <div key={s.id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-900">{s.pengguna.nama}</p>
                        <p className="text-sm text-slate-500">{s.pengguna.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.staffRole === "MANAGER" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                          {s.staffRole}
                        </span>
                        {s.staffRole !== "MANAGER" && (
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveStaff(s.pengguna.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {staff.length === 0 && (
                    <p className="text-slate-500 text-center py-4">Belum ada staf yang terdaftar.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      
      {/* Edit Property Modal */}
      <Dialog open={isEditPropertyOpen} onOpenChange={setIsEditPropertyOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSaveProperty}>
            <DialogHeader>
              <DialogTitle>Edit Informasi Properti</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="prop_nama">Nama Properti</Label>
                <Input id="prop_nama" value={propertyFormData.nama} onChange={e => setPropertyFormData({...propertyFormData, nama: e.target.value})} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prop_deskripsi">Deskripsi</Label>
                <Textarea id="prop_deskripsi" value={propertyFormData.deskripsi} onChange={e => setPropertyFormData({...propertyFormData, deskripsi: e.target.value})} rows={4} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prop_alamat">Alamat Lengkap</Label>
                <Input id="prop_alamat" value={propertyFormData.alamat} onChange={e => setPropertyFormData({...propertyFormData, alamat: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="prop_kota">Kota</Label>
                  <Input id="prop_kota" value={propertyFormData.kota} onChange={e => setPropertyFormData({...propertyFormData, kota: e.target.value})} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prop_provinsi">Provinsi</Label>
                  <Input id="prop_provinsi" value={propertyFormData.provinsi} onChange={e => setPropertyFormData({...propertyFormData, provinsi: e.target.value})} required />
                </div>
              </div>

              {/* Map Component */}
              <div className="grid gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <Label>Pilih Titik Lokasi Peta (Geser Pin/Klik Peta)</Label>
                  <Button type="button" size="sm" variant="secondary" onClick={handleGeocode} disabled={isGeocoding} className="h-8">
                    {isGeocoding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                    Cari Kota/Provinsi di Peta
                  </Button>
                </div>
                <MapPicker 
                  position={{ lat: propertyFormData.garisLintang, lng: propertyFormData.garisBujur }}
                  onChange={pos => setPropertyFormData({...propertyFormData, garisLintang: pos.lat, garisBujur: pos.lng})}
                />
                <div className="text-xs text-slate-500 font-mono">
                  Terpilih: {propertyFormData.garisLintang.toFixed(6)}, {propertyFormData.garisBujur.toFixed(6)}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <Label className="mb-2 block text-base font-semibold">Fasilitas Properti (Umum)</Label>
                
                {/* Dynamic Facility Addition */}
                <div className="flex gap-2 mb-4 items-end bg-slate-50 p-3 rounded-md border border-slate-200">
                  <div className="flex-1 grid gap-1">
                    <Label htmlFor="new_facility" className="text-xs">Fasilitas belum ada? Tambah baru:</Label>
                    <Input 
                      id="new_facility"
                      placeholder="Misal: Area BBQ" 
                      value={newFacilityName} 
                      onChange={e => setNewFacilityName(e.target.value)} 
                      className="h-8 text-sm"
                    />
                  </div>
                  <Button type="button" size="sm" onClick={handleAddFacility} disabled={isAddingFacility || !newFacilityName.trim()} variant="secondary">
                    {isAddingFacility ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus size={14} className="mr-1"/> Tambah</>}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2 max-h-[200px] overflow-y-auto p-1">
                  {allFasilitas.map(f => (
                    <div key={f.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`prop_fac_${f.id}`} 
                        checked={propertyFormData.fasilitasIds.includes(f.id)}
                        onCheckedChange={() => handlePropertyFasilitasToggle(f.id)}
                      />
                      <label htmlFor={`prop_fac_${f.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                        {f.nama}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditPropertyOpen(false)}>Batal</Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Tipe Kamar Modal */}
      <Dialog open={isAddTipeKamarOpen || isEditTipeKamarOpen} onOpenChange={(open) => {
        if (!open) { setIsAddTipeKamarOpen(false); setIsEditTipeKamarOpen(false); }
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSaveTipeKamar}>
            <DialogHeader>
              <DialogTitle>{isEditTipeKamarOpen ? "Edit Tipe Kamar" : "Tambah Tipe Kamar Baru"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nama">Nama Tipe Kamar</Label>
                <Input id="nama" value={tkFormData.nama} onChange={e => setTkFormData({...tkFormData, nama: e.target.value})} placeholder="Standard Room" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea id="deskripsi" value={tkFormData.deskripsi} onChange={e => setTkFormData({...tkFormData, deskripsi: e.target.value})} placeholder="Deskripsi ruangan..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hargaDasar">Harga Dasar (Rp)</Label>
                  <Input id="hargaDasar" type="number" min="0" value={tkFormData.hargaDasar} onChange={e => setTkFormData({...tkFormData, hargaDasar: parseInt(e.target.value) || 0})} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maksTamu">Maksimal Tamu Total</Label>
                  <Input id="maksTamu" type="number" min="1" value={tkFormData.maksTamu} onChange={e => setTkFormData({...tkFormData, maksTamu: parseInt(e.target.value) || 1})} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="maksDewasa">Maksimal Dewasa</Label>
                  <Input id="maksDewasa" type="number" min="1" value={tkFormData.maksDewasa} onChange={e => setTkFormData({...tkFormData, maksDewasa: parseInt(e.target.value) || 1})} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maksAnak">Maksimal Anak</Label>
                  <Input id="maksAnak" type="number" min="0" value={tkFormData.maksAnak} onChange={e => setTkFormData({...tkFormData, maksAnak: parseInt(e.target.value) || 0})} required />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <Label className="mb-2 block text-base font-semibold">Fasilitas Dalam Kamar</Label>
                
                {/* Dynamic Facility Addition */}
                <div className="flex gap-2 mb-4 items-end bg-slate-50 p-3 rounded-md border border-slate-200">
                  <div className="flex-1 grid gap-1">
                    <Label htmlFor="new_tk_facility" className="text-xs">Fasilitas belum ada? Tambah baru:</Label>
                    <Input 
                      id="new_tk_facility"
                      placeholder="Misal: Netflix" 
                      value={newFacilityName} 
                      onChange={e => setNewFacilityName(e.target.value)} 
                      className="h-8 text-sm"
                    />
                  </div>
                  <Button type="button" size="sm" onClick={handleAddFacility} disabled={isAddingFacility || !newFacilityName.trim()} variant="secondary">
                    {isAddingFacility ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus size={14} className="mr-1"/> Tambah</>}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2 max-h-[200px] overflow-y-auto p-1">
                  {allFasilitas.map(f => (
                    <div key={f.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`tk_fac_${f.id}`} 
                        checked={tkFormData.fasilitasIds.includes(f.id)}
                        onCheckedChange={() => handleTkFasilitasToggle(f.id)}
                      />
                      <label htmlFor={`tk_fac_${f.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                        {f.nama}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => { setIsAddTipeKamarOpen(false); setIsEditTipeKamarOpen(false); }}>Batal</Button>
              <Button type="submit">Simpan Kamar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Unit Kamar Modal */}
      <Dialog open={isAddUnitOpen} onOpenChange={setIsAddUnitOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <form onSubmit={handleSaveUnit}>
            <DialogHeader>
              <DialogTitle>Tambah Unit Ruangan</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nomorUnit">Nomor Ruangan (Misal: A-101)</Label>
                <Input id="nomorUnit" value={unitFormData.nomorUnit} onChange={e => setUnitFormData({...unitFormData, nomorUnit: e.target.value})} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lantai">Lantai (Opsional)</Label>
                <Input id="lantai" value={unitFormData.lantai} onChange={e => setUnitFormData({...unitFormData, lantai: e.target.value})} placeholder="Lantai 1" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddUnitOpen(false)}>Batal</Button>
              <Button type="submit">Simpan Unit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
