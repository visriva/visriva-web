"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { navigation } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, pathname]);

  const links = useMemo(() => navigation.flatMap((item) =>
    item.children ? item.children.map((child) => ({ href: child.href, label: child.label, note: child.note })) : [{ href: item.href, label: item.label, note: "" }],
  ), []);
  const results = links.filter((item) => (item.label + " " + item.note).toLowerCase().includes(query.toLowerCase()));

  return (
    <header className={`fixed inset-x-0 top-0 z-[80] border-b transition-all duration-300 ${scrolled || open || searchOpen ? "border-[#b8a04d]/25 bg-[#003319]/95 shadow-[0_12px_40px_rgba(0,0,0,.18)] backdrop-blur-2xl" : "border-white/10 bg-[#003319]/85 backdrop-blur-xl"}`}>
      <div className="mx-auto flex h-[78px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Visriva home" className="flex items-center gap-3">
          <Image src="/brand/visriva-logo.png" alt="Visriva emblem" width={800} height={800} priority className="h-12 w-12 object-contain" />
          <span className="font-display text-[2rem] leading-none tracking-tight text-[#f5f0df]">visriva</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => item.children ? (
            <div key={item.label} className="group relative py-7">
              <Link href={item.href} className="text-[.68rem] font-semibold uppercase tracking-[.16em] text-[#f5f0df]/85 transition hover:text-[#d1bd73]">{item.label} <span className="ml-1 text-[#b8a04d]">⌄</span></Link>
              <div className="invisible absolute left-1/2 top-[72px] w-[min(680px,80vw)] -translate-x-1/2 translate-y-3 rounded-3xl border border-[#b8a04d]/30 bg-[#062c1e]/98 p-5 opacity-0 shadow-2xl backdrop-blur-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="mb-4 flex items-center justify-between px-2"><span className="section-kicker">Explore experiences</span><span className="text-xs text-[#c4ae62]">Choose your moment ↗</span></div>
                <div className="grid grid-cols-3 gap-3">
                  {item.children.map((child, index) => <Link key={child.href} href={child.href} className="rounded-2xl border border-white/10 bg-white/[.035] p-4 transition hover:-translate-y-1 hover:border-[#b8a04d]/60 hover:bg-[#b8a04d]/10"><span className="text-[.62rem] tracking-[.2em] text-[#b8a04d]">0{index+1}</span><span className="mt-5 block font-display text-2xl text-[#f5f0df]">{child.label}</span><span className="mt-2 block text-xs text-[#c4ae62]">{child.note}</span><span className="mt-4 block text-sm text-white/50">Discover ↗</span></Link>)}
                </div>
                <Link href="/#experiences" className="mt-4 block rounded-full border border-[#b8a04d]/30 px-4 py-3 text-center text-xs uppercase tracking-[.15em] text-[#e5d9ad] transition hover:bg-[#b8a04d] hover:text-[#003319]">View all experiences</Link>
              </div>
            </div>
          ) : <Link key={item.href} href={item.href} className={`text-[.68rem] font-semibold uppercase tracking-[.16em] transition-colors hover:text-[#d1bd73] ${pathname === item.href ? "text-[#d1bd73]" : "text-[#f5f0df]/85"}`}>{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => {setSearchOpen(!searchOpen);setQuery("");}} aria-label="Search services" aria-expanded={searchOpen} className="grid h-10 w-10 place-items-center rounded-full border border-[#b8a04d]/35 text-[#e5d9ad] transition hover:bg-[#b8a04d] hover:text-[#003319]"><svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg></button>
          <Link href="/quote" className="liquid-button hidden rounded-full px-6 py-3 text-[.68rem] font-semibold uppercase tracking-[.14em] sm:inline-flex">Plan your event <span aria-hidden className="ml-2">↗</span></Link>
          <button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-full border border-[#b8a04d]/35 text-[#f5f0df] lg:hidden"><span className="text-xl leading-none">{open ? "×" : "☰"}</span></button>
        </div>
      </div>
      {searchOpen && <div className="border-t border-[#b8a04d]/20 bg-[#052b1d] px-5 py-5"><div className="mx-auto max-w-3xl"><label htmlFor="site-search" className="section-kicker">Find your experience</label><input id="site-search" autoFocus value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search photo booths, AI, VR, merchandise..." className="field mt-3 rounded-xl" /><div className="mt-3 flex flex-wrap gap-2">{results.length ? results.map((item)=><Link key={item.href} href={item.href} onClick={()=>setSearchOpen(false)} className="pill-link text-sm">{item.label} {item.note ? <span className="ml-1 text-[#c4ae62]">{item.note}</span> : null}</Link>) : <p className="py-3 text-sm text-white/60">No matching service found. Try “photo”, “AI” or “VR”.</p>}</div></div></div>}
      <div className={`fixed inset-0 top-[78px] z-[79] bg-[#003319] px-6 pb-12 pt-10 transition duration-300 lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
        <nav className="flex h-full flex-col justify-between" aria-label="Mobile navigation"><div className="flex flex-col">{links.map((link,index)=><Link key={link.href} href={link.href} onClick={()=>setOpen(false)} className="border-b border-[#b8a04d]/20 py-4 font-display text-3xl text-[#f5f0df]">{String(index+1).padStart(2,"0")} <span className="ml-4">{link.label}</span></Link>)}</div><Link href="/quote" onClick={()=>setOpen(false)} className="liquid-button rounded-full px-6 py-4 text-center text-sm font-semibold uppercase tracking-widest">Plan your event ↗</Link></nav>
      </div>
    </header>
  );
}
