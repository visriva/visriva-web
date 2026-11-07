"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/lib/site";

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  const path = href.split("#")[0];
  if (!path) return false;
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [experiencesOpen, setExperiencesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setExperiencesOpen(false);
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
      className={`fixed inset-x-0 top-0 z-[80] transition duration-700 ${
        solid || open
          ? "border-b border-gold/25 bg-deep/85 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
          : "border-b border-transparent bg-gradient-to-b from-ink/90 via-ink/40 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-[4.75rem] max-w-[1500px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="group relative z-[81] flex shrink-0 items-center gap-3"
          aria-label="Visriva home"
        >
          <span className="absolute -inset-2 rounded-full bg-gold/0 transition duration-500 group-hover:bg-gold/10" />
          <Image
            src="/brand/visriva-green.png"
            alt="Visriva"
            width={320}
            height={320}
            priority
            className="relative h-[3.25rem] w-[3.25rem] object-cover shadow-[0_0_24px_rgba(201,162,39,0.15)] ring-1 ring-gold/60 transition duration-500 group-hover:ring-gold sm:h-[3.5rem] sm:w-[3.5rem]"
          />
          <span className="hidden font-royal text-[0.62rem] uppercase tracking-[0.28em] text-champagne/80 sm:block">
            Live Station
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navigation.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setExperiencesOpen(true)}
                onMouseLeave={() => setExperiencesOpen(false)}
              >
                <button
                  type="button"
                  className={`link-gold font-royal text-[0.72rem] uppercase tracking-[0.28em] ${
                    item.children.some((child) => isCurrent(pathname, child.href))
                      ? "text-gold-2"
                      : "text-cream/88"
                  }`}
                  aria-expanded={experiencesOpen}
                  onFocus={() => setExperiencesOpen(true)}
                >
                  {item.label}
                </button>
                <div
                  className={`absolute left-1/2 top-full w-72 -translate-x-1/2 pt-4 transition duration-200 ${
                    experiencesOpen ? "visible opacity-100" : "invisible opacity-0"
                  }`}
                >
                  <div className="glass-royal p-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-baseline justify-between gap-4 px-3 py-3 transition hover:bg-gold/10"
                      >
                        <span className="text-sm text-cream">{child.label}</span>
                        <span className="font-royal text-[0.58rem] uppercase tracking-[0.18em] text-gold">
                          {child.note}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                className={`link-gold font-royal text-[0.72rem] uppercase tracking-[0.28em] ${
                  isCurrent(pathname, item.href) ? "text-gold-2" : "text-cream/88"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="relative z-[81] flex items-center gap-3">
          <Link
            href="/quote"
            className="group relative hidden overflow-hidden border border-gold/70 bg-gradient-to-b from-gold-2 to-gold px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-deep shadow-[0_8px_28px_rgba(201,162,39,0.2)] transition duration-500 hover:border-gold-3 sm:inline-flex"
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition duration-700 group-hover:translate-x-full"
            />
            <span className="relative">Request Quote</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-gold/40 text-gold lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-gold transition ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-1.5 h-px w-5 bg-gold transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-gold transition ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[75] bg-deep/96 backdrop-blur-xl transition duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col justify-end gap-1 px-6 pb-16 pt-28" aria-label="Mobile">
          {navigation.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <div className="border-t border-gold/20 py-3">
                  <p className="font-royal text-[0.64rem] uppercase tracking-[0.28em] text-gold">
                    {item.label}
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="type-display-italic text-4xl text-cream"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="type-display-italic border-t border-gold/20 py-3 text-4xl text-cream"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <Link
            href="/quote"
            className="mt-6 bg-gold px-5 py-4 text-center text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-deep"
          >
            Request Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
