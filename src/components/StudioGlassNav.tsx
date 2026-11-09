"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { VisrivaMark } from "@/components/VisrivaMark";
import { studioNav } from "@/lib/studio-nav";

function isActive(pathname: string, hash: string, item: (typeof studioNav)[number]) {
  if (item.match === "home-rate") {
    return pathname === "/" && hash === "#rate-card";
  }
  if (item.href === "/") return pathname === "/";
  const base = item.href.split("#")[0];
  if (item.match === "exact") return pathname === base;
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function StudioGlassNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const sync = () => setHash(typeof window !== "undefined" ? window.location.hash : "");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.dataset.menu = open ? "open" : "closed";
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.dataset.menu = "closed";
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[90] transition duration-700 ${
        solid || open ? "nav-glass-solid" : "nav-glass-idle"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="shrink-0" aria-label="Visriva home">
          <VisrivaMark
            priority
            className="h-11 w-auto max-w-[9rem] object-contain sm:h-12 sm:max-w-[10rem]"
          />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Studio">
          {studioNav.map((item) => {
            const active = isActive(pathname, hash, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`type-site-nav rounded-lg px-3 py-2.5 transition duration-300 ${
                  active
                    ? "bg-gold/12 text-gold-2 ring-1 ring-gold/40"
                    : "text-cream/88 hover:bg-white/[0.05] hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/quote"
            className="type-site-nav hidden rounded-lg border border-gold/55 bg-gold/90 px-4 py-2.5 text-deep sm:inline-flex"
          >
            Book
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 flex-col items-center justify-center gap-1 border border-gold/35 text-gold xl:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block h-px w-4 bg-gold" />
            <span className="block h-px w-4 bg-gold" />
          </button>
        </div>
      </div>

      <div
        className={`border-t border-gold/15 bg-deep/80 backdrop-blur-2xl xl:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav className="mx-auto flex max-w-[1500px] flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Mobile studio">
          {studioNav.map((item) => (
            <Link key={item.href} href={item.href} className="type-site-nav border-b border-gold/10 py-3">
              {item.label}
            </Link>
          ))}
          <Link href="/about" className="type-site-nav border-b border-gold/10 py-3">
            About
          </Link>
          <Link href="/quote" className="type-site-nav mt-2 bg-gold py-3 text-center text-deep">
            Request quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
