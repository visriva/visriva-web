import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminLeadsClient } from "@/components/admin/AdminLeadsClient";
import { createAdminClient } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

async function LeadsContent() {
  const supabase = createAdminClient();
  const { data } = supabase
    ? await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(400)
  : { data: [] };

  return (
    <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
      <div className="mx-auto max-w-[1500px]">
        <AdminLeadsClient initial={(data ?? []) as Parameters<typeof AdminLeadsClient>[0]["initial"]} />
      </div>
    </main>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense fallback={<div className="min-h-[70svh]" />}>
      <AdminGate requireSupabase>
        <LeadsContent />
      </AdminGate>
    </Suspense>
  );
}