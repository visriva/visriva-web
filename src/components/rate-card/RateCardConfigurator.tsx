"use client";

import { PricingPackageConfigurator, type PricingPackage } from "@/components/framer-ui";
import type { Service } from "@/lib/services";

export function RateCardConfigurator({ services }: { services: Service[] }) {
  const packages: PricingPackage[] = services
    .filter((s) => s.bookable !== false && !s.comingSoon)
    .slice(0, 9)
    .map((s, i) => ({
      id: s.id,
      name: s.name,
      price: s.priceLabel,
      image: s.image,
      footprint: s.footprint,
      href: `/quote?services=${s.id}`,
      tier: i % 3 === 0 ? "starter" : i % 3 === 1 ? "signature" : "enterprise",
      bullets: s.includes.slice(0, 3),
    }));

  if (!packages.length) return null;
  return <PricingPackageConfigurator packages={packages} />;
}