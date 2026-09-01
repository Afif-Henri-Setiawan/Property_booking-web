"use client";

import { UserButton } from "@clerk/nextjs";
import { ClipboardList, LayoutDashboard } from "lucide-react";

export default function CustomUserButton({ role = "GUEST" }: { role?: string }) {
  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Link
          label="Pesanan Saya"
          labelIcon={<ClipboardList size={15} />}
          href="/user/bookings"
        />
        {role !== "GUEST" && (
          <UserButton.Link
            label="Host Dashboard"
            labelIcon={<LayoutDashboard size={15} />}
            href="/host/dashboard"
          />
        )}
      </UserButton.MenuItems>
    </UserButton>
  );
}
