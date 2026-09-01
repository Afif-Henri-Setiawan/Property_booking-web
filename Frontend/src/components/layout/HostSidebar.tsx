"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Calendar, Settings, CalendarDays } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function HostSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/host/dashboard", icon: LayoutDashboard },
    { name: "Properties", href: "/host/properties", icon: Home },
    { name: "Ketersediaan", href: "/host/calendar", icon: CalendarDays },
    { name: "Bookings", href: "/host/bookings", icon: Calendar },
    { name: "Settings", href: "/host/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-forest-900 text-white hidden md:flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary-fixed">StayNest</h2>
        <p className="text-sm text-slate-300">Host Portal</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/20 text-primary-fixed"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10 flex items-center gap-4">
        <UserButton
          showName
          appearance={{
            elements: {
              userButtonBox: "flex-row-reverse",
              userButtonOuterIdentifier: "text-white font-medium",
            },
          }}
        />
      </div>
    </aside>
  );
}
