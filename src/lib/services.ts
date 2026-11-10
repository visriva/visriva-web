import { fallbackServices, fallbackServicesIn, getFallbackService } from "@/lib/services-fallback";
import type { Service, ServiceCategory } from "@/lib/services-types";

export type { PublishStatus, Service, ServiceCategory, ServiceSpecs } from "@/lib/services-types";

/** Static catalogue used when Supabase is unavailable (local dev / outage). */
export const services = fallbackServices;

export const categoryMeta: Record<
  ServiceCategory,
  { label: string; href: string; kicker: string }
> = {
  "photo-booths": {
    label: "Photo Booths",
    href: "/photo-booths",
    kicker: "Capture",
  },
  "ai-merchandise": {
    label: "AI & Merchandise",
    href: "/ai-merchandise",
    kicker: "Make",
  },
  games: { label: "Games & VR", href: "/games-vr", kicker: "Play" },
};

export function getService(id: string) {
  return getFallbackService(id);
}

export function servicesIn(category: ServiceCategory) {
  return fallbackServicesIn(category);
}

export type EstimateLine = {
  id: string;
  name: string;
  quantity: number;
  priceLabel: string;
  amount: number | null;
  unitLabel?: string;
};

export function estimateWithLookup(selected: Record<string, number>, lookup: (id: string) => Service | undefined) {
  const lines: EstimateLine[] = [];
  let total = 0;
  let hasCustom = false;

  for (const [id, quantity] of Object.entries(selected)) {
    const service = lookup(id);
    if (!service || quantity <= 0) continue;
    if (service.bookable === false) continue;

    if (service.unitPrice) {
      const amount = service.unitPrice * quantity;
      total += amount;
      lines.push({
        id,
        name: service.name,
        quantity,
        priceLabel: service.priceLabel,
        amount,
        unitLabel: service.unitLabel,
      });
      continue;
    }

    if (service.fromPrice == null) {
      hasCustom = true;
      lines.push({
        id,
        name: service.name,
        quantity,
        priceLabel: service.priceLabel,
        amount: null,
      });
      continue;
    }

    const amount = service.fromPrice * quantity;
    total += amount;
    lines.push({
      id,
      name: service.name,
      quantity,
      priceLabel: service.priceLabel,
      amount,
    });
  }

  return { lines, total, hasCustom };
}

export function estimate(selected: Record<string, number>) {
  return estimateWithLookup(selected, getFallbackService);
}

export function countsFromIds(ids: string[], lookup: (id: string) => Service | undefined = getFallbackService) {
  const map: Record<string, number> = {};
  for (const id of ids) {
    const service = lookup(id);
    if (!service || service.bookable === false) continue;
    if (service.unitPrice) {
      map[id] = map[id] && map[id] > 1 ? map[id] : 100;
      continue;
    }
    map[id] = (map[id] ?? 0) + 1;
  }
  return map;
}
