"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CamoLiquidButton, MobileDesignDrawer } from "@/components/framer-ui";
import { ISLAND_SPRING, NAVBAR_GLASS_IDLE, NAVBAR_GLASS_SCROLLED } from "@/components/framer-ui/motion";
import { SwipeLettersLink } from "@/components/ui";
import { instagramUrl, navigation, phoneDisplay } from "@/lib/site";
import { whatsAppLink, WHATSAPP_GREETING } from "@/lib/whatsapp";

const HIDE_PREFIXES = ["/admin", "/qr", "/docforclient", "/docforreview"] as const;
const INSTAGRAM = instagramUrl || "https://www.instagram.com/visriva.co/";
const experiences = navigation.find((item) => item.children)?.children ?? [];

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const capsuleRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");

  const hidden = HIDE_PREFIXES.some((p) => pathname.startsWith(p));
  const waHref = whatsAppLink(WHATSAPP_GREETING);

  const links = useMemo(
    () =>
      navigation.flatMap((item) =>
        item.children
          ? item.children.map((child) => ({ href: child.href, label: child.label, note: child.note }))
          : [{ href: item.href, label: item.label, note: "" }],
      ),
    [],
  );
  const results = links.filter((item) => (item.label + " " + item.note).toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onCapsuleMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = capsuleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  if (hidden) return null;

  return (
    <div className="sticky top-3 z-[100] mx-auto w-full max-w-7xl px-3 sm:px-6">
      <motion.header
        ref={capsuleRef}
        layout
        onMouseMove={onCapsuleMove}
        transition={ISLAND_SPRING}
        className={`nova-navbar-glow w-full rounded-full px-3 py-2 transition-[padding,box-shadow] sm:px-6 ${scrolled ? "py-1.5 sm:py-2" : "py-2 sm:py-3"} ${scrolled ? NAVBAR_GLASS_SCROLLED : NAVBAR_GLASS_IDLE}`}
      >
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          <Link href="/" aria-label="Visriva home" className="flex shrink-0 items-center gap-2">
            <Image src="/brand/visriva-logo.png" alt="" width={40} height={40} priority className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
            <span className="font-display text-lg text-white sm:text-2xl">visriva</span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex" aria-label="Primary">
            <Link href="/" className={`nav-link ${pathname === "/" ? "text-[#E5C158]" : ""}`}>
              Home
            </Link>
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <button
                type="button"
                aria-expanded={servicesOpen}
                className={`nav-link inline-flex items-center gap-1 ${pathname.includes("photo-booths") || pathname.includes("merchandise") || pathname.includes("games-vr") ? "text-[#E5C158]" : ""}`}
              >
                Services
                <span className={`text-[#C9A227] transition-transform ${servicesOpen ? "rotate-180" : ""}`}>⌄</span>
              </button>
              {servicesOpen ? (
                <div className="absolute left-1/2 top-[calc(100%+0.75rem)] z-50 w-[min(520px,88vw)] -translate-x-1/2 rounded-2xl border border-[#806B2D]/60 bg-[#091A13]/96 p-4 shadow-2xl backdrop-blur-2xl">
                  <p className="mb-3 px-1 text-[.62rem] font-bold uppercase tracking-[.24em] text-[#C9A227]">Explore stations</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {experiences.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="rounded-xl border border-[#806B2D]/40 bg-[#10251A]/90 p-3 transition hover:border-[#C9A227] hover:bg-[#173322]"
                      >
                        <span className="font-display text-lg text-[#F4F0DF]">{child.label}</span>
                        <span className="mt-1 block text-[10px] text-[#B9C4B3]">{child.note}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <Link href="/qr" className={`nav-link ${pathname.startsWith("/qr") ? "text-[#E5C158]" : ""}`}>
              Event Photos &amp; QR
            </Link>
            <Link href="/reviews" className={`nav-link ${pathname.startsWith("/reviews") ? "text-[#E5C158]" : ""}`}>
              Reviews
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <CamoLiquidButton compact expanded={searchOpen} onClick={() => { setSearchOpen((v) => !v); setQuery(""); }} />
            <SwipeLettersLink href="/quote" label="Plan your event" className="!hidden min-h-0 !px-5 !py-2 text-[10px] sm:!inline-flex sm:!text-xs" />
            <Link
              href="/quote"
              className="flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-[#C9A227] to-[#D9B43A] px-2.5 py-2 text-[10px] font-bold uppercase text-[#051C15] sm:hidden"
            >
              Plan event
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
            </Link>
            <motion.button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
              whileTap={{ scale: 0.94 }}
              transition={reduce ? undefined : ISLAND_SPRING}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C9A227]/40 bg-white/10 text-[#E5C158] lg:hidden"
            >
              <span className="text-base leading-none">☰</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {searchOpen ? (
        <div className="mt-2 rounded-2xl border border-[#806B2D]/45 bg-[#06241B]/98 px-4 py-4 backdrop-blur-xl">
          <label htmlFor="site-search" className="text-[.62rem] font-bold uppercase tracking-[.24em] text-[#E5C158]">
            Find your experience
          </label>
          <input
            id="site-search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search photo booths, AI, VR…"
            className="mt-2 w-full rounded-xl border border-[#806B2D]/60 bg-[#10251A] px-4 py-3 text-sm text-[#F4F0DF] outline-none focus:border-[#E5C158]"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {results.length ? (
              results.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setSearchOpen(false)} className="rounded-full border border-[#806B2D]/60 px-4 py-2 text-sm text-[#E9E1C4]">
                  {item.label}
                </Link>
              ))
            ) : (
              <p className="text-sm text-[#B9C4B3]">Try “photo”, “AI”, or “VR”.</p>
            )}
          </div>
        </div>
      ) : null}

      <MobileDesignDrawer
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div className="space-y-4 border-t border-[#C9A227]/25 pt-5">
            <SwipeLettersLink href="/quote" label="Plan your event" className="w-full justify-center" />
            <div className="flex flex-wrap gap-4 text-sm">
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="font-semibold text-[#E5C158] underline underline-offset-4">
                @visriva.co
              </a>
              {waHref ? (
                <a href={waHref} target="_blank" rel="noreferrer" className="text-white/85 underline underline-offset-4">
                  {phoneDisplay}
                </a>
              ) : (
                <span className="text-white/85">{phoneDisplay}</span>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}