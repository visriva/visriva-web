"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Gift,
  MessageCircle,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useCallback, useState } from "react";
import { FadeUp } from "@/components/qr/FadeUp";
import { QrGiveawayForm } from "@/components/qr/QrGiveawayForm";
import type { QrPageSettings } from "@/lib/qr-constants";

function canEmbedExternalForm(url: string | null): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host.includes("docs.google.com") ||
      host === "forms.gle" ||
      host.endsWith("typeform.com") ||
      host.endsWith("tally.so")
    );
  } catch {
    return false;
  }
}

const STEPS = [
  { n: "01", title: "Scan at the Station", copy: "You're already here!" },
  { n: "02", title: "Tag Us on Instagram", copy: "Post your station moment & tag @visriva.co — snap a screenshot." },
  { n: "03", title: "Submit Your Entry", copy: "Fill in your details below in under 30 seconds." },
  { n: "04", title: "Weekly Winner Reveal", copy: "Winners announced every week with live reaction reels!" },
] as const;

const WINNERS = [
  { name: "Ananya R.", station: "Live Photo Booth", event: "Tech town hall", week: "Week 42" },
  { name: "Rohan K.", station: "DTF T-Shirt Printing", event: "Brand activation", week: "Week 41" },
  { name: "Priya S.", station: "AI Station", event: "Corporate gala", week: "Week 40" },
  { name: "Dev M.", station: "VR Gaming", event: "Product launch", week: "Week 39" },
] as const;

const RULES = [
  "Follow & tag @visriva.co on Instagram with your station moment.",
  "One entry per person per week.",
  "Winner selected & announced every week on @visrivalivestation.",
  "Prize: Branded Visriva hamper (custom photo magnet or keychain + curated goodies).",
] as const;

type Props = {
  settings: QrPageSettings;
  whatsappDigits: string;
  whatsappHref: string;
};

