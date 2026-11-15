"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { adminMobileTabs } from "@/lib/admin-nav";
import { adminActiveNavLabel, AdminNavDrawer } from "@/components/admin/AdminNav";

/** Mobile sticky bar + horizontal tabs + slide-over nav; desktop uses sidebar only. */
export function AdminMainColumn({ live, children }: { live: boolean; children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeLabel = adminActiveNavLabel(pathname);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="sticky top-0 z-50 shrink-0 border-b border-white/10 bg-[#04150F] lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="min-w-0 pr-3">
            <p className="truncate font-royal text-[0.55rem] uppercase tracking-[0.22em] text-gold">Visriva Studio admin</p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-champagne">{activeLabel}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                live ? "border-emerald-400/40 bg-emerald-900/30 text-emerald-200" : "border-gold/40 bg-gold/10 text-gold-2"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-emerald-400" : "bg-gold"}`} aria-hidden />
              Live
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open admin menu"
              aria-expanded={menuOpen}
              className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 bg-white/5 text-gold"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav
          className="flex gap-2 overflow-x-auto whitespace-nowrap border-t border-white/5 px-4 py-2.5 scrollbar-none"
          aria-label="Admin modules"
        >
          {adminMobileTabs.map((tab) => {
            const active = pathname === tab.href || (tab.href !== "/admin" && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] transition ${
                  active ? "bg-gold/20 text-cream" : "bg-white/5 text-champagne hover:bg-white/10"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {children}

      <AdminNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}