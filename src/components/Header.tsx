"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CamoLiquidButton } from "@/components/framer-ui";
import { SwipeLettersLink } from "@/components/ui";
import { instagramUrl, navigation, phoneDisplay } from "@/lib/site";
import { desktopQuickNav, mobileDrawerNav } from "@/lib/public-nav";
import { whatsAppLink, WHATSAPP_GREETING } from "@/lib/whatsapp";

const INSTAGRAM = instagramUrl || "https://www.instagram.com/visriva.co/";
const QUOTE_DESKTOP = "Plan your event";

export function Header() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const waHref = whatsAppLink(WHATSAPP_GREETING);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenDropdown(null);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.dataset.menu = open ? "open" : "";
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      delete document.body.dataset.menu;
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open && !openDropdown && !searchOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setOpenDropdown(null);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, openDropdown, searchOpen]);

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

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] max-w-[100vw] px-3 pt-3 sm:px-4 lg:px-8">
      <div
        className={`pointer-events-auto mx-auto flex w-full max-w-[1790px] items-center justify-between gap-1.5 rounded-full border border-[#C9A227]/35 bg-[#07261C]/85 px-3 py-2 shadow-xl backdrop-blur-xl transition-shadow sm:gap-2 sm:px-3 lg:h-[78px] lg:gap-3 lg:rounded-[19px] lg:px-8 ${scrolled ? "shadow-2xl" : ""}`}
      >
        <Link href="/" aria-label="Visriva home" className="flex min-w-0 shrink items-center gap-2">
          <Image
            src="/brand/visriva-logo.png"
            alt="Visriva"
            width={120}
            height={48}
            priority
            className="h-8 w-auto max-w-[104px] object-contain object-left sm:h-10 sm:max-w-[120px]"
          />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 lg:flex xl:gap-8" aria-label="Primary navigation">
          {navigation.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="group relative py-4"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === item.label}
                  onClick={() => setOpenDropdown((v) => (v === item.label ? null : item.label))}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-[.68rem] font-semibold uppercase tracking-[.14em] text-[#E9E1C4] transition hover:text-[#E5C158]"
                >
                  Services
                  <span className={`text-[#C9A227] transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}>⌄</span>
                </button>
                <div
                  className={`absolute left-1/2 top-[52px] w-[min(640px,90vw)] -translate-x-1/2 rounded-[1.25rem] border border-[#806B2D]/70 bg-[#091A13]/98 p-4 shadow-2xl backdrop-blur-xl transition-all duration-200 ${openDropdown === item.label ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-2 opacity-0"}`}
                >
                  <div className="grid gap-2 sm:grid-cols-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpenDropdown(null)}
                        className="rounded-xl border border-[#806B2D]/40 bg-[#10251A] p-3 transition hover:border-[#C9A227]"
                      >
                        <span className="font-display text-xl text-[#F4F0DF]">{child.label}</span>
                        <span className="mt-1 block text-xs text-[#B9C4B3]">{child.note}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : null,
          )}
          {desktopQuickNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-[.68rem] font-semibold uppercase tracking-[.14em] transition hover:text-[#E5C158] ${pathname === link.href ? "text-[#E5C158]" : "text-[#E9E1C4]"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((v) => !v);
              setQuery("");
            }}
            aria-label="Search services"
            aria-expanded={searchOpen}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#B69A47]/70 bg-[#D8D6C9] text-[#947D34] transition hover:border-[#C9A227] hover:bg-[#F1EBD8] lg:hidden"
          >
            <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </button>
          <div className="hidden lg:block">
            <CamoLiquidButton
              label="Search"
              expanded={searchOpen}
              onClick={() => {
                setSearchOpen((v) => !v);
                setQuery("");
              }}
            />
          </div>

          <Link
            href="/quote"
            className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-gradient-to-r from-[#C9A227] to-[#E5C158] px-2 py-1.5 text-[8px] font-bold uppercase leading-none tracking-[.08em] text-[#051C15] shadow-md sm:gap-1 sm:px-2.5 sm:text-[9px] lg:hidden"
          >
            {QUOTE_DESKTOP}
            <ArrowUpRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
          </Link>

          <SwipeLettersLink
            href="/quote"
            label={QUOTE_DESKTOP}
            className="hidden min-h-[50px] shrink-0 px-6 text-[.65rem] tracking-[.14em] lg:inline-flex"
          />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#B69A47]/70 bg-[#F1EBD8]/90 text-[#294937] lg:hidden"
          >
            {open ? <X className="h-4 w-4 text-[#8E7835]" /> : <Menu className="h-4 w-4 text-[#8E7835]" aria-hidden />}
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="pointer-events-auto mx-auto mt-2 max-w-[1790px] rounded-2xl border border-[#806B2D]/45 bg-[#06241B]/98 px-4 py-4 backdrop-blur-xl lg:px-6">
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
          <>
            <motion.button
              type="button"
              aria-label="Close menu backdrop"
              className="pointer-events-auto fixed inset-0 z-[9998] bg-[#051F17]/75 backdrop-blur-sm lg:hidden"
              initial={{ opacity: reduce ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="pointer-events-auto fixed inset-0 z-[9999] flex flex-col bg-[#051F17] p-6 text-white lg:hidden"
              initial={reduce ? undefined : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduce ? undefined : { x: "100%" }}
              transition={{ type: "tween", duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#C9A227]/25 pb-5">
                <Image src="/brand/visriva-logo.png" alt="Visriva" width={100} height={40} className="h-9 w-auto object-contain" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#C9A227]/40 text-[#E5C158]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-6" aria-label="Mobile navigation">
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
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}