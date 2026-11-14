import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminQrPanel } from "@/components/admin/AdminQrPanel";
import { createAdminClient } from "@/lib/supabase-admin";
import { getQrPageSettingsAdmin, type QrGiveawayEntry } from "@/lib/qr-page";

export const metadata: Metadata = { title: "QR Giveaway", robots: { index: false, follow: false } };

async function QrAdminContent() {
  const settings = await getQrPageSettingsAdmin();

  let entries: QrGiveawayEntry[] = [];
  const supabase = createAdminClient();
  if (supabase) {
    const { data } = await supabase
      .from("qr_giveaway_entries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    entries = (data ?? []) as QrGiveawayEntry[];
  }

  return (
    <main className="px-4 pb-24 pt-28 sm:px-6 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-[1200px]">
        <AdminQrPanel initialSettings={settings} initialEntries={entries} />
      </div>
    </main>
  );
}

export default function AdminQrPage() {
  return (
    <Suspense fallback={<main className="min-h-screen px-4 pt-28 text-sm text-mist">Loading QR settings…</main>}>
      <AdminGate requireSupabase>
        <QrAdminContent />
      </AdminGate>
    </Suspense>
  );
}