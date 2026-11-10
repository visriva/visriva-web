import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminLeadsTable } from "@/components/admin/AdminLeadsTable";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

export default function AdminLeadsPage() {
  return (
    <Suspense fallback={<div className="min-h-[70svh]" />}>
      <AdminGate requireSupabase>
        <main className="px-4 pb-24 pt-28 sm:px-6 lg:px-10 lg:pt-10">
          <div className="mx-auto max-w-[1500px]">
            <div>
              <p className="font-royal text-[0.68rem] uppercase tracking-[0.28em] text-gold">Studio</p>
              <h1 className="mt-2 font-display text-5xl italic text-cream">Incoming briefs</h1>
            </div>
            <AdminLeadsTable />
          </div>
        </main>
      </AdminGate>
    </Suspense>
  );
}
