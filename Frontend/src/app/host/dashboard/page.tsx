import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Users, DollarSign, Percent } from "lucide-react";

const KPI_DATA = [
  { title: "Total Properti", value: "12", icon: Home, trend: "+2 bulan ini" },
  { title: "Total Pesanan", value: "148", icon: Users, trend: "+12% bulan ini" },
  { title: "Pendapatan", value: "$24,500", icon: DollarSign, trend: "+8% bulan ini" },
  { title: "Tingkat Hunian", value: "78%", icon: Percent, trend: "+4% bulan ini" },
];

const MOCK_PROPERTIES = [
  { id: 1, name: "Modern Villa Bali", status: "Dipublikasikan", price: "$250/malam", bookings: 24 },
  { id: 2, name: "Urban Loft Jakarta", status: "Dipublikasikan", price: "$120/malam", bookings: 45 },
  { id: 3, name: "Beachfront Cabin", status: "Tertunda", price: "$180/malam", bookings: 0 },
];

export default function HostDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-forest-900 mb-2">Ringkasan Dashboard</h1>
        <p className="text-slate-500">Selamat datang kembali! Berikut adalah perkembangan properti Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_DATA.map((kpi, i) => (
          <Card key={i} className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-forest-900 font-mono">{kpi.value}</div>
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
                <TableHead>Harga/Malam</TableHead>
                <TableHead>Pesanan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PROPERTIES.map((property) => (
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
                  <TableCell className="font-mono">{property.price}</TableCell>
                  <TableCell>{property.bookings}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/10">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
