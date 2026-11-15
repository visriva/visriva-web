"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRightIcon } from "@/components/ArrowUpRightIcon";
import { SwipeLettersLink } from "@/components/ui";

const highlights = [
  { title: "Photo experiences", note: "Instant prints and portraits", image: "/images/reception.jpg", href: "/photo-booths" },
  { title: "AI & live merchandise", note: "Personalised keepsakes", image: "/images/workshop.jpg", href: "/ai-merchandise" },
  { title: "VR & interactive games", note: "Play that brings people together", image: "/images/stage.jpg", href: "/games-vr" },
];

type HeroPageContent = {
  eyebrow?: string;
  hero_title?: string;
  hero_accent?: string;
  hero_description?: string;
  hero_image?: string;
  hero_alt?: string;
};

export function Hero({ pageContent }: { pageContent?: HeroPageContent | null }) {
  const [active, setActive] = useState(0);
  const item = highlights[active];
  const title = pageContent?.hero_title || "Make every";
  const accent = pageContent?.hero_accent || "moment memorable.";
  const description =
    pageContent?.hero_description ||
    "Photo experiences, AI transformations, live merchandise and VR games—thoughtfully designed to bring guests into the celebration and give them something to take home.";
  const image = pageContent?.hero_image || item.image;
  const imageAlt = pageContent?.hero_alt || item.title;
  const eyebrow = pageContent?.eyebrow || "Bengaluru's live engagement studio";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#051F17] via-[#093024] to-[#06241B] pb-24 pt-[5.5rem] text-white sm:pt-28">
      <div className="pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-[#C9A227]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-[#0B5A3D]/35 blur-[90px]" />

      <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-10 px-4 sm:gap-12 sm:px-6 lg:min-h-[min(720px,88svh)] lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:px-10 lg:py-16">
        <div className="max-w-[700px]">
          <HeroBadge eyebrow={eyebrow} />
          <h1 className="font-display text-[2.35rem] font-medium leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
            <br />
            <em className="not-italic text-[#E5C158]">{accent}</em>
          </h1>
          <p className="mt-6 max-w-[620px] text-base leading-8 text-white/82 sm:text-lg">{description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <SwipeLettersLink href="/quote" label="Plan your event" className="w-full justify-center sm:w-auto" />
            <Link
              href="/#experiences"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition hover:border-[#E5C158]/50 sm:w-auto"
            >
              Explore experiences
              <ArrowUpRightIcon className="h-4 w-4 text-[#E5C158]" />
            </Link>
          </div>
          <Link
            href="/client-requirements"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#E5C158] underline decoration-[#C9A227]/40 underline-offset-4"
          >
            Venue planning guide
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </Link>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-[10px] font-semibold uppercase tracking-[.14em] text-white/55">
            <span>Corporate celebrations</span>
            <span>Brand activations</span>
            <span>Weddings &amp; private events</span>
            <span>Employee engagement</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[600px]">
          <div className="absolute -inset-4 rounded-[2rem] bg-[#C9A227]/15 blur-2xl" />
          <div className="relative rounded-[2rem] border border-[#C9A227]/35 bg-[#07291E]/80 p-3 shadow-[0_25px_80px_rgba(0,0,0,.45)] sm:p-4">
            <div className="relative h-[min(52vw,360px)] overflow-hidden rounded-[1.5rem] bg-[#041912] sm:h-[400px]">
              <Image
                key={item.image}
                src={image}
                alt={imageAlt}
                fill
                priority
                sizes="(min-width:1024px) 48vw, 92vw"
                className="ken-burns object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051F17]/90 via-transparent to-[#051F17]/20" />
              <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.16em] text-white/90 backdrop-blur">
                The Visriva collection
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <p className="text-[10px] uppercase tracking-[.18em] text-[#E5C158]">{item.note}</p>
                <h2 className="mt-2 font-display text-3xl leading-none sm:text-4xl">{item.title}</h2>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-2 pt-3">
              {highlights.map((highlight, index) => (
                <button
                  type="button"
                  key={highlight.title}
                  onClick={() => setActive(index)}
                  className={`rounded-xl border px-2 py-2.5 text-left text-[9px] font-semibold transition sm:px-3 sm:text-[10px] ${
                    active === index
                      ? "border-[#C9A227] bg-[#C9A227]/15 text-[#F5E6B8]"
                      : "border-white/15 bg-white/5 text-white/65 hover:border-[#C9A227]/40"
                  }`}
                >
                  {highlight.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBadge({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-[#06241B]/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.2em] text-[#E5C158]">
      <span aria-hidden>✦</span>
      {eyebrow}
    </div>
  );
}