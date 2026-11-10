import "server-only";
import { unstable_cache } from "next/cache";
import { rowToService, type ServiceRow } from "@/lib/service-row";
import { createAdminClient } from "@/lib/supabase-admin";
import { createPublicClient } from "@/lib/supabase-public";
import { fallbackServices, fallbackServicesIn, getFallbackService } from "@/lib/services-fallback";
import type { Service, ServiceCategory } from "@/lib/services-types";

export const SERVICE_CATALOG_TAG = "services-catalog";

async function loadPublishedFromDb(): Promise<Service[] | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("publish_status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Published services query failed", error.message);
    return null;
  }
  if (!data?.length) return null;

  return (data as ServiceRow[]).map((row) => rowToService(row, true));
}

const cachedPublished = unstable_cache(loadPublishedFromDb, ["visriva-published-services"], {
  tags: [SERVICE_CATALOG_TAG],
  revalidate: 120,
});

export async function getPublishedServices(): Promise<Service[]> {
  const fromDb = await cachedPublished();
  if (fromDb?.length) return fromDb;
  return fallbackServices.map((service) => ({ ...service, bookable: true, publishStatus: "published" as const }));
}

export type ServiceCatalog = {
  list: Service[];
  bookable: Service[];
  getService: (id: string) => Service | undefined;
  servicesIn: (category: ServiceCategory) => Service[];
};

export async function getPublishedCatalog(): Promise<ServiceCatalog> {
  const list = await getPublishedServices();
  const byId = new Map(list.map((service) => [service.id, service]));
  const bookable = list.filter((service) => service.bookable !== false);

  return {
    list,
    bookable,
    getService: (id: string) => byId.get(id),
    servicesIn: (category: ServiceCategory) => list.filter((service) => service.category === category),
  };
}

export async function getAllServicesAdmin(): Promise<ServiceRow[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("services").select("*").order("sort_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as ServiceRow[];
}

export function catalogFallbackOnly(): ServiceCatalog {
  return {
    list: fallbackServices,
    bookable: fallbackServices,
    getService: getFallbackService,
    servicesIn: fallbackServicesIn,
  };
}
