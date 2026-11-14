import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminModuleShell } from "@/components/admin/AdminModuleShell";

export const metadata: Metadata = { title: "Inventory & stations", robots: { index: false, follow: false } };

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={<div className="min-h-[50svh]" />}>
      <AdminGate requireSupabase>
        <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
          <div className="mx-auto max-w-[1500px]">
            <AdminModuleShell
              kicker="Hardware"
              title="Inventory & stations"
              description="Track which experiential kits are on the road, in prep, or ready for your next corporate slot. Full hardware registry connects here — use Services for live station definitions today."
              links={[
                { href: "/admin/services", label: "Manage stations" },
                { href: "/admin/bookings", label: "Upcoming bookings" },
              ]}
            />
          </div>
        </main>
      </AdminGate>
    </Suspense>
  );
}