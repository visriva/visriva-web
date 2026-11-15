"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { mobileDrawerNav } from "@/lib/public-nav";
import { BOUNCY_PILL_SPRING, ISLAND_SPRING, STATION_FILTER_SPRING, VISRIVA_SPRING, liquidGlassShell, liquidGlassShellScrolled } from "@/components/framer-ui/motion";

export function LiquidGlassNavbarShell({
  scrolled,
  children,
  className = "",
}: {
  scrolled: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`fixed top-3 inset-x-0 z-[100] mx-auto max-w-7xl px-3 transition-colors duration-300 sm:top-5 sm:px-6 ${className}`}
    >
      <motion.div
        layout
        transition={VISRIVA_SPRING}
        className={`flex items-center justify-between gap-2 rounded-full px-3 py-2.5 sm:gap-3 sm:px-4 lg:px-6 ${
          scrolled ? `bg-[#041812]/80 ${liquidGlassShellScrolled}` : `bg-[#06241B]/40 ${liquidGlassShell}`
        }`}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function BouncyNavPill({
  items,
  active,
  onChange,
  ariaLabel = "Filter",
  layoutId = "visriva-bouncy-pill",
  dark = false,
  variant = "default",
  pillTransition,
}: {
  items: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
  layoutId?: string;
  dark?: boolean;
  variant?: "default" | "frosted-gold";
  pillTransition?: { type: "spring"; stiffness: number; damping: number; mass?: number };
}) {
  const spring = pillTransition ?? (layoutId === "stationFilterPill" ? STATION_FILTER_SPRING : BOUNCY_PILL_SPRING);
  const shell =
    variant === "frosted-gold"
      ? "border border-[#C9A227]/35 bg-[#F8F7EF]/45 shadow-[0_8px_32px_rgba(39,67,48,.08),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-xl backdrop-saturate-150"
      : dark
        ? "border-[#C9A227]/35 bg-[#041A13]/80"
        : "border-white/80 bg-[#F8F7EF]/90";
  const activeText = variant === "frosted-gold" ? "text-[#2A3D31]" : dark ? "text-[#051C15]" : "text-white";
  const idleText = variant === "frosted-gold" ? "text-[#607768]" : dark ? "text-white/70" : "text-[#607768]";
  const activePillClass =
    variant === "frosted-gold"
      ? "bg-gradient-to-r from-[#C9A227]/95 to-[#E5C158]/88 shadow-[0_6px_22px_rgba(201,162,39,.35),inset_0_1px_1px_rgba(255,255,255,0.55)] backdrop-blur-md"
      : dark
        ? "bg-gradient-to-r from-[#C9A227] to-[#E5C158]"
        : "bg-[#294937]";

  return (
    <div
      className={`relative flex max-w-full gap-1 overflow-x-auto rounded-full border p-1.5 scrollbar-none ${shell}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative shrink-0 rounded-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.12em] transition-colors sm:px-5 ${isActive ? activeText : `${idleText} hover:text-white`}`}
          >
            {isActive ? (
              <motion.span layoutId={layoutId} transition={spring} className={`absolute inset-0 rounded-full ${activePillClass}`} />
            ) : null}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function DesignStudioNav({
  items,
  activeHref,
  numbered = false,
}: {
  items: { href: string; label: string }[];
  activeHref?: string;
  numbered?: boolean;
}) {
  return (
    <nav className="nova-glow-nav flex max-w-full gap-2 overflow-x-auto rounded-2xl border border-[#C9A227]/25 bg-[#0A3326]/60 p-2 scrollbar-none backdrop-blur-2xl" aria-label="Section navigation">
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          className={`nova-glow-link shrink-0 rounded-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.12em] transition ${activeHref === item.href ? "bg-[#294937] text-white" : "text-[#E6DEC8] hover:bg-white/10 hover:text-white"}`}
        >
          {numbered ? `${String(i + 1).padStart(2, "0")} ` : ""}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function NovaGlowNav(props: Parameters<typeof DesignStudioNav>[0]) {
  return <DesignStudioNav {...props} />;
}

export function ModernNavbar({ title, items }: { title?: string; items: { href: string; label: string }[] }) {
  return (
    <div className="sticky top-[4.5rem] z-40 border-b border-[#C9A227]/20 bg-[#041A13]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {title ? <p className="font-royal text-[10px] uppercase tracking-[.22em] text-[#E5C158]">{title}</p> : null}
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#E6DEC8] hover:text-[#E5C158]">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DynamicIslandNav({ active = "Overview", onOpenMenu }: { active?: string; onOpenMenu?: () => void }) {
  const [open, setOpen] = useState(false);
  const items = [
    ["Overview", "/#content"],
    ["Experiences", "/#experiences"],
    ["Rate card", "/rate-card"],
    ["Gallery", "/gallery"],
    ["Plan event", "/quote"],
  ] as const;

  return (
    <motion.div layout transition={VISRIVA_SPRING} className="dynamic-island relative z-20 mx-auto w-fit max-w-[calc(100vw-2rem)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="glass-nav flex w-full items-center justify-between gap-3 rounded-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#E6DEC8] sm:px-5 sm:py-3"
      >
        <span className="flex items-center gap-2">
          <Image src="/brand/visriva-logo.png" alt="" width={72} height={28} className="h-6 w-auto lg:hidden" />
          <span className="h-2 w-2 rounded-full bg-[#E5C158]" />
          <span className="truncate">{active}</span>
        </span>
        <span className="flex items-center gap-2">
          {onOpenMenu ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onOpenMenu();
              }}
              onKeyDown={(e) => e.key === "Enter" && onOpenMenu()}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#C9A227]/40 lg:hidden"
            >
              <Menu className="h-4 w-4 text-[#E5C158]" />
            </span>
          ) : null}
          <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
        </span>
      </button>
      {open ? (
        <nav className="glass-nav absolute left-0 right-0 top-full mt-2 flex flex-col gap-1 rounded-2xl p-2 shadow-xl sm:left-1/2 sm:right-auto sm:w-64 sm:-translate-x-1/2">
          {items.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-xs text-[#E6DEC8] hover:bg-white/10 hover:text-[#E5C158]">
              {label}
            </Link>
          ))}
        </nav>
      ) : null}
    </motion.div>
  );
}

export function MobileDesignDrawer({
  open,
  onClose,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const shell = (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.div
          key="mobile-drawer"
          className="fixed inset-0 z-[999] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.button
            type="button"
            aria-label="Close menu backdrop"
            className="absolute inset-0 cursor-default bg-[#041812]/88 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-y-0 right-0 flex w-full max-w-[100vw] flex-col bg-[#041812] p-6 text-white shadow-2xl sm:max-w-md"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={ISLAND_SPRING}
          >
            <div className="flex items-center justify-between border-b border-[#C9A227]/25 pb-5">
              <Image src="/brand/visriva-logo.png" alt="Visriva" width={100} height={40} className="h-9 w-auto" />
              <button type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full border border-[#C9A227]/40">
                <X className="h-5 w-5 text-[#E5C158]" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-8">
              {mobileDrawerNav.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-4 border-b border-white/10 py-4 font-display text-2xl text-[#F4F0DF] hover:text-[#E5C158]"
                >
                  <span className="font-royal text-xs text-[#C9A227]">{String(i + 1).padStart(2, "0")}</span>
                  {link.label}
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-60" />
                </Link>
              ))}
            </nav>
            {footer}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return createPortal(shell, document.body);
}