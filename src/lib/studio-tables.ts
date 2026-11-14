export const STUDIO_TABLES = ["pricing_packages", "inventory_items", "studio_bookings", "studio_customers"] as const;
export type StudioTable = (typeof STUDIO_TABLES)[number];

export function isStudioTable(value: string): value is StudioTable {
  return (STUDIO_TABLES as readonly string[]).includes(value);
}