import type { PublishStatus, Service, ServiceCategory, ServiceSpecs } from "@/lib/services-types";
import { getFallbackService } from "@/lib/services-fallback";

export type { PublishStatus, ServiceSpecs };

export type ServiceRow = {
  id: string;
  name: string;
  category: string;
  price_label: string;
  from_price: number | null;
  unit_price: number | null;
  summary: string;
  sort_order: number;
  active: boolean;
  publish_status: PublishStatus;
  coming_soon: boolean;
  image_path: string | null;
  includes: string[] | null;
  footprint: string | null;
  guest_moment: string | null;
  unit_label: string | null;
  duration_minutes: number | null;
  description: string | null;
  specs: ServiceSpecs | null;
  updated_at?: string;
  published_at?: string | null;
};

const categories = new Set<ServiceCategory>(["photo-booths", "ai-merchandise", "games"]);

export function parseCategory(value: string): ServiceCategory {
  if (categories.has(value as ServiceCategory)) return value as ServiceCategory;
  return "ai-merchandise";
}

export function rowToService(row: ServiceRow, forPublic: boolean): Service {
  const fallback = getFallbackService(row.id);
  const includes =
    Array.isArray(row.includes) && row.includes.length > 0
      ? row.includes
      : (fallback?.includes ?? []);

  return {
    id: row.id,
    name: row.name || fallback?.name || row.id,
    category: parseCategory(row.category),
    priceLabel: row.price_label || fallback?.priceLabel || "Price on request",
    fromPrice: row.from_price ?? fallback?.fromPrice ?? null,
    unitPrice: row.unit_price ?? fallback?.unitPrice,
    unitLabel: row.unit_label ?? fallback?.unitLabel,
    summary: row.summary || fallback?.summary || "",
    includes,
    footprint: row.footprint || fallback?.footprint || "",
    guestMoment: row.guest_moment || fallback?.guestMoment || "",
    image: row.image_path || fallback?.image || "/images/workshop.jpg",
    comingSoon: forPublic ? row.coming_soon : row.coming_soon,
    bookable: forPublic ? row.publish_status === "published" && !row.coming_soon : true,
    description: row.description || fallback?.summary,
    durationMinutes: row.duration_minutes ?? undefined,
    specs: row.specs ?? undefined,
    publishStatus: row.publish_status,
  };
}

export function serviceToRow(input: Partial<ServiceRow> & { id: string; name: string; category: string; summary: string }): ServiceRow {
  return {
    id: input.id,
    name: input.name,
    category: input.category,
    price_label: input.price_label ?? "Price on request",
    from_price: input.from_price ?? null,
    unit_price: input.unit_price ?? null,
    summary: input.summary,
    sort_order: input.sort_order ?? 0,
    active: input.active ?? true,
    publish_status: input.publish_status ?? "draft",
    coming_soon: input.coming_soon ?? false,
    image_path: input.image_path ?? null,
    includes: input.includes ?? [],
    footprint: input.footprint ?? null,
    guest_moment: input.guest_moment ?? null,
    unit_label: input.unit_label ?? null,
    duration_minutes: input.duration_minutes ?? null,
    description: input.description ?? null,
    specs: input.specs ?? {},
  };
}
