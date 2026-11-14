import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminStudioTable } from "@/components/admin/AdminStudioTable";

export const metadata: Metadata = { title: "Inventory & stations", robots: { index: false, follow: false } };

const fields = [
  { key: "name", label: "Kit / rig name" },
  { key: "station_id", label: "Service id" },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: ["available", "reserved", "on_event", "maintenance"],
  },
  { key: "notes", label: "Notes" },
  { key: "sort_order", label: "Sort", type: "number" as const },
];

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={<div className="min-h-[50svh]" />}>
      <AdminGate requireSupabase>
        <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
          <div className="mx-auto max-w-[1500px]">
            <AdminStudioTable
              table="inventory_items"
              kicker="Hardware"
              title="Inventory & stations"
              description="Track rigs on the road, in prep, or ready for the next corporate slot."
              fields={fields}
              newRow={{ name: "New rig", station_id: "", status: "available", notes: "", sort_order: 0 }}
            />
          </div>
        </main>
      </AdminGate>
    </Suspense>
  );
}