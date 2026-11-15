"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { instagramUrl, navigation, phoneDisplay } from "@/lib/site";
import { mobileDrawerNav } from "@/lib/public-nav";
import { whatsAppLink, WHATSAPP_GREETING } from "@/lib/whatsapp";

const HIDE_PREFIXES = ["/admin", "/qr", "/docforclient", "/docforreview"] as const;

const DESKTOP_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#experiences", label: "Services" },
  { href: "/qr", label: "Event Photos & QR" },
  { href: "/reviews", label: "Reviews" },
] as const;

const INSTAGRAM = instagramUrl || "https://www.instagram.com/visriva.co/";

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const waHref = whatsAppLink(WHATSAPP_GREETING);
  const hidden = HIDE_PREFIXES.some((p) => pathname.startsWith(p));

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
  }, [pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open && !searchOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, searchOpen]);

  if (hidden) return null;

  return (
    <div className="sticky top-3 z-[100] mx-auto w-full max-w-7xl px-3 sm:px-6">
      <header className="w-full rounded-full border border-[#C9A227]/35 bg-[#07261C]/85 px-3 py-2 shadow-xl backdrop-blur-xl sm:px-6 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" aria-label="Visriva home" className="flex shrink-0 items-center gap-2">
            <Image
              src="/brand/visriva-logo.png"
              alt=""
              width={40}
              height={40}
              priority
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            />
            <span className="font-display text-lg text-white sm:text-2xl">visriva</span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 lg:flex" aria-label="Primary">
            {DESKTOP_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap text-[.68rem] font-semibold uppercase tracking-[.14em] transition hover:text-[#E5C158] ${
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.replace("/#", "/")))
                    ? "text-[#E5C158]"
                    : "text-[#E9E1C4]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((v) => !v);
                setQuery("");
              }}
              aria-label="Search services"
              aria-expanded={searchOpen}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EBECE6] text-[#C9A227] sm:h-10 sm:w-10"
            >
              <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </button>

            <Link
              href="/quote"
              className="flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-[#C9A227] to-[#D9B43A] px-2.5 py-2 text-[10px] font-bold uppercase text-[#051C15] sm:px-5 sm:py-2.5 sm:text-xs"
            >
              <span className="sm:hidden">Plan event</span>
              <span className="hidden uppercase sm:inline">Plan your event</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C9A227]/40 bg-white/10 text-[#E5C158] lg:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </header>

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
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSearchOpen(false)}
                  className="rounded-full border border-[#806B2D]/60 px-4 py-2 text-sm text-[#E9E1C4]"
                >
                  {item.label}
                </Link>
              ))
            ) : (
              <p className="text-sm text-[#B9C4B3]">Try “photo”, “AI”, or “VR”.</p>
            )}
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[999] flex flex-col bg-[#041812]/95 p-6 backdrop-blur-2xl lg:hidden"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
          >
            <div className="flex items-center justify-between border-b border-[#C9A227]/25 pb-5">
              <span className="font-display text-2xl text-white">visriva</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-[#C9A227]/40 text-[#E5C158]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 py-6" aria-label="Mobile navigation">
              <ul className="space-y-0">
                {mobileDrawerNav.map((link) => (
                  <li key={link.href} className="border-b border-white/10">
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 items-center py-4 font-display text-2xl tracking-tight text-[#F4F0DF] transition hover:text-[#E5C158]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="space-y-4 border-t border-[#C9A227]/25 pt-5">
              <Link
                href="/quote"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C9A227] to-[#E5C158] py-4 text-sm font-bold uppercase tracking-[.14em] text-[#051C15]"
              >
                Plan your event
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}