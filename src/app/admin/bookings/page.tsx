import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminModuleShell } from "@/components/admin/AdminModuleShell";

export const metadata: Metadata = { title: "Bookings", robots: { index: false, follow: false } };

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<div className="min-h-[50svh]" />}>
      <AdminGate requireSupabase>
        <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
          <div className="mx-auto max-w-[1500px]">
            <AdminModuleShell
              kicker="Calendar"
              title="Bookings"
              description="Confirmed event dates, load-in windows, and on-site crew notes will appear here. Enquiries with event dates already flow into Enquiries & leads."
              links={[
                { href: "/admin/leads", label: "View enquiries with dates" },
                { href: "/admin/customers", label: "Customer directory" },
              ]}
            />
          </div>
        </main>
      </AdminGate>
    </Suspense>
  );
}