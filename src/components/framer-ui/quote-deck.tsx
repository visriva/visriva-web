"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HomeQuote } from "@/lib/home-content-types";
import { DEFAULT_HOME_CONTENT } from "@/lib/home-content-types";

export function QuoteDeck({ content }: { content?: HomeQuote }) {
  const c = content ?? DEFAULT_HOME_CONTENT.quote;
  const prompts = c.prompts.length ? c.prompts : DEFAULT_HOME_CONTENT.quote.prompts;
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!prompts.length) return;
    const id = window.setInterval(() => setIndex((v) => (v + 1) % prompts.length), c.rotate_ms);
    return () => window.clearInterval(id);
  }, [prompts.length, c.rotate_ms]);
  useEffect(() => {
    if (index >= prompts.length) setIndex(0);
  }, [index, prompts.length]);
  const item = prompts[index] ?? prompts[0];
  if (!item) return null;
  return (
    <section className="relative overflow-hidden rounded-[1.7rem] border border-[#D4AF37]/25 bg-[linear-gradient(135deg,#0A3326,#041A13)] p-7 shadow-xl sm:p-10" aria-live="polite">
      <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-[#C9A227]/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <p className="section-kicker text-[#E5C158]">{item.eyebrow}</p>
          <div className="flex gap-2">
            {prompts.map((_, i) => (
              <button key={i} type="button" aria-label={`Show idea ${i + 1}`} aria-pressed={index === i} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${index === i ? "w-8 bg-[#D4AF37]" : "w-3 bg-white/30"}`} />
            ))}
          </div>
        </div>
        <h3 className="mt-5 max-w-2xl font-display text-4xl leading-[.98] text-white sm:text-5xl">{item.title}</h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#E6DEC8]">{item.copy}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={c.primary_cta_href} className="liquid-button rounded-full px-6 py-3.5 text-[10px] font-bold uppercase tracking-[.14em]">
            {c.primary_cta_label.replace(/\s*↗\s*$/, "")}
          </Link>
          <button type="button" onClick={() => setIndex((v) => (v + 1) % prompts.length)} className="rounded-full border border-[#D4AF37]/35 px-5 py-3.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#E6DEC8]">
            {c.next_label}
          </button>
        </div>
      </div>
    </section>
  );
}

export function MultiStepProgress({
  steps,
  current,
}: {
  steps: { label: string; helper?: string }[];
  current: number;
}) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li
          key={step.label}
          className={`rounded-2xl border px-4 py-3 transition ${i === current ? "border-[#C9A227] bg-[#0A3326]/80" : i < current ? "border-[#C9A227]/30 bg-white/[0.04]" : "border-white/10 bg-transparent opacity-75"}`}
        >
          <p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#C9A227]">Step {i + 1}</p>
          <p className="mt-1 text-sm font-semibold text-white">{step.label}</p>
          {step.helper ? <p className="mt-1 text-[10px] text-[#E6DEC8]/80">{step.helper}</p> : null}
        </li>
      ))}
    </ol>
  );
}