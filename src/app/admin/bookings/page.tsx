import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminStudioTable } from "@/components/admin/AdminStudioTable";

export const metadata: Metadata = { title: "Bookings", robots: { index: false, follow: false } };

const fields = [
  { key: "event_name", label: "Event name" },
  { key: "client_name", label: "Client" },
  { key: "event_date", label: "Event date", type: "date" as const },
  { key: "venue", label: "Venue" },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: ["tentative", "confirmed", "completed", "cancelled"],
  },
  { key: "notes", label: "Notes" },
];

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<div className="min-h-[50svh]" />}>
      <AdminGate requireSupabase>
        <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
          <div className="mx-auto max-w-[1500px]">
            <AdminStudioTable
              table="studio_bookings"
              kicker="Calendar"
              title="Bookings"
              description="Confirmed dates, venues, and crew notes for upcoming events."
              fields={fields}
              newRow={{ event_name: "New event", client_name: "", event_date: null, venue: "", status: "tentative", notes: "" }}
            />
          </div>
        </main>
      </AdminGate>
    </Suspense>
  );
}