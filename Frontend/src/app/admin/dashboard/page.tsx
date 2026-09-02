"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState({ users: 0, pendingProperties: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await getToken();
      
      // Fetch users
      const usersRes = await fetch("http://localhost:5000/api/v1/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = await usersRes.json();
      
      // Fetch pending properties
      const propsRes = await fetch("http://localhost:5000/api/v1/properti/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const propsData = await propsRes.json();
      
      setStats({
        users: usersData.data?.length || 0,
        pendingProperties: propsData.data?.length || 0
      });
    } catch (error) {
      console.error("Failed to fetch admin dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Super Admin Dashboard</h1>
        <p className="text-slate-500">Overview of system health and pending tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.users}</div>
            <p className="text-sm text-slate-500 mt-1">Registered users across all roles</p>
          </CardContent>
        </Card>

        <Card className={`hover:shadow-md transition-shadow ${stats.pendingProperties > 0 ? 'border-amber-200 bg-amber-50' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Properties</CardTitle>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stats.pendingProperties > 0 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
              {stats.pendingProperties > 0 ? <AlertTriangle size={20} /> : <Home size={20} />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.pendingProperties}</div>
            <p className="text-sm text-slate-500 mt-1">Properties awaiting approval</p>
            {stats.pendingProperties > 0 && (
              <div className="mt-4">
                <Link href="/admin/properties" className="text-sm text-blue-600 font-medium hover:underline">
                  Review Properties &rarr;
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
