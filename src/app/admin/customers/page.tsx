import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminModuleShell } from "@/components/admin/AdminModuleShell";

export const metadata: Metadata = { title: "Customers", robots: { index: false, follow: false } };

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<div className="min-h-[50svh]" />}>
      <AdminGate requireSupabase>
        <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
          <div className="mx-auto max-w-[1500px]">
            <AdminModuleShell
              kicker="Accounts"
              title="Customers"
              description="Corporate client history, repeat venues, and key contacts roll up here. Company and contact fields from each enquiry already populate your leads pipeline."
              links={[{ href: "/admin/leads", label: "Browse all leads" }]}
            />
          </div>
        </main>
      </AdminGate>
    </Suspense>
  );
}