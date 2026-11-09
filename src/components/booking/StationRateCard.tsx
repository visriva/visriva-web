"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Award, Camera, Check, Gamepad2, Plus, Sparkles } from "lucide-react";
import { useBooking } from "@/components/booking/BookingContext";
import {
  INITIAL_STATIONS,
  formatINR,
  getLuxuryStationPrice,
  type LuxuryCategory,
  type LuxuryStation,
} from "@/lib/luxury-stations";

const FILTERS: { id: LuxuryCategory; label: string; icon: typeof Sparkles }[] = [
  { id: "all", label: "All stations (12)", icon: Sparkles },
  { id: "photo-booths", label: "Photo booths (5)", icon: Camera },
  { id: "ai-merch", label: "AI & live merch (5)", icon: Award },
  { id: "games-vr", label: "VR & games (2)", icon: Gamepad2 },
];

export function StationRateCard() {
  const {
    selectedIds,
    toteBagTierIndex,
    pvcCardCount,
    toggleStation,
    setToteBagTierIndex,
    setPvcCardCount,
  } = useBooking();
  const [activeCategory, setActiveCategory] = useState<LuxuryCategory>("all");

  const filteredStations = useMemo(
    () =>
      activeCategory === "all"
        ? INITIAL_STATIONS
        : INITIAL_STATIONS.filter((s) => s.category === activeCategory),
    [activeCategory],
  );

  return (
    <section id="rate-card" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="type-eyebrow">Transparent starting rates · no call required</p>
            <h2 className="type-display mt-3 text-3xl text-cream sm:text-5xl">
              Select your stations.{" "}
              <span className="type-display-italic text-gold-2">Lock your package.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream/80 sm:text-base">
              Tap to add rigs to your event draft — totals sync to the{" "}
              <Link href="/quote" className="text-gold-2 underline-offset-4 hover:underline">
                quote wizard
              </Link>{" "}
              for the booking engine we are wiring next.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`type-site-nav flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-all ${
                    isActive
                      ? "border-gold-2 bg-gold text-deep shadow-[0_0_20px_rgba(201,162,39,0.3)]"
                      : "border-gold/25 bg-emerald/35 text-cream hover:border-gold/60"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStations.map((station) => {
            const isSelected = selectedIds.includes(station.id);
            const effectivePrice = getLuxuryStationPrice(station, toteBagTierIndex, pvcCardCount);

            return (
              <div
                key={station.id}
                className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 ${
                  isSelected
                    ? "border-gold-2 bg-gradient-to-b from-canopy/80 to-emerald shadow-[0_0_35px_rgba(201,162,39,0.22)]"
                    : "border-gold/25 bg-emerald/35 hover:border-gold/60 hover:bg-emerald/55"
                }`}
              >
                <div>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="type-eyebrow text-[0.65rem] text-champagne">
                      {station.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {station.popular ? (
                        <span className="rounded border border-gold/40 bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-2">
                          Most booked
                        </span>
                      ) : null}
                      <span className="rounded bg-ink/60 px-2 py-0.5 font-mono text-[11px] text-mist">
                        {station.footprint}
                      </span>
                    </div>
                  </div>

                  <h3 className="type-display text-2xl leading-tight text-cream">
                    {station.name}
                  </h3>

                  <div className="mt-2 flex items-baseline justify-between gap-2 border-b border-gold/15 pb-4">
                    <span className="font-mono text-xl font-bold text-gold-2 sm:text-2xl">
                      {station.id === "tote-bag-station" && station.tiers
                        ? `${formatINR(effectivePrice)} (${station.tiers[toteBagTierIndex]?.label})`
                        : station.id === "pvc-id-cards"
                          ? `${formatINR(effectivePrice)} (${pvcCardCount} cards)`
                          : station.priceDisplay}
                    </span>
                    <span className="font-mono text-xs text-champagne/90">{station.duration}</span>
                  </div>

                  {station.hasTierToggle && station.tiers ? (
                    <div className="my-3 flex items-center justify-between gap-2 rounded-xl border border-gold/25 bg-ink/70 p-2">
                      {station.tiers.map((tier, idx) => (
                        <button
                          key={tier.label}
                          type="button"
                          onClick={() => setToteBagTierIndex(idx)}
                          className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all ${
                            toteBagTierIndex === idx
                              ? "bg-gold text-deep"
                              : "text-mist hover:text-cream"
                          }`}
                        >
                          {tier.label} · {formatINR(tier.price)}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {station.hasCardSlider ? (
                    <div className="my-3 rounded-xl border border-gold/25 bg-ink/70 p-3">
                      <div className="mb-1.5 flex justify-between font-mono text-xs">
                        <span className="text-mist">Spot card quantity</span>
                        <span className="font-bold text-gold-2">
                          {pvcCardCount} cards (@ ₹120)
                        </span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={500}
                        step={25}
                        value={pvcCardCount}
                        onChange={(e) => setPvcCardCount(Number(e.target.value))}
                        className="h-1.5 w-full cursor-pointer rounded-lg bg-canopy accent-gold"
                      />
                    </div>
                  ) : null}

                  <p className="mt-3 text-sm leading-relaxed text-cream/85">{station.description}</p>

                  <ul className="mt-4 space-y-1.5 text-xs text-champagne/90">
                    {station.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 shrink-0 text-gold" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 space-y-3 border-t border-gold/20 pt-4">
                  <div className="flex items-center justify-between font-mono text-[11px] text-mist">
                    <span>Rig: {station.hardwareBadge}</span>
                    <span>{station.power}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleStation(station.id)}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold tracking-wide transition-all sm:text-sm ${
                      isSelected
                        ? "bg-gradient-to-r from-gold via-gold-2 to-gold text-deep shadow-[0_0_20px_rgba(201,162,39,0.4)]"
                        : "border border-gold/40 bg-ink text-champagne hover:border-gold-2 hover:bg-canopy"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-4 w-4 stroke-[2.5]" />
                        Selected ({formatINR(effectivePrice)})
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add station to event
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
