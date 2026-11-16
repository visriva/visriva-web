"use client";

import { useMemo, useState } from "react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { whatsAppLink } from "@/lib/whatsapp";

const stationOptions = [
  { value: "photo-booth", label: "Instant Photo Booth (11s Prints)", base: 15_000 },
  { value: "magnet-station", label: "Live Fridge Magnet Station", base: 18_000 },
  { value: "tote-tshirt", label: "Tote Bag & T-Shirt Printing", base: 22_000 },
  { value: "mug-printing", label: "Live Mug Printing Station", base: 20_000 },
  { value: "keychain-station", label: "Live Keychain Station", base: 17_000 },
] as const;

export type PricingEstimatorStation = (typeof stationOptions)[number]["value"];

type StationValue = PricingEstimatorStation;

function calculateEstimate(stationType: StationValue, hours: number, guestCount: number) {
  const selected = stationOptions.find((s) => s.value === stationType) ?? stationOptions[0];
  const hourlyMultiplier = hours * 2_500;
  const guestMultiplier = Math.ceil(guestCount / 100) * 1_500;
  return selected.base + hourlyMultiplier + guestMultiplier;
}

type PricingEstimatorProps = {
  defaultStation?: StationValue;
  /** Tighter vertical spacing when nested inside PricingEstimatorSection */
  embedded?: boolean;
};

export default function PricingEstimator({ defaultStation = "photo-booth", embedded }: PricingEstimatorProps) {
  const [stationType, setStationType] = useState<StationValue>(defaultStation);
  const [hours, setHours] = useState(3);
  const [guestCount, setGuestCount] = useState(200);

  const estimate = useMemo(
    () => calculateEstimate(stationType, hours, guestCount),
    [stationType, hours, guestCount],
  );

  const selectedLabel = stationOptions.find((s) => s.value === stationType)?.label ?? stationOptions[0].label;

  const whatsappHref = useMemo(() => {
    const message = `Hi Visriva, I want to book a ${selectedLabel} for ${guestCount} guests (${hours} hours). Estimated package: ₹${estimate.toLocaleString("en-IN")}. Please share more details.`;
    return whatsAppLink(message);
  }, [selectedLabel, guestCount, hours, estimate]);

  return (
    <div
      className={`mx-auto max-w-xl rounded-2xl border border-[#C9A227]/35 bg-[#F8F7EF] p-8 shadow-[0_20px_50px_rgba(13,42,29,.08)] ${embedded ? "mt-10" : "my-12"}`}
    >
      <p className="section-kicker">Instant estimate</p>
      <h3 className="mt-2 font-display text-3xl text-[#244936]">Live station instant estimator</h3>
      <p className="mt-2 text-sm leading-6 text-[#617768]">
        Configure your event requirements for an instant package estimate. Final pricing is confirmed around your venue and brief.
      </p>

      <div className="mt-6">
        <label htmlFor="pricing-station" className="mb-1 block text-xs font-semibold uppercase tracking-[.14em] text-[#294937]">
          Select live station
        </label>
        <select
          id="pricing-station"
          value={stationType}
          onChange={(e) => setStationType(e.target.value as StationValue)}
          className="w-full rounded-xl border border-[#CBDCC7] bg-white p-3 text-[#203F30] focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40"
        >
          {stationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="pricing-hours" className="mb-1 block text-xs font-semibold uppercase tracking-[.14em] text-[#294937]">
          Event duration: {hours} hours
        </label>
        <input
          id="pricing-hours"
          type="range"
          min={2}
          max={8}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-full accent-[#244936]"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="pricing-guests" className="mb-1 block text-xs font-semibold uppercase tracking-[.14em] text-[#294937]">
          Estimated guest count: {guestCount} guests
        </label>
        <input
          id="pricing-guests"
          type="range"
          min={50}
          max={1000}
          step={50}
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          className="w-full accent-[#244936]"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#C9A227]/30 bg-[#E7EFE3] p-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#5A7468]">Estimated package</span>
          <div className="font-display text-4xl text-[#163D2C]">₹{estimate.toLocaleString("en-IN")}</div>
        </div>
        <span className="rounded-full border border-[#C9A227]/50 bg-[#F5F0DF] px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#806B2D]">
          Includes on-site crew
        </span>
      </div>

      {whatsappHref ? (
        <LiquidButton href={whatsappHref} external variant="solid" className="mt-6 w-full py-4 text-[10px] font-bold tracking-[.16em]">
          Get exact quote on WhatsApp
        </LiquidButton>
      ) : (
        <p className="mt-6 text-center text-sm text-[#617768]">WhatsApp is not configured for this environment.</p>
      )}
    </div>
  );
}