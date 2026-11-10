import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminWebsitePages } from "@/components/admin/AdminWebsitePages";
import { getWebsitePagesAdmin } from "@/lib/website-pages";

export const metadata: Metadata = { title: "Website CMS", robots: { index: false, follow: false } };

export default async function AdminWebsitePage() {
  const pages = await getWebsitePagesAdmin();
  return <AdminGate requireSupabase><main className="px-4 pb-24 pt-28 sm:px-6 lg:px-10 lg:pt-10"><div className="mx-auto max-w-[1500px]"><AdminWebsitePages pages={pages}/></div></main></AdminGate>;
}
