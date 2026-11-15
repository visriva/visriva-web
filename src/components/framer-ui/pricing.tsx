"use client";

import { useMemo, useState } from "react";
import { BouncyNavPill } from "@/components/framer-ui/navigation";
import { LiquidGlassPricingCard } from "@/components/framer-ui/cards-layout";

export type PricingPackage = {
  id: string;
  name: string;
  price: string;
  image: string;
  footprint?: string;
  href: string;
  tier: "starter" | "signature" | "enterprise";
  bullets: string[];
};

export function PricingPackageConfigurator({
  packages,
}: {
  packages: PricingPackage[];
}) {
  const tiers = [
    { id: "all", label: "All packages" },
    { id: "starter", label: "Starter" },
    { id: "signature", label: "Signature" },
    { id: "enterprise", label: "Enterprise" },
  ];
  const [tier, setTier] = useState("all");
  const filtered = useMemo(
    () => (tier === "all" ? packages : packages.filter((p) => p.tier === tier)),
    [packages, tier],
  );

  return (
    <div className="space-y-8">
      <BouncyNavPill items={tiers} active={tier} onChange={setTier} ariaLabel="Pricing tiers" layoutId="pricing-tier-pill" dark />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p, i) => (
          <div key={p.id} className="space-y-3">
            <LiquidGlassPricingCard {...p} popular={p.tier === "signature" && i === 0} />
            <ul className="space-y-1 px-2 text-xs text-[#E6DEC8]">
              {p.bullets.map((b) => (
                <li key={b}>✳ {b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}