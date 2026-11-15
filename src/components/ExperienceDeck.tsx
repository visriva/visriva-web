"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HomeExperience } from "@/lib/home-content-types";
import { DEFAULT_HOME_CONTENT } from "@/lib/home-content-types";
import type { Service, ServiceCategory } from "@/lib/services";
import { categoryMeta } from "@/lib/services";
import {
  BouncyNavPill,
  DotButton,
  ExperienceStationRail,
  LiquidGlassStationFlipCard,
  StationGoldPagination,
  SwipeLettersButton,
} from "@/components/framer-ui";
import { STATION_FILTER_SPRING } from "@/components/framer-ui/motion";

type TabId = "all" | ServiceCategory;

export function ExperienceDeck({ services, content }: { services: Service[]; content?: HomeExperience }) {
  const c = content ?? DEFAULT_HOME_CONTENT.experience;
  const tabs = c.tabs as { id: TabId; label: string; note: string }[];
  const [active, setActive] = useState<TabId>(tabs[0]?.id ?? "all");
  const [flipped, setFlipped] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const filtered = useMemo(() => (active === "all" ? services : services.filter((service) => service.category === active)), [active, services]);
  const compared = services.filter((service) => compareIds.includes(service.id));

  useEffect(() => {
    if (!compareOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCompareOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compareOpen]);

  function changeTab(id: TabId) {
    setActive(id);
    setFlipped(null);
    setActiveDot(0);
    const el = railRef.current;
    el?.scrollTo({ left: 0, behavior: "smooth" });
  }

  function scrollToIndex(index: number) {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({ left: index * 410, behavior: "smooth" });
    setActiveDot(index);
  }

  function toggleCompare(id: string) {
    setCompareIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current,
    );
  }

  return (
    <section id="experiences" className="relative overflow-hidden bg-[#DCE9D8] px-5 py-24 text-[#203F30] sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -right-44 top-0 h-[34rem] w-[34rem] rounded-full bg-[#B7D0B2]/55 blur-[120px]" />
      <div className="pointer-events-none absolute -left-36 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[#F8F7EF]/80 blur-[110px]" />
      <div className="relative mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="section-kicker">{c.kicker}</p>
            <h2 className="mt-4 max-w-3xl font-display text-6xl leading-[0.9] sm:text-7xl">
              {c.title}
              <br />
              <em className="gold-gradient">{c.title_accent}</em>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#667B6B]">{c.sidebar}</p>
        </div>

        <div className="mt-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <BouncyNavPill
            items={tabs.map((t) => ({ id: t.id, label: t.label }))}
            active={active}
            onChange={(id) => changeTab(id as TabId)}
            ariaLabel="Filter experiences"
            layoutId="stationFilterPill"
            variant="frosted-gold"
          />
          <StationGoldPagination
            count={filtered.length}
            activeIndex={activeDot}
            onSelect={scrollToIndex}
            totalLabel={`${filtered.length} experiences`}
          />
        </div>

        <ExperienceStationRail ref={railRef} itemCount={filtered.length} onActiveIndexChange={setActiveDot} className="mt-0">
            {filtered.map((service, index) => {
              const isFlipped = flipped === service.id;
              const isCompared = compareIds.includes(service.id);
              return (
                <motion.article
                  key={`${active}-${service.id}`}
                  initial={reduce ? false : { opacity: 0, y: 20, scale: 0.96 }}
                  animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...STATION_FILTER_SPRING, delay: index * 0.08 }}
                  className="experience-flip-wrap w-[min(84vw,390px)] shrink-0 snap-start"
                  style={reduce ? undefined : { transformOrigin: "center center" }}
                >
                  <LiquidGlassStationFlipCard
                    flipped={isFlipped}
                    onFlip={() => setFlipped(isFlipped ? null : service.id)}
                    front={
                      <div className="relative h-full min-h-[430px] overflow-hidden rounded-[1.4rem] border border-white/70 bg-[#C9DCC5]/90 shadow-[0_16px_42px_rgba(39,67,48,.11)] backdrop-blur-sm">
                        <Image src={service.image} alt={service.name} fill sizes="390px" className="object-cover transition duration-700 hover:scale-[1.04]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#193D2B]/90 via-[#193D2B]/10 to-transparent" />
                        <div className="absolute left-5 top-5 rounded-full border border-white/70 bg-[#F8F7EF]/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#355642] backdrop-blur-md">
                          {categoryMeta[service.category].label}
                        </div>
                        {service.comingSoon || service.bookable === false ? (
                          <span className="absolute right-5 top-5 rounded-full bg-[#294937]/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                            Coming soon
                          </span>
                        ) : null}
                        <div className="absolute inset-x-0 bottom-0 p-6">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E9DDAE]">{service.footprint}</p>
                          <h3 className="mt-2 font-display text-[2.4rem] leading-[0.96] text-white">{service.name}</h3>
                          <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/30 pt-4">
                            <span className="text-sm font-semibold text-white">{service.priceLabel}</span>
                          </div>
                          <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/80">Tap card to turn</p>
                        </div>
                      </div>
                    }
                    back={
                      <div className="experience-back min-h-[430px] rounded-[1.4rem] border border-[#C8D9C2] bg-[radial-gradient(circle_at_top_right,#F8F7EF,#D6E6D2_72%)] p-7 shadow-[0_16px_42px_rgba(39,67,48,.08)]">
                        <span className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#947D34]">Inside the experience</span>
                        <h3 className="mt-5 font-display text-4xl leading-none text-[#294937]">{service.name}</h3>
                        <p className="mt-5 text-sm leading-7 text-[#617768]">{service.summary}</p>
                        <div className="mt-6 border-t border-[#C5D8C0] pt-5">
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#947D34]">What is included</p>
                          <ul className="mt-3 space-y-2 text-xs leading-5 text-[#405B48]">
                            {service.includes.slice(0, 5).map((item) => (
                              <li key={item}>✳ {item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-auto pt-6">
                          <p className="font-display text-3xl text-[#947D34]">{service.priceLabel}</p>
                          {service.durationMinutes ? (
                            <p className="mt-2 text-xs text-[#718574]">{service.durationMinutes} min typical runtime</p>
                          ) : null}
                          <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#718574]">Tap to return ↻</p>
                        </div>
                      </div>
                    }
                  />
                  <div className="mt-3 flex items-center justify-between gap-3 px-1">
                    <SwipeLettersButton
                      href={categoryMeta[service.category].href}
                      label="Explore category"
                      className="!text-[10px] !font-bold !uppercase !tracking-[0.15em] !text-[#947D34]"
                    />
                    <div className="flex items-center gap-2">
                      {!isCompared && compareIds.length >= 3 ? (
                        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#607768]/50">Max 3</span>
                      ) : (
                        <DotButton
                          label={isCompared ? "Remove from compare" : "Add to compare"}
                          onClick={() => toggleCompare(service.id)}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => toggleCompare(service.id)}
                        disabled={!isCompared && compareIds.length >= 3}
                        aria-pressed={isCompared}
                        className={`rounded-full border px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] transition ${isCompared ? "border-[#294937] bg-[#294937] text-white" : "border-[#B8CBB4] bg-[#F8F7EF]/75 text-[#607768] hover:border-[#A88F3E]"} disabled:opacity-40`}
                      >
                        {isCompared ? "✓ Added" : "Compare +"}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          {filtered.length === 0 ? (
            <p className="w-full rounded-2xl border border-dashed border-[#B8CBB4] bg-[#F8F7EF]/70 p-10 text-center text-sm text-[#667B6B]">{c.empty_state}</p>
          ) : null}
        </ExperienceStationRail>

        <div className="mt-7 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/80 bg-[#F8F7EF]/85 p-6 shadow-[0_12px_35px_rgba(39,67,48,.06)] backdrop-blur-md sm:flex-row sm:p-8">
          <div>
            <p className="section-kicker">{c.footer_kicker}</p>
            <p className="mt-2 font-display text-3xl text-[#294937]">{c.footer_title}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={c.rate_card_href} className="rounded-full border border-[#B8CBB4] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#355642] transition hover:bg-[#E8EFE4]">
              {c.rate_card_label}
            </a>
            <SwipeLettersButton href={c.quote_cta_href} label={c.quote_cta_label} className="liquid-button !rounded-full !px-7 !py-3.5 !text-[10px]" />
          </div>
        </div>
      </div>

      {compareIds.length > 0 ? (
        <div className="sticky bottom-4 z-40 mx-auto mt-5 flex max-w-[700px] items-center justify-between gap-4 rounded-2xl border border-[#C9D7C4] bg-[#F8F7EF]/95 p-3 pl-5 shadow-[0_18px_55px_rgba(32,63,48,.16)] backdrop-blur-xl">
          <div>
            <p className="text-xs font-semibold text-[#294937]">{compareIds.length} of 3 experiences selected</p>
            <p className="mt-1 text-[10px] text-[#718574]">Compare pricing, footprint and inclusions</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setCompareIds([])} className="rounded-full px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-[#7D8B7C]">
              Clear
            </button>
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              disabled={compareIds.length < 2}
              className="inline-flex items-center gap-1 rounded-full bg-[#294937] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white disabled:opacity-40"
            >
              Compare now →
            </button>
          </div>
        </div>
      ) : null}

      {compareOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-[#203F30]/55 p-3 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Compare experiences"
          onClick={() => setCompareOpen(false)}
        >
          <section
            className="max-h-[88svh] w-full max-w-5xl overflow-auto rounded-[1.7rem] border border-white bg-[#F8F7EF] p-5 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-kicker">Side by side</p>
                <h3 className="mt-2 font-display text-4xl text-[#294937] sm:text-5xl">Compare experiences.</h3>
              </div>
              <button type="button" onClick={() => setCompareOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-[#C8D8C3] text-[#355642]">
                ×
              </button>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th className="w-36 border-b border-[#D9E4D5] p-3 text-[10px] uppercase tracking-wider text-[#839183]">Details</th>
                    {compared.map((item) => (
                      <th key={item.id} className="border-b border-[#D9E4D5] p-3 font-display text-2xl text-[#294937]">
                        {item.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["Starting price", (item: Service) => item.priceLabel],
                      ["Footprint", (item: Service) => item.footprint],
                      ["Duration", (item: Service) => (item.durationMinutes ? `${item.durationMinutes} minutes` : "Confirmed in quote")],
                      ["Includes", (item: Service) => item.includes.join(" · ")],
                    ] as const
                  ).map(([label, render]) => (
                    <tr key={label}>
                      <th className="border-b border-[#E4EBE0] p-3 align-top text-[10px] uppercase tracking-wider text-[#839183]">{label}</th>
                      {compared.map((item) => (
                        <td key={item.id} className="border-b border-[#E4EBE0] p-3 align-top leading-6 text-[#526B58]">
                          {render(item)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-7 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setCompareOpen(false)} className="rounded-full border border-[#C8D8C3] px-6 py-3 text-xs font-semibold text-[#49654F]">
                Keep exploring
              </button>
              <SwipeLettersButton href={`/quote?services=${compareIds.join(",")}`} label="Add compared services" className="liquid-button !rounded-full !px-6 !py-3" />
            </div>
          </section>
        </motion.div>
      ) : null}
    </section>
  );
}