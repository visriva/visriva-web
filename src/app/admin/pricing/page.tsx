import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminModuleShell } from "@/components/admin/AdminModuleShell";

export const metadata: Metadata = { title: "Pricing & packages", robots: { index: false, follow: false } };

export default function AdminPricingPage() {
  return (
    <Suspense fallback={<div className="min-h-[50svh]" />}>
      <AdminGate requireSupabase>
        <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
          <div className="mx-auto max-w-[1500px]">
            <AdminModuleShell
              kicker="Rates & GST"
              title="Pricing & packages"
              description="Station rates, add-ons, and quote builder options are managed alongside each live service record. Publish tiers from the service editor until the dedicated rate card ships."
              links={[
                { href: "/admin/services", label: "Open services catalog" },
                { href: "/admin/leads", label: "Review quote requests" },
              ]}
            />
          </div>
        </main>
      </AdminGate>
    </Suspense>
  );
}