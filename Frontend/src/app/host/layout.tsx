import { UserButton } from "@clerk/nextjs";
import { HostSidebar } from "@/components/layout/HostSidebar";

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <HostSidebar />

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
