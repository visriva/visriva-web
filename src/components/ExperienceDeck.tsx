"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Service, ServiceCategory } from "@/lib/services";
import { categoryMeta } from "@/lib/services";

const tabs: { id: "all" | ServiceCategory; label: string }[] = [
  { id: "all", label: "All experiences" },
  { id: "photo-booths", label: "Photo experiences" },
  { id: "ai-merchandise", label: "AI & live merch" },
  { id: "games", label: "VR & games" },
];

export function ExperienceDeck({ services }: { services: Service[] }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("all");
  const [flipped, setFlipped] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const filtered = useMemo(() => active === "all" ? services : services.filter((item) => item.category === active), [active, services]);
  const visible = filtered.slice(index, index + 3);
  const maxIndex = Math.max(0, filtered.length - 3);

  function changeTab(id: (typeof tabs)[number]["id"]) {
    setActive(id); setIndex(0); setFlipped(null);
  }

  return (
    <section id="experiences" className="relative overflow-hidden bg-[#003F26] px-5 py-24 text-[#F5F0DF] sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-[#0B6A47]/20 blur-[120px]" />
      <div className="relative mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div><p className="section-kicker">The Visriva experience collection</p><h2 className="mt-4 max-w-3xl font-display text-6xl leading-[.9] sm:text-7xl">Pick the moment.<br/><em className="gold-gradient">We make it happen.</em></h2></div>
          <p className="max-w-md text-sm leading-7 text-[#D2DED3]">Browse our live stations, interactive photo experiences and custom keepsake bars. Tap any card to see what guests get to experience.</p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="bouncy-tabs flex max-w-full gap-2 overflow-x-auto rounded-full border border-[#B8A04D]/30 bg-[#052F20]/75 p-1.5 scrollbar-none" role="tablist" aria-label="Filter experiences">
            {tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={active === tab.id} onClick={() => changeTab(tab.id)} className={`bouncy-tab shrink-0 rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-[.14em] transition-all ${active === tab.id ? "is-active bg-[#B8A04D] text-[#003F26] shadow-[0_5px_20px_rgba(184,160,77,.22)]" : "text-[#607768] hover:bg-white hover:text-[#294937]"}`}>{tab.label}</button>)}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Previous experiences" onClick={() => {setIndex((v)=>Math.max(0,v-1));setFlipped(null);}} disabled={index===0} className="deck-arrow">←</button>
            <button type="button" aria-label="Next experiences" onClick={() => {setIndex((v)=>Math.min(maxIndex,v+1));setFlipped(null);}} disabled={index>=maxIndex} className="deck-arrow">→</button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((service, cardIndex) => {
            const isFlipped = flipped === service.id;
            return <article key={service.id} className="experience-flip-wrap" style={{animationDelay:`${cardIndex*90}ms`}}>
              <button type="button" aria-label={isFlipped ? `Show ${service.name} image` : `See details for ${service.name}`} aria-pressed={isFlipped} onClick={()=>setFlipped(isFlipped?null:service.id)} className={`experience-flip w-full text-left ${isFlipped?"is-flipped":""}`}>
                <div className="experience-flip-inner">
                  <div className="experience-face experience-front">
                    <div className="relative h-full min-h-[420px] overflow-hidden rounded-[1.35rem]">
                      <Image src={service.image} alt={service.name} fill sizes="(min-width:1280px) 33vw,(min-width:768px) 50vw,100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#173d2b]/80 via-[#173d2b]/15 to-transparent"/>
                      <div className="absolute left-5 top-5 rounded-full border border-white/65 bg-[#244936]/55 px-3 py-2 text-[9px] font-semibold uppercase tracking-[.16em] text-white backdrop-blur">{categoryMeta[service.category].label}</div>
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <div className="flex items-end justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[.18em] text-[#f0e2af]">{service.footprint}</p><h3 className="mt-2 font-display text-4xl leading-none text-white">{service.name}</h3></div><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/65 bg-white/20 text-xl text-white">↗</span></div>
                        <div className="mt-5 flex items-center justify-between border-t border-white/25 pt-4 text-xs"><span className="text-white/85">{service.priceLabel}</span><span className="font-semibold uppercase tracking-[.12em] text-[#efdfaa]">Tap to explore</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="experience-face experience-back rounded-[1.35rem] border border-[#B8A04D]/30 bg-[radial-gradient(circle_at_top_right,#0D5A3D,#052F20_70%)] p-7">
                    <span className="text-[10px] uppercase tracking-[.2em] text-[#D1BD73]">The guest experience</span>
                    <h3 className="mt-5 font-display text-4xl leading-none text-[#F5F0DF]">{service.name}</h3>
                    <p className="mt-5 text-sm leading-7 text-[#D2DED3]">{service.summary}</p>
                    <div className="mt-6 border-t border-[#B8A04D]/25 pt-5"><p className="text-[9px] uppercase tracking-[.2em] text-[#D1BD73]">What is included</p><ul className="mt-3 space-y-2 text-xs leading-5 text-[#E6E9D8]">{service.includes.slice(0,4).map((item)=><li key={item}>✳ {item}</li>)}</ul></div>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-6"><span className="font-display text-2xl text-[#D1BD73]">{service.priceLabel}</span><span className="text-xs uppercase tracking-[.12em] text-[#D1BD73]">Back to image ↻</span></div>
                  </div>
                </div>
              </button>
              <Link href={categoryMeta[service.category].href} className="mt-3 inline-flex text-[10px] font-semibold uppercase tracking-[.17em] text-[#D1BD73] transition hover:translate-x-1">Explore category ↗</Link>
            </article>;
          })}
        </div>
        {visible.length===0 && <p className="rounded-2xl border border-[#b8a04d]/20 p-10 text-center text-sm text-[#D2DED3]">New experiences are being added. Contact our team for a custom setup.</p>}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border border-[#B8A04D]/30 bg-[#052F20]/80 p-6 sm:flex-row sm:p-8"><div><p className="section-kicker">Need a tailored setup?</p><p className="mt-2 font-display text-3xl text-[#F5F0DF]">Build a mix that fits your event.</p></div><Link href="/quote" className="liquid-button rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[.16em]">Start your event brief ↗</Link></div>
      </div>
    </section>
  );
}
