import Link from "next/link";
import { LayoutDashboard, Home, Calendar, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-forest-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary-fixed">StayNest</h2>
          <p className="text-sm text-slate-300">Host Portal</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/host/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary/20 text-primary-fixed rounded-lg">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/host/properties" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 rounded-lg transition-colors">
            <Home size={20} />
            <span>Properties</span>
          </Link>
          <Link href="/host/bookings" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 rounded-lg transition-colors">
            <Calendar size={20} />
            <span>Bookings</span>
          </Link>
          <Link href="/host/settings" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5 rounded-lg transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10 flex items-center gap-4">
          <UserButton showName appearance={{ elements: { userButtonBox: "flex-row-reverse", userButtonOuterIdentifier: "text-white" } }} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 md:hidden">
          <h2 className="text-xl font-bold text-forest-900">StayNest</h2>
          <UserButton />
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
