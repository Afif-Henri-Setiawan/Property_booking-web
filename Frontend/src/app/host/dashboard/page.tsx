import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Users, DollarSign, Percent } from "lucide-react";

const KPI_DATA = [
  { title: "Total Properties", value: "12", icon: Home, trend: "+2 this month" },
  { title: "Total Bookings", value: "148", icon: Users, trend: "+12% this month" },
  { title: "Revenue", value: "$24,500", icon: DollarSign, trend: "+8% this month" },
  { title: "Occupancy Rate", value: "78%", icon: Percent, trend: "+4% this month" },
];

const MOCK_PROPERTIES = [
  { id: 1, name: "Modern Villa Bali", status: "Published", price: "$250/night", bookings: 24 },
  { id: 2, name: "Urban Loft Jakarta", status: "Published", price: "$120/night", bookings: 45 },
  { id: 3, name: "Beachfront Cabin", status: "Pending", price: "$180/night", bookings: 0 },
];

export default function HostDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-forest-900 mb-2">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Here's what's happening with your properties.</p>
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
            <CardTitle className="text-xl text-forest-900">Managed Properties</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Recent status of your property listings.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white">Add Property</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PROPERTIES.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={property.status === "Published" ? "default" : "secondary"} 
                      className={property.status === "Published" ? "bg-status-published hover:bg-status-published" : "bg-status-pending text-white hover:bg-status-pending"}
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
