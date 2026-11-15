"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { ArrowUpRightIcon } from "@/components/ArrowUpRightIcon";
import { SwipeLettersLink } from "@/components/ui";
import { VISRIVA_SPRING } from "@/components/framer-ui/motion";

export function SwipeLettersButton(props: { href: string; label: string; className?: string }) {
  return <SwipeLettersLink {...props} />;
}

export function CamoLiquidButton({
  label = "Search",
  onClick,
  expanded,
}: {
  label?: string;
  onClick: () => void;
  expanded?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      whileTap={{ scale: 0.96 }}
      transition={VISRIVA_SPRING}
      className="liquid-glass-btn group inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A227]/45 bg-[linear-gradient(145deg,#0A3326,#041A13)] text-[#E5C158] shadow-lg lg:h-11 lg:w-auto lg:gap-2 lg:px-4"
    >
      <Search className="h-4 w-4" strokeWidth={1.75} />
      <span className="hidden text-[10px] font-bold uppercase tracking-[.14em] lg:inline">{label}</span>
    </motion.button>
  );
}

export function WaveRevealButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="wave-button group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[#D4AF37]/60 bg-[#0B3D2E] px-7 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#F5F0E5] shadow-[0_12px_32px_rgba(0,0,0,.32)] transition hover:-translate-y-1"
    >
      <span className="wave-button-fill absolute inset-x-0 bottom-0 h-0 bg-[#D4AF37] transition-[height] duration-500 group-hover:h-full" />
      <span className="relative z-10 transition-colors group-hover:text-[#07110D]">{label}</span>
      <ArrowUpRightIcon className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

export function LiquidGlassButton({ href, children, className = "" }: { href?: string; children: React.ReactNode; className?: string }) {
  const shell = `liquid-glass-btn inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A227]/35 bg-white/[0.04] px-6 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#E6DEC8] backdrop-blur-2xl ${className}`;
  return href ? (
    <Link href={href} className={shell}>
      {children}
    </Link>
  ) : (
    <button type="button" className={shell}>
      {children}
    </button>
  );
}

export function DotButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="group relative grid h-11 w-11 place-items-center rounded-full border border-[#C9A227]/35 bg-white/[0.04] backdrop-blur-xl transition hover:-translate-y-1">
      <span className="h-2 w-2 rounded-full bg-[#E5C158] transition group-hover:scale-[2.2] group-hover:opacity-0" />
      <ArrowUpRightIcon className="absolute h-3.5 w-3.5 scale-0 text-[#E5C158] transition group-hover:scale-100" />
    </button>
  );
}

export function LightBulbButton({ children = "Need a hand?" }: { children?: React.ReactNode }) {
  const [on, setOn] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={on}
        onClick={() => setOn((v) => !v)}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-xs font-semibold transition ${on ? "border-[#E5C158] bg-[#E5C158]/15 text-[#E5C158] shadow-[0_0_24px_rgba(229,193,88,.35)]" : "border-[#C9A227]/35 bg-white/[0.04] text-[#E6DEC8]"}`}
      >
        <span aria-hidden>💡</span>
        {children}
      </button>
      {on ? (
        <div className="absolute bottom-full right-0 z-30 mb-3 w-72 rounded-2xl border border-[#C9A227]/30 bg-[#041A13] p-4 text-sm leading-6 text-[#E6DEC8] shadow-xl">
          <strong className="text-white">Password hint</strong>
          <p className="mt-1">Event photo vault passwords are usually your event date in DDMM format (e.g. 14 Nov → 1411).</p>
        </div>
      ) : null}
    </div>
  );
}

export function BackTrigger() {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) window.history.back();
        else window.location.assign("/");
      }}
      className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/35 bg-white/[0.04] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#E6DEC8] transition hover:border-[#E5C158] hover:-translate-x-0.5"
    >
      ← Back
    </button>
  );
}

type SubmitPhase = "idle" | "pending" | "success";

export function MotionSubmitButton({
  children = "Send enquiry",
  pending = false,
  success = false,
  onClick,
}: {
  children?: React.ReactNode;
  pending?: boolean;
  success?: boolean;
  onClick?: () => void;
}) {
  const phase: SubmitPhase = success ? "success" : pending ? "pending" : "idle";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={pending || success}
      whileTap={phase === "idle" ? { scale: 0.98 } : undefined}
      transition={VISRIVA_SPRING}
      className="liquid-button group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-[.15em] disabled:cursor-wait disabled:opacity-90"
    >
      <span>
        {phase === "pending" ? "Sending…" : phase === "success" ? "Sent" : children}
      </span>
      {phase === "pending" ? <Loader2 className="h-4 w-4 animate-spin" /> : phase === "success" ? <Check className="h-4 w-4" /> : <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
    </motion.button>
  );
}