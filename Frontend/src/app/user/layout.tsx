import Link from "next/link";
import { User, ClipboardList, History } from "lucide-react";
import TopNavBar from "@/components/layout/TopNavBar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavBar />
      <div className="pt-24 pb-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0 print:hidden">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-28">
              <h2 className="text-lg font-bold text-[#1E2A4F] mb-4 px-2">Account</h2>
              <nav className="flex flex-col gap-2">
                <Link 
                  href="/user/profile" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-[#1E2A4F] transition-colors font-medium"
                >
                  <User size={18} />
                  My Profile
                </Link>
                <Link 
                  href="/user/bookings" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-[#1E2A4F] transition-colors font-medium"
                >
                  <ClipboardList size={18} />
                  My Bookings
                </Link>
                <Link 
                  href="/user/history" 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-[#1E2A4F] transition-colors font-medium"
                >
                  <History size={18} />
                  Riwayat Pesanan
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
