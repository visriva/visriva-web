"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Gift, MessageCircle, Sparkles, Trophy } from "lucide-react";
import { useCallback, useState } from "react";
import { QrGiveawayForm } from "@/components/qr/QrGiveawayForm";
import { QrMediaImage } from "@/components/qr/QrMediaImage";
import type { QrPageContent, QrSectionId } from "@/lib/qr-content-types";
import { visibleQrSectionIds } from "@/lib/qr-content-types";
import type { QrPageSettings } from "@/lib/qr-constants";
import type { EventPhotosSettings } from "@/lib/event-galleries-types";
import { QrEventPhotosSection } from "@/components/qr/QrEventPhotosSection";

function canEmbedExternalForm(url: string | null): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.includes("docs.google.com") || host === "forms.gle" || host.endsWith("typeform.com") || host.endsWith("tally.so");
  } catch {
    return false;
  }
}

type Props = {
  content: QrPageContent;
  settings: QrPageSettings;
  whatsappHref: string;
  phoneDisplay: string;
  eventPhotosSettings: EventPhotosSettings;
};

export function QrExperience({ content, settings, whatsappHref, phoneDisplay, eventPhotosSettings }: Props) {
  const reduce = useReducedMotion();
  const useExternal = settings.form_mode === "external" && Boolean(settings.external_form_url);
  const embed = useExternal && canEmbedExternalForm(settings.external_form_url);
  const externalUrl = settings.external_form_url ?? "";
  const sectionOrder = visibleQrSectionIds(content);

  const scrollToEntry = useCallback(() => {
    document.getElementById("qr-entry")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const stagger: Variants = reduce ? { hidden: {}, show: {} } : { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item: Variants = reduce
    ? { hidden: {}, show: {} }
    : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } };

  return (
    <div className="qr-luxury-bg relative min-h-[100svh] overflow-x-hidden text-cream">
      <div className="qr-gold-orb -left-16 top-24 h-56 w-56" aria-hidden />
      <div className="qr-gold-orb right-0 top-[42%] h-72 w-72" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-35 hero-grid" aria-hidden />

      <motion.main variants={stagger} initial="hidden" animate="show" className="relative z-10 mx-auto max-w-lg px-4 pb-20 pt-12 sm:max-w-xl sm:px-6 sm:pt-16">
        <motion.div variants={item}>
          <QrEventPhotosSection initialSettings={eventPhotosSettings} />
        </motion.div>
        {sectionOrder.map((id) => (
          <motion.div key={id} variants={item} className={id === "hero" ? "" : "mt-10 sm:mt-12"}>
            <QrSectionBlock
              id={id}
              content={content}
              useExternal={useExternal}
              embed={embed}
              externalUrl={externalUrl}
              whatsappHref={whatsappHref}
              phoneDisplay={phoneDisplay}
              onScrollEntry={scrollToEntry}
            />
          </motion.div>
        ))}
      </motion.main>
    </div>
  );
}

function QrSectionBlock({
  id,
  content,
  useExternal,
  embed,
  externalUrl,
  whatsappHref,
  phoneDisplay,
  onScrollEntry,
}: {
  id: QrSectionId;
  content: QrPageContent;
  useExternal: boolean;
  embed: boolean;
  externalUrl: string;
  whatsappHref: string;
  phoneDisplay: string;
  onScrollEntry: () => void;
}) {
  switch (id) {
    case "hero":
      return (
        <section className="text-center">
          <LuxuryCard className="relative mx-auto max-w-md rounded-[2rem] px-6 py-10">
            <QrMediaImage src={content.hero.logo_url} alt={content.hero.logo_alt} className="mx-auto h-[4.5rem] w-[4.5rem] object-contain" width={72} height={72} />
            <p className="mt-3 font-display text-4xl tracking-wide text-gold-2">{content.hero.wordmark}</p>
            <p className="mt-4 font-royal text-[0.62rem] uppercase tracking-[0.28em] text-gold">{content.hero.badge}</p>
            <h1 className="mt-4 font-display text-[2.15rem] leading-tight text-cream sm:text-4xl">
              {content.hero.title} <span className="italic text-gold-2">{content.hero.title_accent}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/85">{content.hero.subtitle}</p>
            <button type="button" onClick={onScrollEntry} className="qr-gold-btn mt-8 min-h-12 rounded-full px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em]">
              {content.hero.cta_text}
            </button>
          </LuxuryCard>
        </section>
      );
    case "whatsapp":
      return (
        <section>
          <LuxuryCard className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-deep/80 text-gold">
                <MessageCircle className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug text-cream">{content.whatsapp.body}</p>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="qr-gold-btn mt-4 inline-flex min-h-11 items-center rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em]">
                  {content.whatsapp.button_text}
                </a>
                {phoneDisplay ? <p className="mt-2 text-[10px] text-mist">{phoneDisplay}</p> : null}
              </div>
            </div>
          </LuxuryCard>
        </section>
      );
    case "steps":
      return (
        <section>
          <p className="section-kicker text-center">{content.steps.kicker}</p>
          <ol className="mt-5 space-y-3">
            {content.steps.items.map((step) => (
              <li key={`${step.number}-${step.title}`} className="qr-glass-card flex gap-4 rounded-2xl p-4">
                <span className="font-display text-2xl text-gold">{step.number}</span>
                <div>
                  <p className="font-display text-xl text-champagne">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-mist">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      );
    case "entry":
      return (
        <section>
          <LuxuryCard className="p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-gold" aria-hidden />
              <p className="section-kicker">{content.entry.kicker}</p>
            </div>
            {useExternal ? (
              <ExternalEntry content={content} url={externalUrl} embed={embed} />
            ) : (
              <div className="mt-5">
                <QrGiveawayForm copy={content.form} stations={content.station_options} />
              </div>
            )}
          </LuxuryCard>
        </section>
      );
    case "hamper":
      return (
        <section>
          <HamperCard content={content} />
        </section>
      );
    case "winners":
      return (
        <section>
          <WinnersCarousel content={content} />
        </section>
      );
    case "b2b":
      return (
        <section>
          <LuxuryCard className="p-6 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-gold-2" aria-hidden />
            <p className="mt-3 font-display text-2xl text-cream">{content.b2b.title}</p>
            <p className="mt-2 text-sm text-mist">{content.b2b.body}</p>
            <Link href={content.b2b.cta_href} className="qr-gold-btn mt-6 inline-flex min-h-11 items-center rounded-full px-7 py-3 text-[10px] font-bold uppercase tracking-[0.14em]">
              {content.b2b.cta_text}
            </Link>
          </LuxuryCard>
        </section>
      );
    case "rules":
      return (
        <section>
          <RulesAccordion content={content} />
        </section>
      );
    default:
      return null;
  }
}

function LuxuryCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`qr-glass-card relative overflow-hidden rounded-3xl ${className}`}>
      <span className="qr-corner left-3 top-3 border-l border-t" aria-hidden />
      <span className="qr-corner bottom-3 right-3 border-b border-r" aria-hidden />
      {children}
    </div>
  );
}

function ExternalEntry({ content, url, embed }: { content: QrPageContent; url: string; embed: boolean }) {
  return (
    <div className="mt-5 space-y-4">
      <p className="text-sm leading-relaxed text-mist">{content.entry.external_body}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="qr-gold-btn flex min-h-12 w-full items-center justify-center rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.14em]">
        {content.entry.external_button}
      </a>
      {embed ? <iframe title={content.entry.iframe_title} src={url} className="mt-4 h-[min(70vh,520px)] w-full rounded-2xl border border-gold/25 bg-ink" loading="lazy" /> : null}
    </div>
  );
}

function HamperCard({ content }: { content: QrPageContent }) {
  const cards = content.hamper.prize_cards.length
    ? content.hamper.prize_cards
    : content.hamper.bullets.map((line) => ({ title: line, description: "", image_url: "", image_alt: line }));

  return (
    <LuxuryCard className="relative p-6">
      <div className="qr-gold-orb -right-8 top-8 h-40 w-40 opacity-80" aria-hidden />
      <p className="section-kicker">{content.hamper.kicker}</p>
      <h2 className="mt-2 font-display text-3xl text-cream">{content.hamper.title}</h2>
      {content.hamper.prize_cards.length === 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-champagne">
          {content.hamper.bullets.map((line) => (
            <li key={line}>✳ {line}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {cards.map((card, i) => (
            <div key={`${card.title}-${i}`} className="rounded-2xl border border-gold/20 bg-deep/40 p-3">
              {card.image_url ? (
                <QrMediaImage src={card.image_url} alt={card.image_alt} className="h-28 w-full rounded-xl object-cover" width={400} height={224} />
              ) : null}
              <p className="mt-2 font-display text-lg text-champagne">{card.title}</p>
              {card.description ? <p className="mt-1 text-xs text-mist">{card.description}</p> : null}
            </div>
          ))}
        </div>
      )}
      {content.hamper.image_url ? (
        <QrMediaImage src={content.hamper.image_url} alt={content.hamper.image_alt} className="mt-5 h-44 w-full rounded-2xl object-cover" width={800} height={440} />
      ) : (
        <div className="mt-5 grid h-36 place-items-center rounded-2xl border border-dashed border-gold/30 bg-deep/50 px-4 text-center text-[10px] uppercase tracking-widest text-mist">
          {content.hamper.image_fallback_label}
        </div>
      )}
    </LuxuryCard>
  );
}

function WinnersCarousel({ content }: { content: QrPageContent }) {
  const items = content.winners.items;
  const [index, setIndex] = useState(0);
  const winner = items[index] ?? items[0];
  if (!winner) return null;

  return (
    <section aria-labelledby="winners-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">{content.winners.kicker}</p>
          <h2 id="winners-heading" className="mt-1 font-display text-3xl text-cream">
            {content.winners.title}
          </h2>
        </div>
        <Trophy className="h-6 w-6 text-gold" aria-hidden />
      </div>
      <LuxuryCard className="mt-5 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <button type="button" aria-label="Previous winner" onClick={() => setIndex((v) => (v === 0 ? items.length - 1 : v - 1))} className="deck-arrow min-h-11 min-w-11">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="rounded-full border border-gold/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-2">{winner.week}</span>
          <button type="button" aria-label="Next winner" onClick={() => setIndex((v) => (v + 1) % items.length)} className="deck-arrow min-h-11 min-w-11">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-[140px_1fr]">
          {winner.image_url ? (
            <QrMediaImage src={winner.image_url} alt={winner.image_alt} className="aspect-square w-full rounded-2xl object-cover" width={280} height={280} />
          ) : (
            <div className="grid aspect-square place-items-center rounded-2xl border border-dashed border-gold/35 bg-ink/80 px-2 text-center text-[10px] uppercase tracking-wider text-mist">
              {winner.image_alt}
            </div>
          )}
          <div>
            <p className="font-display text-2xl text-champagne">{winner.name}</p>
            <p className="mt-1 text-sm text-gold-2">{winner.station}</p>
            <p className="mt-2 text-xs text-mist">{winner.event}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {items.map((_, i) => (
            <button key={i} type="button" aria-label={`Show winner ${i + 1}`} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-gold" : "w-2 bg-mist/40"}`} />
          ))}
        </div>
      </LuxuryCard>
    </section>
  );
}

function RulesAccordion({ content }: { content: QrPageContent }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="qr-glass-card rounded-2xl">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-h-12 w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-champagne" aria-expanded={open}>
        {content.rules.title}
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open ? (
        <ul className="space-y-2 border-t border-gold/15 px-4 py-4 text-xs leading-relaxed text-mist">
          {content.rules.items.map((rule) => (
            <li key={rule}>• {rule}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}