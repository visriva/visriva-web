import Link from "next/link";
import { adminNav } from "@/lib/admin-nav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] lg:flex">
      <aside className="border-b border-gold/20 bg-emerald/30 px-4 py-6 lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r lg:py-28">
        <p className="font-royal text-[0.62rem] uppercase tracking-[0.28em] text-gold">Visriva</p>
        <p className="mt-1 font-display text-2xl italic text-cream">Studio admin</p>
        <nav className="mt-8 flex flex-wrap gap-2 lg:flex-col lg:gap-1" aria-label="Admin">
          {adminNav.map((item) =>
            item.ready ? (
              <Link
                key={item.href}
                href={item.href}
                className="rounded border border-gold/25 px-3 py-2 text-[0.68rem] uppercase tracking-[0.14em] text-champagne hover:border-gold/50 lg:border-transparent lg:px-0"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.href}
                className="cursor-not-allowed px-3 py-2 text-[0.68rem] uppercase tracking-[0.14em] text-mist/50 lg:px-0"
                title="Coming soon"
              >
                {item.label}
              </span>
            ),
          )}
        </nav>
        <form action="/api/admin/logout" method="post" className="mt-8 hidden lg:block">
          <button
            type="submit"
            className="border border-gold/40 px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-champagne"
          >
            Sign out
          </button>
        </form>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
