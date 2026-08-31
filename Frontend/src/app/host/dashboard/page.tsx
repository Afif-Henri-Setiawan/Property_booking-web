"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Users, DollarSign, Percent, Loader2 } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  totalProperties: number;
  totalBookings: number;
  revenue: number;
  occupancyRate: string;
  properties: {
    id: string;
    name: string;
    status: string;
    price: string;
    bookings: number;
    revenue: number;
  }[];
}

export default function HostDashboardPage() {
  const { getToken } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("ALL");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/properti/host/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      
      if (result.status === "success") {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-forest-600" />
      </div>
    );
  }

  // Calculate dynamic KPIs based on filter
  let displayTotalProperties = data?.totalProperties || 0;
  let displayTotalBookings = data?.totalBookings || 0;
  let displayRevenue = data?.revenue || 0;

  if (data && selectedPropertyId !== "ALL") {
    const selectedProp = data.properties.find(p => p.id === selectedPropertyId);
    if (selectedProp) {
      displayTotalProperties = 1;
      displayTotalBookings = selectedProp.bookings;
      displayRevenue = selectedProp.revenue;
    }
  }

  const kpiData = data ? [
    { title: "Total Properti", value: displayTotalProperties.toString(), icon: Home, trend: selectedPropertyId === "ALL" ? "Dikelola" : "Terpilih" },
    { title: "Total Pesanan", value: displayTotalBookings.toString(), icon: Users, trend: "Semua Waktu" },
    { title: "Pendapatan", value: `Rp ${displayRevenue.toLocaleString('id-ID')}`, icon: DollarSign, trend: "Kotor (Bruto)" },
    { title: "Tingkat Hunian", value: data.occupancyRate, icon: Percent, trend: "Estimasi Sementara" },
  ] : [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-900 mb-2">Ringkasan Dashboard (Manager)</h1>
          <p className="text-slate-500">Selamat datang kembali! Berikut adalah ringkasan finansial dan operasional dari properti Anda.</p>
        </div>
        {data && data.properties && data.properties.length > 0 && (
          <div className="min-w-[200px]">
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="ALL">Semua Properti</option>
              {data.properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, i) => (
          <Card key={i} className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-forest-900">{kpi.value}</div>
              <p className="text-xs text-slate-400 mt-1">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-forest-900">Properti yang Dikelola</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Status terbaru dari daftar properti Anda.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white">Tambah Properti</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Properti</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Harga Dasar/Malam</TableHead>
                <TableHead>Pesanan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.properties?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">Belum ada properti yang dikelola.</TableCell>
                </TableRow>
              ) : (
                data?.properties?.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={property.status === "Dipublikasikan" ? "default" : "secondary"} 
                        className={property.status === "Dipublikasikan" ? "bg-status-published hover:bg-status-published" : "bg-status-pending text-white hover:bg-status-pending"}
                      >
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{property.price}</TableCell>
                    <TableCell>{property.bookings}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/host/properties/${property.id}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 text-primary hover:bg-primary/10">
                        Kelola
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
