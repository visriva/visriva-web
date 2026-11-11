import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminWebsitePages } from "@/components/admin/AdminWebsitePages";
import { getWebsitePagesAdmin } from "@/lib/website-pages";

export const metadata: Metadata = { title: "Website CMS", robots: { index: false, follow: false } };

async function WebsitePagesContent() {
  const pages = await getWebsitePagesAdmin();
  return (
    <main className="px-4 pb-24 pt-28 sm:px-6 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-[1500px]">
        <AdminWebsitePages pages={pages} />
      </div>
    </main>
  );
}

export default function AdminWebsitePage() {
  return (
    <Suspense fallback={<main className="min-h-screen px-4 pt-28 text-sm text-mist">Loading website editor…</main>}>
      <AdminGate requireSupabase>
        <WebsitePagesContent />
      </AdminGate>
    </Suspense>
  );
}
