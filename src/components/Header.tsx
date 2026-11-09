"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { navigation } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [query,setQuery]=useState("");
  useEffect(()=>{const update=()=>setScrolled(window.scrollY>8);update();window.addEventListener("scroll",update,{passive:true});return()=>window.removeEventListener("scroll",update);},[]);
  useEffect(()=>{setOpen(false);document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow="";};},[open,pathname]);
  const links=useMemo(()=>navigation.flatMap(item=>item.children?item.children.map(child=>({href:child.href,label:child.label,note:child.note})): [{href:item.href,label:item.label,note:""}]),[]);
  const results=links.filter(item=>(item.label+" "+item.note).toLowerCase().includes(query.toLowerCase()));
  return <header className={`fixed inset-x-0 top-0 z-[80] px-3 pt-3 sm:px-6 `}>
    <div className={`glass-nav mx-auto max-w-[1500px] rounded-2xl transition-all duration-300 ${scrolled?"shadow-[0_18px_55px_rgba(32,63,48,.14)]":"shadow-[0_10px_35px_rgba(32,63,48,.07)]"}`}>
      <div className="mx-auto flex h-[72px] items-center justify-between px-4 sm:px-7 lg:px-10">
        <Link href="/" aria-label="Visriva home" className="flex items-center gap-3"><Image src="/brand/visriva-logo.png" alt="Visriva emblem" width={800} height={800} priority className="h-11 w-11 object-contain"/><span className="font-display text-[2rem] leading-none tracking-tight text-[#203F30]">visriva</span></Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navigation.map(item=>item.children?<div key={item.label} className="group relative py-6">
            <Link href={item.href} className="inline-flex items-center gap-2 text-[.67rem] font-semibold uppercase tracking-[.14em] text-[#355642] transition hover:text-[#947D34]">{item.label}<span className="text-[#A88F3E] transition-transform group-hover:rotate-180">⌄</span></Link>
            <div className="invisible absolute left-1/2 top-[66px] w-[min(720px,82vw)] -translate-x-1/2 translate-y-3 rounded-[1.5rem] border border-[#D2DFCE] bg-[#F8F7EF]/98 p-5 opacity-0 shadow-[0_28px_90px_rgba(24,59,39,.18)] backdrop-blur-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="mb-4 flex items-center justify-between px-2"><span className="section-kicker">Explore the collection</span><Link href="/rate-card" className="text-xs font-semibold text-[#947D34]">View rate card ↗</Link></div>
              <div className="grid grid-cols-3 gap-3">{item.children.map((child,index)=><Link key={child.href} href={child.href} className="group/menu rounded-2xl border border-[#D7E2D3] bg-[#EFF4EB] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#B8A04D] hover:bg-white"><span className="text-[9px] font-bold tracking-[.2em] text-[#A88F3E]">0{index+1}</span><span className="mt-5 block font-display text-2xl text-[#294937]">{child.label}</span><span className="mt-2 block text-xs text-[#718574]">{child.note}</span><span className="mt-5 block text-xs font-semibold text-[#947D34] transition group-hover/menu:translate-x-1">Discover experience →</span></Link>)}</div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#E6EFE3] px-4 py-3"><span className="text-xs text-[#607768]">Not sure what fits your event?</span><Link href="/quote" className="text-xs font-semibold text-[#355642] underline underline-offset-4">Build a custom brief ↗</Link></div>
            </div>
          </div>:<Link key={item.href} href={item.href} className={`text-[.67rem] font-semibold uppercase tracking-[.14em] transition hover:text-[#947D34] ${pathname===item.href?"text-[#947D34]":"text-[#355642]"}`}>{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={()=>{setSearchOpen(!searchOpen);setQuery("");}} aria-label="Search services" aria-expanded={searchOpen} className="grid h-10 w-10 place-items-center rounded-full border border-[#C9D7C4] bg-white/65 text-[#355642] transition hover:border-[#B8A04D] hover:bg-[#E8EFE4]"><svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg></button>
          <Link href="/quote" className="liquid-button hidden rounded-full px-6 py-3 text-[.67rem] font-semibold uppercase tracking-[.14em] sm:inline-flex">Plan your event <span aria-hidden className="ml-2">↗</span></Link>
          <button type="button" onClick={()=>setOpen(!open)} aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-full border border-[#C9D7C4] text-[#355642] lg:hidden"><span className="text-xl leading-none">{open?"×":"☰"}</span></button>
        </div>
      </div>
      {searchOpen?<div className="border-t border-[#D8E3D4] px-5 py-5 sm:px-8"><div className="mx-auto max-w-3xl"><label htmlFor="site-search" className="section-kicker">Find your experience</label><input id="site-search" autoFocus value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search photo booths, AI, VR, merchandise..." className="field mt-3"/><div className="mt-3 flex flex-wrap gap-2">{results.length?results.map(item=><Link key={item.href} href={item.href} onClick={()=>setSearchOpen(false)} className="pill-link text-sm">{item.label}{item.note?<span className="ml-1 text-[#8D7737]">{item.note}</span>:null}</Link>):<p className="py-3 text-sm text-[#687D6C]">No matching service found. Try “photo”, “AI” or “VR”.</p>}</div></div></div>:null}
    </div>
    <div className={`fixed inset-0 z-[79] bg-[#E6EFE3] px-6 pb-12 pt-24 transition duration-300 lg:hidden ${open?"visible opacity-100":"invisible opacity-0"}`}><nav className="flex h-full flex-col justify-between" aria-label="Mobile navigation"><div>{links.map((link,index)=><Link key={link.href} href={link.href} onClick={()=>setOpen(false)} className="block border-b border-[#C5D6C0] py-4 font-display text-3xl text-[#203F30]">{String(index+1).padStart(2,"0")} <span className="ml-4">{link.label}</span></Link>)}</div><Link href="/quote" onClick={()=>setOpen(false)} className="liquid-button rounded-full px-6 py-4 text-center text-sm font-semibold uppercase tracking-widest">Plan your event ↗</Link></nav></div>
  </header>;
}
