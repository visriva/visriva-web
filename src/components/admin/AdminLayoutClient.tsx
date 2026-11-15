"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { adminActiveNavLabel, AdminNavDrawer } from "@/components/admin/AdminNav";

/** Mobile sticky bar + slide-over nav; desktop is sidebar-only in AdminShell. */
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
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#051F17]/95 px-4 backdrop-blur-xl lg:hidden">
        <div className="min-w-0 pr-3">
          <p className="font-royal text-[0.55rem] uppercase tracking-[0.22em] text-gold">Visriva Studio admin</p>
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
            className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 bg-white/5 text-gold"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {children}

      <AdminNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}