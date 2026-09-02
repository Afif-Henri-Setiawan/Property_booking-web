"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert, ShieldCheck, UserCog } from "lucide-react";

export default function AdminUsersPage() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.status === "success") {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    if (!confirm(`Apakah Anda yakin ingin mengubah role pengguna ini menjadi ${newRole}?`)) return;
    
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      
      const result = await res.json();
      if (result.status === "success") {
        // Update user list
        setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
        alert('Role berhasil diubah!');
      } else {
        alert(result.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error("Failed to change user role:", error);
      alert('Terjadi kesalahan sistem');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'HOST': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
        <p className="text-slate-500 mt-1">Kelola role (peran) dan akses pengguna dalam platform.</p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role Saat Ini</TableHead>
              <TableHead>Tanggal Bergabung</TableHead>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Tidak ada pengguna yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-slate-900">{user.nama}</TableCell>
                  <TableCell className="text-slate-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-semibold ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(user.dibuatPada).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {user.role !== 'HOST' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleRoleChange(user.id, 'HOST')}
                        >
                          <ShieldCheck className="w-4 h-4 mr-1" /> Jadikan Host
                        </Button>
                      )}
                      {user.role !== 'GUEST' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                          onClick={() => handleRoleChange(user.id, 'GUEST')}
                        >
                          <UserCog className="w-4 h-4 mr-1" /> Cabut Akses (Guest)
                        </Button>
                      )}
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
