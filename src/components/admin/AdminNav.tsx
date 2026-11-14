"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  FolderKanban,
  IndianRupee,
  LayoutDashboard,
  MessageSquareText,
  Package,
  QrCode,
  Users,
  Wrench,
  Images,
} from "lucide-react";
import { adminNav } from "@/lib/admin-nav";

const icons = {
  dashboard: LayoutDashboard,
  leads: MessageSquareText,
  website: FolderKanban,
  services: Wrench,
  pricing: IndianRupee,
  inventory: Package,
  bookings: CalendarDays,
  customers: Users,
  qr: QrCode,
  eventImages: Images,
} as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-gold/20 bg-[linear-gradient(180deg,#0B3D2E_0%,#06241B_100%)] px-3 py-6 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:py-8">
      <p className="px-2 font-royal text-[0.62rem] uppercase tracking-[0.28em] text-gold">Visriva</p>
      <p className="mt-1 px-2 font-display text-2xl italic text-cream">Studio admin</p>
      <nav className="mt-6 flex flex-wrap gap-1 lg:flex-col" aria-label="Admin">
        {adminNav.map((item) => {
          const Icon = icons[item.icon];
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-11 items-center gap-2 rounded-lg px-3 py-2.5 text-[0.68rem] uppercase tracking-[0.12em] transition ${
                active
                  ? "border border-gold/35 bg-white/5 text-cream lg:border-l-2 lg:border-gold lg:border-y-transparent lg:border-r-transparent"
                  : "text-champagne hover:bg-white/[0.04] hover:text-cream"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 text-gold" aria-hidden />
              <span className="leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <form action="/api/admin/logout" method="post" className="mt-8 hidden px-2 lg:block">
        <button type="submit" className="w-full rounded-full border border-gold/40 px-4 py-2.5 text-[0.68rem] uppercase tracking-[0.18em] text-champagne hover:bg-white/5">
          Sign out
        </button>
      </form>
    </aside>
  );
}