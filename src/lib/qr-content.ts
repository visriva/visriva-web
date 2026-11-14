import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { mergeQrPageContent, type QrPageContent } from "@/lib/qr-content-types";
import { createAdminClient } from "@/lib/supabase-admin";
import { createPublicClient } from "@/lib/supabase-public";

export type { QrPageContent } from "@/lib/qr-content-types";
export { mergeQrPageContent, DEFAULT_QR_PAGE_CONTENT } from "@/lib/qr-content-types";

export async function getQrPageContent(): Promise<QrPageContent> {
  "use cache";
  cacheLife("minutes");
  cacheTag("qr-page-content");

  const supabase = createPublicClient();
  if (!supabase) return mergeQrPageContent(null);

  const { data } = await supabase.from("qr_page_content").select("content").eq("id", "qr_page").maybeSingle();
  return mergeQrPageContent(data?.content);
}

export async function getQrPageContentAdmin(): Promise<QrPageContent> {
  await connection();
  const supabase = createAdminClient();
  if (!supabase) return mergeQrPageContent(null);
  const { data } = await supabase.from("qr_page_content").select("content").eq("id", "qr_page").maybeSingle();
  return mergeQrPageContent(data?.content);
}