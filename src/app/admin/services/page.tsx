import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminServicesBrowser } from "@/components/admin/AdminServicesBrowser";
import { getAllServicesAdmin } from "@/lib/services-catalog";

export const metadata: Metadata = {
  title: "Services",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  const rows = await getAllServicesAdmin();
  return (
    <Suspense fallback={<div className="min-h-[70svh]" />}>
      <AdminGate requireSupabase>
        <main className="px-4 pb-24 pt-28 sm:px-6 lg:px-10 lg:pt-10">
          <div className="mx-auto max-w-[1500px]">
            <AdminServicesBrowser rows={rows} />
          </div>
        </main>
      </AdminGate>
    </Suspense>
  );
}
