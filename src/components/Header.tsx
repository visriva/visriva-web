"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const links = navigation.flatMap((item) =>
    item.children ? item.children.map((child) => ({ href: child.href, label: child.label })) : [{ href: item.href, label: item.label }],
  );

  return (
    <header className={`fixed inset-x-0 top-0 z-[80] border-b transition-all duration-300 ${scrolled || open ? "border-stone-200 bg-[#fffdf8]/95 shadow-sm backdrop-blur-xl" : "border-transparent bg-[#fffdf8]/75 backdrop-blur-md"}`}>
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Visriva home" className="flex items-center gap-3">
          <Image src="/brand/visriva-logo.png" alt="Visriva emblem" width={800} height={800} priority className="h-12 w-12 object-contain" />
          <span className="font-display text-[2rem] leading-none tracking-tight text-[#211f19]">visriva</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {links.map((link) => {
            const path = link.href.split("#")[0];
            const active = path ? pathname === path || (path !== "/" && pathname.startsWith(path + "/")) : false;
            return <Link key={link.href} href={link.href} className={`text-[.68rem] font-semibold uppercase tracking-[.16em] transition-colors hover:text-[#9a6c20] ${active ? "text-[#9a6c20]" : "text-[#46443d]"}`}>{link.label}</Link>;
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/quote" className="hidden rounded-full bg-[#1e211c] px-6 py-3 text-[.68rem] font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#9a6c20] sm:inline-flex">Plan your event <span aria-hidden className="ml-2">↗</span></Link>
          <button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-full border border-stone-300 text-[#24241e] lg:hidden">
            <span className="text-xl leading-none">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      <div className={`fixed inset-0 top-[76px] z-[79] bg-[#f5f1e8] px-6 pb-12 pt-10 transition duration-300 lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
        <nav className="flex h-full flex-col justify-between" aria-label="Mobile navigation">
          <div className="flex flex-col">
            {links.map((link, index) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b border-stone-300 py-4 font-display text-3xl text-[#22221c]">{String(index + 1).padStart(2,"0")} <span className="ml-4">{link.label}</span></Link>)}
          </div>
          <Link href="/quote" onClick={() => setOpen(false)} className="rounded-full bg-[#1e211c] px-6 py-4 text-center text-sm font-semibold uppercase tracking-widest text-white">Plan your event ↗</Link>
        </nav>
      </div>
    </header>
  );
}
