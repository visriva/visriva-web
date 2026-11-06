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
      className={`fixed inset-x-0 top-0 z-[80] transition duration-500 ${
        solid || open
          ? "border-b border-gold/20 bg-deep/90 backdrop-blur-xl"
          : "bg-gradient-to-b from-ink/80 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="relative z-[81] shrink-0" aria-label="Visriva home">
          <Image
            src="/brand/visriva-green.png"
            alt="Visriva"
            width={320}
            height={320}
            priority
            className="h-14 w-14 object-cover ring-1 ring-gold/50 sm:h-16 sm:w-16"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
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
                  className={`link-gold font-royal text-[0.68rem] uppercase tracking-[0.24em] ${
                    item.children.some((child) => isCurrent(pathname, child.href))
                      ? "text-gold"
                      : "text-cream/85"
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
                  <div className="border border-gold/30 bg-ink/95 p-2 shadow-2xl backdrop-blur-xl">
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
                className={`link-gold font-royal text-[0.68rem] uppercase tracking-[0.24em] ${
                  isCurrent(pathname, item.href) ? "text-gold" : "text-cream/85"
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
            className="hidden bg-gold px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-deep transition hover:bg-gold-2 sm:inline-flex"
          >
            Request Quote
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
                        className="font-display text-4xl italic text-cream"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="border-t border-gold/20 py-3 font-display text-4xl italic text-cream"
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
