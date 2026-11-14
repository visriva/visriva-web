import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminStudioTable } from "@/components/admin/AdminStudioTable";

export const metadata: Metadata = { title: "Pricing & packages", robots: { index: false, follow: false } };

const fields = [
  { key: "name", label: "Package name" },
  { key: "station_type", label: "Station type" },
  { key: "rate_inr", label: "Rate (INR)", type: "number" as const },
  { key: "unit_label", label: "Unit label" },
  { key: "gst_note", label: "GST note" },
  { key: "sort_order", label: "Sort", type: "number" as const },
  { key: "active", label: "Active", type: "checkbox" as const },
];

export default function AdminPricingPage() {
  return (
    <Suspense fallback={<div className="min-h-[50svh]" />}>
      <AdminGate requireSupabase>
        <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
          <div className="mx-auto max-w-[1500px]">
            <AdminStudioTable
              table="pricing_packages"
              kicker="Rates & GST"
              title="Pricing & packages"
              description="Manage published rate packages, GST notes, and add-ons shown on quotes and the rate card."
              fields={fields}
              newRow={{ name: "New package", station_type: "", rate_inr: 0, unit_label: "per event", gst_note: "18% GST on B2B invoices", sort_order: 0, active: true }}
            />
          </div>
        </main>
      </AdminGate>
    </Suspense>
  );
}