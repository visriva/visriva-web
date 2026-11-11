"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { navigation } from "@/lib/site";
import { SwipeLettersLink } from "@/components/ui";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Close transient navigation UI only when the route changes.
  useEffect(() => {
    setOpen(false);
    setOpenDropdown(null);
    setSearchOpen(false);
  }, [pathname]);

  // Lock background scrolling while the mobile navigation is visible.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Escape should dismiss both the mobile menu and the search panel.
  useEffect(() => {
    if (!open && !searchOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setOpenDropdown(null);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, searchOpen]);

  const links = useMemo(
    () => navigation.flatMap((item) =>
      item.children
        ? item.children.map((child) => ({ href: child.href, label: child.label, note: child.note }))
        : [{ href: item.href, label: item.label, note: "" }]
    ),
    []
  );
  const results = links.filter((item) =>
    (item.label + " " + item.note).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <header className="fixed inset-x-0 top-0 z-[80] px-3 pt-3 sm:px-6 lg:px-8">
      <div className={`mx-auto max-w-[1790px] rounded-[19px] border border-[#806B2D]/70 bg-[#06140F]/95 shadow-[0_16px_48px_rgba(0,0,0,.24)] backdrop-blur-2xl transition-all duration-300 ${scrolled ? "shadow-[0_20px_58px_rgba(0,0,0,.34)]" : ""}`}>
        <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:h-[82px] sm:px-7 lg:px-14">
          <Link href="/" aria-label="Visriva home" className="flex shrink-0 items-center gap-3">
            <Image src="/brand/visriva-logo.png" alt="Visriva emblem" width={800} height={800} priority className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
            <span className="font-display text-[1.9rem] leading-none tracking-tight text-[#F4F0DF] sm:text-[2.15rem]">visriva</span>
          </Link>

          <nav className="hidden items-center gap-7 xl:flex 2xl:gap-9" aria-label="Primary navigation">
            {navigation.map((item) => item.children ? (
              <div key={item.label} className="group relative py-6" onMouseEnter={() => setOpenDropdown(item.label)} onMouseLeave={() => setOpenDropdown(null)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenDropdown(null); }}>
                <button type="button" aria-haspopup="true" aria-expanded={openDropdown === item.label} aria-controls="experiences-menu" onClick={() => setOpenDropdown((current) => current === item.label ? null : item.label)} className="inline-flex items-center gap-2 whitespace-nowrap text-[.68rem] font-semibold uppercase tracking-[.16em] text-[#E9E1C4] transition hover:text-[#D2B85C]">
                  {item.label}<span className={`text-[#C6A94C] transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}>⌄</span>
                </button>
                <div id="experiences-menu" className={`absolute left-1/2 top-[70px] w-[min(720px,82vw)] -translate-x-1/2 rounded-[1.5rem] border border-[#806B2D]/70 bg-[#091A13]/98 p-5 shadow-[0_28px_90px_rgba(0,0,0,.42)] backdrop-blur-2xl transition-all duration-200 ${openDropdown === item.label ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-3 opacity-0"}`}>
                  <div className="mb-4 flex items-center justify-between px-2">
                    <span className="text-[.62rem] font-bold uppercase tracking-[.24em] text-[#C6A94C]">Explore the collection</span>
                    <div className="flex items-center gap-4"><Link href={item.href} onClick={() => setOpenDropdown(null)} className="text-xs font-semibold text-[#D2B85C]">All experiences ↗</Link><Link href="/rate-card" onClick={() => setOpenDropdown(null)} className="text-xs font-semibold text-[#D2B85C]">View rate card ↗</Link></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {item.children.map((child, index) => (
                      <Link key={child.href} href={child.href} onClick={() => setOpenDropdown(null)} className="group/menu rounded-2xl border border-[#806B2D]/45 bg-[#10251A] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#C6A94C] hover:bg-[#173322]">
                        <span className="text-[9px] font-bold tracking-[.2em] text-[#C6A94C]">0{index + 1}</span>
                        <span className="mt-5 block font-display text-2xl text-[#F4F0DF]">{child.label}</span>
                        <span className="mt-2 block text-xs text-[#B9C4B3]">{child.note}</span>
                        <span className="mt-5 block text-xs font-semibold text-[#D2B85C] transition group-hover/menu:translate-x-1">Discover experience →</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-[#806B2D]/35 bg-[#10251A] px-4 py-3">
                    <span className="text-xs text-[#C6CEBF]">Not sure what fits your event?</span>
                    <Link href="/quote" onClick={() => setOpenDropdown(null)} className="text-xs font-semibold text-[#E0CA79] underline underline-offset-4">Build a custom brief ↗</Link>
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={`whitespace-nowrap text-[.68rem] font-semibold uppercase tracking-[.16em] transition hover:text-[#D2B85C] ${pathname === item.href ? "text-[#D2B85C]" : "text-[#E9E1C4]"}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => { setSearchOpen((value) => !value); setQuery(""); }} aria-label="Search services" aria-expanded={searchOpen} className="grid h-10 w-10 place-items-center rounded-full border border-[#B69A47]/70 bg-[#D8D6C9] text-[#D8C16B] transition hover:border-[#E1C65E] hover:bg-[#F1EBD8] sm:h-12 sm:w-12">
              <svg viewBox="0 0 24 24" fill="none" className="h-[17px] w-[17px]" stroke="currentColor" strokeWidth="1.8"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
            </button>
            <SwipeLettersLink href="/quote" label="Plan your event" className="hidden min-h-[54px] px-7 text-[.68rem] tracking-[.16em] sm:inline-flex lg:px-8" />
            <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" className="grid h-10 w-10 place-items-center rounded-full border border-[#B69A47]/60 text-[#E9D68D] xl:hidden">
              <span className="text-xl leading-none">{open ? "×" : "☰"}</span>
            </button>
          </div>
        </div>

        {searchOpen ? (
          <div className="border-t border-[#806B2D]/45 px-5 py-5 sm:px-8">
            <div className="mx-auto max-w-3xl">
              <label htmlFor="site-search" className="text-[.62rem] font-bold uppercase tracking-[.24em] text-[#D2B85C]">Find your experience</label>
              <input id="site-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search photo booths, AI, VR, merchandise..." className="mt-3 w-full rounded-xl border border-[#806B2D]/60 bg-[#10251A] px-4 py-3 text-sm text-[#F4F0DF] outline-none placeholder:text-[#93A091] focus:border-[#D2B85C]" />
              <div className="mt-3 flex flex-wrap gap-2">
                {results.length ? results.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setSearchOpen(false)} className="rounded-full border border-[#806B2D]/60 px-4 py-2 text-sm text-[#E9E1C4] transition hover:border-[#D2B85C] hover:bg-[#173322]">{item.label}{item.note ? <span className="ml-1 text-[#D2B85C]">{item.note}</span> : null}</Link>
                )) : <p className="py-3 text-sm text-[#B9C4B3]">No matching service found. Try “photo”, “AI” or “VR”.</p>}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div id="mobile-navigation" className={`fixed inset-0 z-[79] bg-[#06140F] px-6 pb-12 pt-28 transition duration-300 xl:hidden ${open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}`}>
        <nav className="flex h-full flex-col justify-between" aria-label="Mobile navigation">
          <div>{links.map((link, index) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block border-b border-[#806B2D]/40 py-4 font-display text-3xl text-[#F4F0DF]">
              <span className="text-sm text-[#C6A94C]">{String(index + 1).padStart(2, "0")}</span><span className="ml-4">{link.label}</span>
            </Link>
          ))}</div>
          <Link href="/quote" onClick={() => setOpen(false)} className="rounded-full border border-[#D2B85C] bg-[#C6A21F] px-6 py-4 text-center text-sm font-semibold uppercase tracking-widest text-[#08150F]">Plan your event ↗</Link>
        </nav>
      </div>
    </header>
  );
}