export function QrExperience({ settings, whatsappDigits, whatsappHref }: Props) {
  const useExternal = settings.form_mode === "external" && Boolean(settings.external_form_url);
  const embed = useExternal && canEmbedExternalForm(settings.external_form_url);
  const externalUrl = settings.external_form_url ?? "";

  const scrollToEntry = useCallback(() => {
    document.getElementById("qr-entry")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="relative min-h-[100svh] overflow-x-hidden bg-[linear-gradient(180deg,#06241B_0%,#0B3D2E_45%,#06241B_100%)] text-[#F8F9FA]">
      <div className="pointer-events-none absolute inset-0 opacity-40 hero-grid" aria-hidden />
      <main className="relative z-10 mx-auto max-w-lg px-4 pb-16 pt-10 sm:max-w-xl sm:px-6 sm:pt-14">
        <FadeUp className="text-center">
          <div className="mx-auto flex flex-col items-center gap-3">
            <Image src="/brand/visriva-logo.png" alt="Visriva emblem" width={72} height={72} className="h-[4.5rem] w-[4.5rem] object-contain" priority />
            <span className="font-display text-4xl tracking-wide text-[#E5C158]">visriva</span>
          </div>
          <p className="mt-4 font-royal text-[0.62rem] uppercase tracking-[0.28em] text-[#C9A227]">Guest QR experience</p>
          <h1 className="mt-3 font-display text-[2.1rem] leading-tight text-[#F8F9FA] sm:text-4xl">
            Win a Curated <span className="italic text-[#E5C158]">Visriva Hamper</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#B8C2B4]">
            Thank you for visiting our live station! Enter our weekly giveaway in 30 seconds for a chance to win custom keepsakes &amp; luxury goodies.
          </p>
          <button
            type="button"
            onClick={scrollToEntry}
            className="liquid-button mt-8 min-h-12 rounded-full px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em]"
          >
            Enter weekly giveaway ↓
          </button>
        </FadeUp>

        <FadeUp className="mt-10" delay={80}>
          <div className="rounded-3xl border border-[#C9A227]/35 bg-white/5 p-5 backdrop-blur-md sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#C9A227]/40 bg-[#0B3D2E]/80 text-[#C9A227]">
                <MessageCircle className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold leading-snug text-[#F8F9FA]">
                  <strong>You can send your physical copy photo on WhatsApp — our team will send you a soft copy!</strong>
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-button mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em]"
                >
                  Send on WhatsApp
                </a>
                <p className="mt-2 text-[10px] text-[#8FA89B]">+{whatsappDigits.replace(/^91/, "91 ")}</p>
              </div>
            </div>
          </div>
        </FadeUp>

        <FadeUp className="mt-12" delay={120}>
          <p className="section-kicker text-center">How it works</p>
          <ol className="mt-5 space-y-3">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="flex gap-4 rounded-2xl border border-[#C9A227]/20 bg-[#06241B]/50 p-4 backdrop-blur-sm"
              >
                <span className="font-display text-2xl text-[#C9A227]">{step.n}</span>
                <div>
                  <p className="font-display text-xl text-[#F4F0DF]">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#B8C2B4]">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </FadeUp>

        <FadeUp className="mt-12" delay={160}>
          <div className="rounded-3xl border border-[#C9A227]/30 bg-white/5 p-5 backdrop-blur-md sm:p-7">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-[#C9A227]" aria-hidden />
              <p className="section-kicker">Weekly giveaway entry</p>
            </div>

            {useExternal ? (
              <ExternalEntry url={externalUrl} embed={embed} />
            ) : (
              <div className="mt-5">
                <QrGiveawayForm />
              </div>
            )}
          </div>
        </FadeUp>

        <FadeUp className="mt-10" delay={200}>
          <HamperCard />
        </FadeUp>

        <FadeUp className="mt-12" delay={240}>
          <WinnersCarousel />
        </FadeUp>

        <FadeUp className="mt-12" delay={280}>
          <div className="rounded-3xl border border-[#C9A227]/25 bg-[linear-gradient(135deg,rgba(201,162,39,0.08),rgba(11,61,46,0.6))] p-6 text-center backdrop-blur-md">
            <Sparkles className="mx-auto h-6 w-6 text-[#E5C158]" aria-hidden />
            <p className="mt-3 font-display text-2xl text-[#F8F9FA]">Planning a corporate event, wedding, or brand activation?</p>
            <p className="mt-2 text-sm text-[#B8C2B4]">Bring Visriva&apos;s live gifting &amp; tech stations to your guests.</p>
            <Link href="/quote" className="liquid-button mt-6 inline-flex min-h-11 items-center rounded-full px-7 py-3 text-[10px] font-bold uppercase tracking-[0.14em]">
              Get a free station quote ↗
            </Link>
          </div>
        </FadeUp>

        <FadeUp className="mt-10" delay={320}>
          <RulesAccordion />
        </FadeUp>
      </main>
    </div>
  );
}

function ExternalEntry({ url, embed }: { url: string; embed: boolean }) {
  return (
    <div className="mt-5 space-y-4">
      <p className="text-sm leading-relaxed text-[#B8C2B4]">
        Complete your official giveaway entry on our secure form — takes under a minute.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="liquid-button flex min-h-12 w-full items-center justify-center rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.14em]"
      >
        Complete your official giveaway entry ↗
      </a>
      {embed ? (
        <iframe
          title="Visriva giveaway form"
          src={url}
          className="mt-4 h-[min(70vh,520px)] w-full rounded-2xl border border-[#C9A227]/25 bg-[#06241B]"
          loading="lazy"
        />
      ) : null}
    </div>
  );
}

function HamperCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#C9A227]/35 bg-[#06241B]/70 p-6 backdrop-blur-md">
      <span className="pointer-events-none absolute left-3 top-3 h-8 w-8 border-l-2 border-t-2 border-[#C9A227]/50" aria-hidden />
      <span className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 border-b-2 border-r-2 border-[#C9A227]/50" aria-hidden />
      <p className="section-kicker">This week&apos;s hamper</p>
      <h2 className="mt-2 font-display text-3xl text-[#F8F9FA]">Custom keepsakes + curated luxury</h2>
      <ul className="mt-4 space-y-2 text-sm text-[#E9DFBD]">
        <li>✳ Custom photo magnet or keychain from your event moment</li>
        <li>✳ Curated Visriva luxury goodies &amp; studio surprises</li>
        <li>✳ Delivered across Bengaluru with a personal note</li>
      </ul>
      <div className="mt-5 grid h-36 place-items-center rounded-2xl border border-dashed border-[#C9A227]/30 bg-[#0B3D2E]/50 text-xs uppercase tracking-widest text-[#8FA89B]">
        Hamper visual — add winner photo / reel
      </div>
    </div>
  );
}

function WinnersCarousel() {
  const [index, setIndex] = useState(0);
  const winner = WINNERS[index];

  return (
    <section aria-labelledby="winners-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Weekly winners</p>
          <h2 id="winners-heading" className="mt-1 font-display text-3xl text-[#F8F9FA]">
            The Winners Wall
          </h2>
        </div>
        <Trophy className="h-6 w-6 text-[#C9A227]" aria-hidden />
      </div>

      <div className="mt-5 rounded-3xl border border-[#C9A227]/25 bg-white/5 p-4 backdrop-blur-md sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Previous winner"
            onClick={() => setIndex((v) => (v === 0 ? WINNERS.length - 1 : v - 1))}
            className="deck-arrow min-h-11 min-w-11"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="rounded-full border border-[#C9A227]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E5C158]">
            {winner.week}
          </span>
          <button
            type="button"
            aria-label="Next winner"
            onClick={() => setIndex((v) => (v + 1) % WINNERS.length)}
            className="deck-arrow min-h-11 min-w-11"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[140px_1fr]">
          <div className="grid aspect-square place-items-center rounded-2xl border border-dashed border-[#C9A227]/35 bg-[#06241B]/80 text-[10px] uppercase tracking-wider text-[#8FA89B]">
            Winner photo / reel
          </div>
          <div>
            <p className="font-display text-2xl text-[#F4F0DF]">{winner.name}</p>
            <p className="mt-1 text-sm text-[#E5C158]">{winner.station}</p>
            <p className="mt-2 text-xs text-[#B8C2B4]">{winner.event}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {WINNERS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show winner ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-[#C9A227]" : "w-2 bg-[#5B665D]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RulesAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[#C9A227]/20 bg-[#06241B]/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-12 w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#E9DFBD]"
        aria-expanded={open}
      >
        Rules &amp; terms
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open ? (
        <ul className="space-y-2 border-t border-[#C9A227]/15 px-4 py-4 text-xs leading-relaxed text-[#B8C2B4]">
          {RULES.map((rule) => (
            <li key={rule}>• {rule}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}