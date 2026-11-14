import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminQrPanel } from "@/components/admin/AdminQrPanel";
import { getQrPageContentAdmin } from "@/lib/qr-content";
import { createAdminClient } from "@/lib/supabase-admin";
import { getQrPageSettingsAdmin, type QrGiveawayEntry } from "@/lib/qr-page";

export const metadata: Metadata = { title: "QR Giveaway", robots: { index: false, follow: false } };

async function QrAdminContent() {
  const [settings, content] = await Promise.all([getQrPageSettingsAdmin(), getQrPageContentAdmin()]);

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
    <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
      <div className="mx-auto max-w-[1200px]">
        <AdminQrPanel initialSettings={settings} initialContent={content} initialEntries={entries} />
      </div>
    </main>
  );
}

export default function AdminQrPage() {
  return (
    <Suspense fallback={<main className="min-h-screen px-4 pt-8 text-sm text-mist">Loading QR settings…</main>}>
      <AdminGate requireSupabase>
        <QrAdminContent />
      </AdminGate>
    </Suspense>
  );
}