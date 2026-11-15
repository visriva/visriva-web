"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRightIcon } from "@/components/ArrowUpRightIcon";

export function ActivityBadge({ label = "Studio available", dark = false }: { label?: string; dark?: boolean }) {
  const shell = dark
    ? "border-[#C9A227]/40 bg-[#041A13]/70 text-[#E5C158]"
    : "border-[#C9A227]/40 bg-[#0A3326]/80 text-[#E5C158]";
  return (
    <span className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[9px] font-bold uppercase tracking-[.16em] backdrop-blur-xl ${shell}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E5C158] opacity-40" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#65A878]" />
      </span>
      {label}
    </span>
  );
}

export function TearTicket({ href = "/rate-card", label = "Explore the rate card" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="ticket-link group relative inline-flex items-center gap-4 rounded-xl border border-dashed border-[#C9A227]/45 bg-white/[0.04] px-5 py-4 text-[#E6DEC8] backdrop-blur-xl transition hover:-translate-y-1">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#0A3326] text-xl text-[#E5C158]">✳</span>
      <span>
        <span className="block text-[9px] font-bold uppercase tracking-[.18em] text-[#C9A227]">Your event, your mix</span>
        <span className="mt-1 block text-sm font-semibold text-white">{label}</span>
      </span>
      <ArrowUpRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function LiquidGlassPricingCard({
  name,
  price,
  image,
  footprint,
  href,
  popular,
}: {
  name: string;
  price: string;
  image: string;
  footprint?: string;
  href: string;
  popular?: boolean;
}) {
  return (
    <article className={`glass-footer-panel group overflow-hidden rounded-[1.4rem] p-1 ${popular ? "ring-2 ring-[#E5C158]/50" : ""}`}>
      {popular ? <p className="px-4 pt-3 text-[9px] font-bold uppercase tracking-widest text-[#E5C158]">Most booked</p> : null}
      <div className="relative h-40 overflow-hidden rounded-[1.2rem]">
        <Image src={image} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="320px" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041A13]/90 to-transparent" />
        {footprint ? <span className="absolute bottom-3 left-3 text-[9px] font-semibold uppercase tracking-wider text-[#E5C158]">{footprint}</span> : null}
      </div>
      <div className="p-4">
        <h3 className="font-display text-2xl text-white">{name}</h3>
        <p className="mt-2 font-display text-3xl text-[#E5C158]">{price}</p>
        <Link href={href} className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#E6DEC8]">
          Add to brief
          <ArrowUpRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

export function PaperBackground({ children }: { children: React.ReactNode }) {
  return <div className="paper-surface relative overflow-hidden text-[#E6DEC8]">{children}</div>;
}

export function LiquidGlassFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass-footer-panel rounded-[1.5rem] p-6 backdrop-blur-2xl sm:p-8 ${className}`}>{children}</div>;
}

export function GoogleMapEmbed({ address }: { address?: string }) {
  if (!address)
    return (
      <div className="rounded-2xl border border-dashed border-[#C9A227]/35 bg-white/[0.04] p-5 text-xs leading-6 text-[#E6DEC8]">
        Map location will appear once billing address is set in Site globals.
      </div>
    );
  const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  return (
    <div className="overflow-hidden rounded-2xl border border-[#C9A227]/25 bg-[#0A3326]/40 shadow-lg">
      <iframe title="Visriva billing location map" src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-64 w-full border-0" allowFullScreen />
      <p className="px-4 py-3 text-xs text-[#E6DEC8]">{address}</p>
    </div>
  );
}

export function WhatsAppChatTeaser({ href, phone }: { href: string; phone: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="glass-footer-panel flex items-center gap-3 rounded-2xl p-4 transition hover:border-[#E5C158]/50">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#0A3326] text-[#E5C158]">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Z" />
        </svg>
      </span>
      <span>
        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#C9A227]">WhatsApp studio line</span>
        <span className="text-sm text-white">{phone}</span>
      </span>
      <ArrowUpRightIcon className="ml-auto h-4 w-4 text-[#E5C158]" />
    </a>
  );
}

export type TestimonialItem = { id: string; author: string; quote: string; rating?: number; label?: string };

export function TestimonialsLoopCarousel({ items }: { items: TestimonialItem[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (items.length < 2 || reduce) return;
    const id = window.setInterval(() => setIndex((v) => (v + 1) % items.length), 5500);
    return () => window.clearInterval(id);
  }, [items.length, reduce]);
  if (!items.length) return null;
  const item = items[index] ?? items[0];
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-[#C9A227]/30 bg-[linear-gradient(135deg,#0A3326,#041A13)] p-8 shadow-xl" aria-live="polite">
      <p className="section-kicker text-[#E5C158]">Host voices</p>
      <motion.blockquote key={item.id} initial={reduce ? undefined : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 max-w-3xl font-display text-2xl leading-snug text-white sm:text-3xl">
        &ldquo;{item.quote}&rdquo;
      </motion.blockquote>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          {item.rating ? (
            <p className="mb-2 flex gap-0.5 text-[#E5C158]">
              {Array.from({ length: item.rating }, (_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
              ))}
            </p>
          ) : null}
          <p className="font-semibold text-white">{item.author}</p>
          {item.label ? <p className="text-xs uppercase tracking-wider text-[#E6DEC8]/70">{item.label}</p> : null}
        </div>
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button key={i} type="button" aria-label={`Review ${i + 1}`} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/30"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export type CompareRow = { label: string; values: string[] };

export function ComparisonTable({ headers, rows }: { headers: string[]; rows: CompareRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#C9A227]/25 bg-white/[0.04] backdrop-blur-xl">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th className="w-32 border-b border-[#C9A227]/20 p-3 text-[10px] uppercase tracking-wider text-[#E6DEC8]">Details</th>
            {headers.map((h) => (
              <th key={h} className="border-b border-[#C9A227]/20 p-3 font-display text-xl text-white">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th className="border-b border-white/10 p-3 align-top text-[10px] uppercase tracking-wider text-[#E6DEC8]">{row.label}</th>
              {row.values.map((v, i) => (
                <td key={i} className="border-b border-white/10 p-3 align-top leading-6 text-[#E6DEC8]">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
