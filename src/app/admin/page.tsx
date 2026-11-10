import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminGate } from "@/components/admin/AdminGate";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-[70svh]" />}>
      <AdminGate requireSupabase>
        <main className="px-4 pb-24 pt-28 sm:px-6 lg:px-10 lg:pt-10">
          <h2 className="sr-only">Dashboard</h2>
          <div className="mx-auto max-w-[1500px]">
            <AdminDashboard />
          </div>
        </main>
      </AdminGate>
    </Suspense>
  );
}
