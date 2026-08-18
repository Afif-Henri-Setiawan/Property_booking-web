import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { PlusCircle, ArrowRight, MapPin } from "lucide-react";

export default async function TopNavBar() {
  const { userId } = await auth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-3xl dark:bg-surface/70 border-b border-white/30 shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center h-20 px-4 md:px-16 max-w-7xl mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="font-bold text-xl text-primary dark:text-primary-fixed flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
            <MapPin size={18} />
          </div>
          StayNest
        </Link>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm">
          <Link
            href="/"
            className="text-primary dark:text-primary-fixed font-bold border-b-2 border-primary pb-1"
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-on-surface-variant dark:text-on-secondary-container hover:text-primary transition-colors"
          >
            Explore Properties
          </Link>
          <Link
            href="#"
            className="text-on-surface-variant dark:text-on-secondary-container hover:text-primary transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="#"
            className="text-on-surface-variant dark:text-on-secondary-container hover:text-primary transition-colors"
          >
            About Us
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {userId ? (
            <>
              <Link
                href="/host/dashboard"
                className="hidden lg:flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium text-sm"
              >
                <PlusCircle size={20} />
                Host Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <button className="hidden sm:block px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/5 transition-colors font-medium text-sm">
                Get the app
              </button>
              <SignInButton mode="modal">
                <button className="px-6 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm font-medium text-sm flex items-center gap-2">
                  Sign In
                  <ArrowRight size={18} />
                </button>
              </SignInButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
