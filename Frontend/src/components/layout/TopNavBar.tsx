import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { PlusCircle, Home as HomeIcon, ClipboardList, LayoutDashboard } from "lucide-react";

export default async function TopNavBar() {
  const { userId } = await auth();

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 shadow-sm bg-white/90 backdrop-blur-md">
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
          <Link href="/" className="text-[#1E2A4F] font-semibold">Home</Link>
          <Link href="#" className="hover:text-[#1E2A4F] transition-colors">Listings</Link>
          <Link href="#" className="hover:text-[#1E2A4F] transition-colors">Services</Link>
          <Link href="#" className="hover:text-[#1E2A4F] transition-colors">Favorite</Link>
          <Link href="#" className="hover:text-[#1E2A4F] transition-colors">Blog</Link>
          <Link href="#" className="hover:text-[#1E2A4F] transition-colors">About Us</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {userId ? (
            <>
              <Link
                href="/host/dashboard"
                className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-[#1E2A4F] transition-colors font-medium text-sm mr-2"
              >
                <PlusCircle size={20} />
                Dashboard
              </Link>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Bookings"
                    labelIcon={<ClipboardList size={15} />}
                    href="/user/bookings"
                  />
                  <UserButton.Link
                    label="Host Dashboard"
                    labelIcon={<LayoutDashboard size={15} />}
                    href="/host/dashboard"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="text-gray-500 hover:text-[#1E2A4F] transition-colors font-medium text-sm hidden sm:block">
                  Log In
                </button>
              </SignInButton>
              <Link href="/host/properties">
                <button className="px-6 py-2.5 rounded-full bg-[#1E2A4F] text-white hover:bg-[#111827] transition-colors shadow-sm font-medium text-sm">
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
