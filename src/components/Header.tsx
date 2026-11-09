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
    const update = () => setScrolled(window.scrollY > 8);
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
    <header className={`fixed inset-x-0 top-0 z-[80] border-b border-[#b8cbb4]/70 transition-all duration-300 ${scrolled || open || searchOpen ? "bg-[#f8f7ef]/96 shadow-[0_10px_35px_rgba(37,67,47,.10)] backdrop-blur-2xl" : "bg-[#e6efe3]/92 backdrop-blur-xl"}`}>
      <div className="mx-auto flex h-[78px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Visriva home" className="flex items-center gap-3">
          <Image src="/brand/visriva-logo.png" alt="Visriva emblem" width={800} height={800} priority className="h-12 w-12 object-contain" />
          <span className="font-display text-[2rem] leading-none tracking-tight text-[#203f30]">visriva</span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => item.children ? (
            <div key={item.label} className="group relative py-7">
              <Link href={item.href} className="text-[.68rem] font-semibold uppercase tracking-[.14em] text-[#345542] transition hover:text-[#947d34]">{item.label} <span className="ml-1 text-[#a88f3e]">⌄</span></Link>
              <div className="invisible absolute left-1/2 top-[72px] w-[min(690px,80vw)] -translate-x-1/2 translate-y-3 rounded-3xl border border-[#c5d6c0] bg-[#f8f7ef]/98 p-5 opacity-0 shadow-[0_25px_80px_rgba(30,63,45,.18)] backdrop-blur-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="mb-4 flex items-center justify-between px-2"><span className="section-kicker">Explore experiences</span><span className="text-xs text-[#8e7835]">Find your moment ↗</span></div>
                <div className="grid grid-cols-3 gap-3">
                  {item.children.map((child, index) => <Link key={child.href} href={child.href} className="rounded-2xl border border-[#d5e1d0] bg-[#eaf2e7] p-4 transition hover:-translate-y-1 hover:border-[#a88f3e]/60 hover:bg-[#deead9]"><span className="text-[.62rem] tracking-[.2em] text-[#9a843a]">0{index+1}</span><span className="mt-5 block font-display text-2xl text-[#203f30]">{child.label}</span><span className="mt-2 block text-xs text-[#718574]">{child.note}</span><span className="mt-4 block text-sm text-[#8c7739]">Discover ↗</span></Link>)}
                </div>
                <Link href="/#experiences" className="mt-4 block rounded-full border border-[#c5d6c0] px-4 py-3 text-center text-xs uppercase tracking-[.15em] text-[#355642] transition hover:bg-[#294937] hover:text-white">View all experiences</Link>
              </div>
            </div>
          ) : <Link key={item.href} href={item.href} className={`text-[.68rem] font-semibold uppercase tracking-[.14em] transition-colors hover:text-[#947d34] ${pathname === item.href ? "text-[#947d34]" : "text-[#345542]"}`}>{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => {setSearchOpen(!searchOpen);setQuery("");}} aria-label="Search services" aria-expanded={searchOpen} className="grid h-10 w-10 place-items-center rounded-full border border-[#b8cbb4] text-[#345542] transition hover:bg-[#294937] hover:text-white"><svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg></button>
          <Link href="/quote" className="liquid-button hidden rounded-full px-6 py-3 text-[.68rem] font-semibold uppercase tracking-[.14em] sm:inline-flex">Plan your event <span aria-hidden className="ml-2">↗</span></Link>
          <button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-full border border-[#b8cbb4] text-[#345542] lg:hidden"><span className="text-xl leading-none">{open ? "×" : "☰"}</span></button>
        </div>
      </div>
      {searchOpen && <div className="border-t border-[#d2dfce] bg-[#f8f7ef] px-5 py-5"><div className="mx-auto max-w-3xl"><label htmlFor="site-search" className="section-kicker">Find your experience</label><input id="site-search" autoFocus value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search photo booths, AI, VR, merchandise..." className="field mt-3" /><div className="mt-3 flex flex-wrap gap-2">{results.length ? results.map((item)=><Link key={item.href} href={item.href} onClick={()=>setSearchOpen(false)} className="pill-link text-sm">{item.label} {item.note ? <span className="ml-1 text-[#8d7737]">{item.note}</span> : null}</Link>) : <p className="py-3 text-sm text-[#687d6c]">No matching service found. Try “photo”, “AI” or “VR”.</p>}</div></div></div>}
      <div className={`fixed inset-0 top-[78px] z-[79] bg-[#e6efe3] px-6 pb-12 pt-10 transition duration-300 lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
        <nav className="flex h-full flex-col justify-between" aria-label="Mobile navigation"><div className="flex flex-col">{links.map((link,index)=><Link key={link.href} href={link.href} onClick={()=>setOpen(false)} className="border-b border-[#c5d6c0] py-4 font-display text-3xl text-[#203f30]">{String(index+1).padStart(2,"0")} <span className="ml-4">{link.label}</span></Link>)}</div><Link href="/quote" onClick={()=>setOpen(false)} className="liquid-button rounded-full px-6 py-4 text-center text-sm font-semibold uppercase tracking-widest">Plan your event ↗</Link></nav>
      </div>
    </header>
  );
}
