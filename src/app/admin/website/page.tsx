import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminSiteGlobals } from "@/components/admin/AdminSiteGlobals";
import { AdminWebsitePages } from "@/components/admin/AdminWebsitePages";
import { getSiteGlobalsAdmin } from "@/lib/site-globals";
import { getWebsitePagesAdmin } from "@/lib/website-pages";

export const metadata: Metadata = { title: "Website CMS", robots: { index: false, follow: false } };

async function WebsitePagesContent() {
  const [pages, globals] = await Promise.all([getWebsitePagesAdmin(), getSiteGlobalsAdmin()]);
  return (
    <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
      <div className="mx-auto max-w-[1500px]">
        <AdminWebsitePages pages={pages} />
        <AdminSiteGlobals initial={globals} />
      </div>
    </main>
  );
}

export default function AdminWebsitePage() {
  return (
    <Suspense fallback={<main className="min-h-screen px-4 pt-8 text-sm text-mist">Loading website editor…</main>}>
      <AdminGate requireSupabase>
        <WebsitePagesContent />
      </AdminGate>
    </Suspense>
  );
}
