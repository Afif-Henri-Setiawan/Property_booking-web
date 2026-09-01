import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { PlusCircle, Home as HomeIcon, ClipboardList, LayoutDashboard } from "lucide-react";

import CustomUserButton from "./CustomUserButton";

export default async function TopNavBar() {
  const { userId, getToken } = await auth();
  
  let role = "GUEST";
  if (userId) {
    try {
      const token = await getToken();
      if (token) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'success' && json.data?.role) {
            role = json.data.role;
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch user role", e);
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 shadow-sm bg-white/90 backdrop-blur-md print:hidden">
      <nav className="flex justify-between items-center h-20 px-4 md:px-16 max-w-7xl mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="font-bold text-xl text-[#1E2A4F] flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-md bg-[#1E2A4F]/10 flex items-center justify-center text-[#1E2A4F]">
            <HomeIcon size={18} strokeWidth={2.5} />
          </div>
          StayNest
        </Link>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-500">
          <Link href="/" className="text-[#1E2A4F] font-semibold">Beranda</Link>
          <Link href="/#layanan" className="hover:text-[#1E2A4F] transition-colors">Layanan</Link>
          <Link href="/#properti-pilihan" className="hover:text-[#1E2A4F] transition-colors">Daftar Properti</Link>
          <Link href="/#ulasan" className="hover:text-[#1E2A4F] transition-colors">Ulasan</Link>
          <Link href="/#kontak" className="hover:text-[#1E2A4F] transition-colors">Kontak Kami</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {userId ? (
            <>
              {role !== "GUEST" ? (
                <Link
                  href="/host/dashboard"
                  className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-[#1E2A4F] transition-colors font-medium text-sm mr-2"
                >
                  <LayoutDashboard size={18} />
                  Dashboard Host
                </Link>
              ) : (
                <Link
                  href="/user/profile"
                  className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-[#1E2A4F] transition-colors font-medium text-sm mr-2"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              )}
              <CustomUserButton role={role} />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="bg-[#1E2A4F] text-white px-6 py-2.5 rounded-full hover:bg-[#1E2A4F] transition-colors font-medium text-sm hidden sm:block">
                  Masuk
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
