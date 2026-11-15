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
  Star,
  X,
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
  googleReviews: Star,
} as const;

function AdminNavLinks({ onNavigate, compact }: { onNavigate?: () => void; compact?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={compact ? "flex flex-col gap-0.5" : "mt-6 flex flex-col gap-0.5"} aria-label="Admin">
      {adminNav.map((item) => {
        const Icon = icons[item.icon];
        const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
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
  );
}

export function adminActiveNavLabel(pathname: string) {
  const match =
    adminNav.find((item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))) ??
    adminNav[0];
  return match.label;
}

/** Desktop-only fixed sidebar — never shown on mobile (drawer handles &lt; lg). */
export function AdminSidebar() {
  return (
    <aside className="hidden shrink-0 border-r border-gold/20 bg-[linear-gradient(180deg,#0B3D2E_0%,#06241B_100%)] lg:flex lg:w-64 lg:flex-col lg:px-3 lg:py-8">
      <p className="px-2 font-royal text-[0.62rem] uppercase tracking-[0.28em] text-gold">Visriva</p>
      <p className="mt-1 px-2 font-display text-2xl italic text-cream">Studio admin</p>
      <AdminNavLinks />
      <form action="/api/admin/logout" method="post" className="mt-8 px-2">
        <button
          type="submit"
          className="w-full rounded-full border border-gold/40 px-4 py-2.5 text-[0.68rem] uppercase tracking-[0.18em] text-champagne hover:bg-white/5"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}

export function AdminNavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
  <>
      <button
        type="button"
        aria-label="Close admin menu"
        className="fixed inset-0 z-[998] bg-[#051F17]/80 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      <aside
        className="fixed inset-y-0 right-0 z-[999] flex w-[min(100%,320px)] flex-col border-l border-gold/25 bg-[linear-gradient(180deg,#0B3D2E_0%,#06241B_100%)] shadow-2xl lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div>
            <p className="font-royal text-[0.55rem] uppercase tracking-[0.22em] text-gold">Visriva</p>
            <p className="font-display text-xl italic text-cream">Studio admin</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-gold/35 text-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <AdminNavLinks onNavigate={onClose} compact />
        </div>
        <form action="/api/admin/logout" method="post" className="border-t border-white/10 p-4">
          <button
            type="submit"
            className="w-full rounded-full border border-gold/40 px-4 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-champagne hover:bg-white/5"
          >
            Sign out
          </button>
        </form>
      </aside>
  </>
  );
}