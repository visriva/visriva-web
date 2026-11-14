import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminStudioTable } from "@/components/admin/AdminStudioTable";

export const metadata: Metadata = { title: "Customers", robots: { index: false, follow: false } };

const fields = [
  { key: "company", label: "Company" },
  { key: "contact_name", label: "Contact" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "notes", label: "Notes" },
];

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<div className="min-h-[50svh]" />}>
      <AdminGate requireSupabase>
        <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
          <div className="mx-auto max-w-[1500px]">
            <AdminStudioTable
              table="studio_customers"
              kicker="Accounts"
              title="Customers"
              description="Corporate client directory and repeat venue history."
              fields={fields}
              newRow={{ company: "Company name", contact_name: "", phone: "", email: "", notes: "" }}
            />
          </div>
        </main>
      </AdminGate>
    </Suspense>
  );
}