"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import { openGoogleReview } from "@/lib/open-google-review";
import type { GoogleReviewSettings } from "@/lib/google-review-types";

type Variant = "page" | "home" | "qr";

type Props = {
  settings: GoogleReviewSettings;
  variant?: Variant;
};

export function VisrivaGoogleReviewSection({ settings, variant = "page" }: Props) {
  const reduce = useReducedMotion();
  const [activeChip, setActiveChip] = useState(settings.prompt_chips[0] ?? "");

  const shell = useMemo(() => {
    if (variant === "qr") return "rounded-[1.75rem] border-2 border-[#C9A227] bg-[#07291E] p-6 sm:p-7";
    if (variant === "home") return "rounded-[2rem] border border-[#CBDCC7] bg-[#F8F7EF] p-7 shadow-[0_20px_60px_rgba(39,67,48,.08)] sm:p-10";
    return "rounded-[2rem] border-2 border-[#C9A227] bg-[#07291E] p-8 shadow-[0_24px_70px_rgba(0,0,0,.35)] sm:p-12";
  }, [variant]);

  if (!settings.enabled) return null;

  const onQr = variant === "qr";
  const onHome = variant === "home";
  const textMain = onHome ? "text-[#244936]" : "text-white";
  const textMuted = onHome ? "text-[#617768]" : "text-white/85";
  const kickerClass = onHome ? "text-[#947D34]" : "text-[#E8D48A]";

  return (
    <section className={variant === "page" ? "w-full" : ""} aria-labelledby="visriva-google-review-title">
      <div className={shell}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <p className={`font-royal text-[0.62rem] uppercase tracking-[0.28em] ${kickerClass}`}>{settings.kicker}</p>
            <h2 id="visriva-google-review-title" className={`mt-3 font-display text-4xl leading-tight sm:text-5xl ${textMain}`}>
              {settings.headline}
              <br />
              <em className={onHome ? "gold-gradient not-italic" : "text-[#E8D48A] not-italic"}>{settings.headline_accent}</em>
            </h2>
            <p className={`mt-4 text-base leading-relaxed ${textMuted}`}>{settings.subtitle}</p>

            <div className={`mt-6 inline-flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${onHome ? "border-[#D7DCCB] bg-white" : "border-[#C9A227]/40 bg-[#041912]"}`}>
              <GoogleGlyph />
              <div>
                <p className={`flex items-center gap-1 font-display text-3xl ${textMain}`}>
                  {settings.rating_value}
                  <StarRow rating={5} small className={onHome ? "text-[#C9A227]" : "text-[#E8D48A]"} />
                </p>
                <p className={`text-xs ${textMuted}`}>{settings.rating_label}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => openGoogleReview(settings.review_url)}
                className={onQr || variant === "page" ? "qr-gold-btn min-h-12 rounded-full px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em]" : "liquid-button min-h-12 rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em]"}
              >
                {settings.cta_primary}
              </button>
              {variant === "page" ? (
                <a
                  href="#review-wall"
                  className={`inline-flex min-h-12 items-center justify-center rounded-full border-2 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.14em] ${onHome ? "border-[#B8CBB4] text-[#355642]" : "border-white/30 text-white"}`}
                >
                  {settings.cta_secondary}
                </a>
              ) : (
                <Link
                  href="/reviews"
                  className={`inline-flex min-h-12 items-center justify-center rounded-full border-2 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.14em] ${onHome ? "border-[#B8CBB4] text-[#355642]" : "border-white/25 text-white"}`}
                >
                  {settings.cta_secondary}
                </Link>
              )}
            </div>

            <p className={`mt-4 text-[11px] leading-relaxed ${textMuted}`}>
              Opens Google in a secure window on desktop. We never embed Google&apos;s review form inside an iframe.
            </p>
          </div>

          <ReviewStudioPanel settings={settings} activeChip={activeChip} onChip={setActiveChip} variant={variant} onLaunch={() => openGoogleReview(settings.review_url)} />
        </div>

        <div id="review-wall" className="mt-10 border-t border-white/10 pt-10">
          <h3 className={`font-display text-2xl ${textMain}`}>{settings.wall_title}</h3>
          <ul className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            {settings.cards.map((card, i) => (
              <motion.li
                key={card.id}
                initial={reduce ? undefined : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                className={`w-[min(88vw,340px)] shrink-0 snap-start rounded-2xl border-2 p-5 ${onHome ? "border-[#D7DCCB] bg-white" : "border-[#C9A227]/30 bg-[#041912]"}`}
              >
                <StarRow rating={card.rating} className={onHome ? "text-[#C9A227]" : "text-[#E8D48A]"} />
                <p className={`mt-3 text-sm leading-relaxed ${textMuted}`}>&ldquo;{card.quote}&rdquo;</p>
                <p className={`mt-4 font-semibold ${textMain}`}>{card.author}</p>
                <p className={`text-[10px] uppercase tracking-wider ${kickerClass}`}>
                  {card.event_label} · {card.date_label}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ReviewStudioPanel({
  settings,
  activeChip,
  onChip,
  variant,
  onLaunch,
}: {
  settings: GoogleReviewSettings;
  activeChip: string;
  onChip: (v: string) => void;
  variant: Variant;
  onLaunch: () => void;
}) {
  const onHome = variant === "home";
  const panel = onHome ? "border-[#D7DCCB] bg-[#E6EFE3]/80" : "border-[#C9A227]/35 bg-[#041912]/90";

  return (
    <div className={`w-full max-w-md rounded-3xl border-2 p-6 ${panel}`}>
      <p className={`font-royal text-[0.55rem] uppercase tracking-[0.22em] ${onHome ? "text-[#947D34]" : "text-[#E8D48A]"}`}>
        Review studio
      </p>
      <p className={`mt-2 font-display text-2xl ${onHome ? "text-[#294937]" : "text-white"}`}>Tap a theme, then review on Google</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {settings.prompt_chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onChip(chip)}
            className={`rounded-full border-2 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] transition ${
              activeChip === chip
                ? onHome
                  ? "border-[#A88F3E] bg-[#E5EDDF] text-[#294937]"
                  : "border-[#C9A227] bg-[#C9A227]/15 text-[#F5E6B8]"
                : onHome
                  ? "border-[#D8E2D3] text-[#607768]"
                  : "border-white/20 text-white/75"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
      <p className={`mt-4 text-sm leading-relaxed ${onHome ? "text-[#617768]" : "text-white/80"}`}>
        {activeChip
          ? `Mention “${activeChip}” in your review if it stood out — our team reads every one.`
          : "Choose what stood out most at your event."}
      </p>
      <button type="button" onClick={onLaunch} className="qr-gold-btn mt-6 w-full min-h-11 rounded-full text-[10px] font-bold uppercase tracking-[0.14em]">
        Continue on Google ↗
      </button>
    </div>
  );
}

function StarRow({ rating, small, className = "" }: { rating: number; small?: boolean; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={small ? "h-4 w-4 fill-current" : "h-5 w-5 fill-current"} aria-hidden />
      ))}
    </span>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}