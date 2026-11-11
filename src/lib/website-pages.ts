import "server-only";
import { connection } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export type WebsitePage = {
  slug: string;
  name: string;
  status: "draft" | "published";
  eyebrow: string;
  hero_title: string;
  hero_accent: string;
  hero_description: string;
  hero_image: string;
  hero_alt: string;
  intro_title: string;
  intro_copy: string;
  closing_title: string;
  closing_copy: string;
  seo_title: string;
  seo_description: string;
  og_image: string;
  updated_at?: string;
};

export async function getWebsitePage(slug: string): Promise<WebsitePage | null> {
  await connection();
  const supabase = createAdminClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("website_pages").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error || !data) return null;
  return data as WebsitePage;
}

export async function getWebsitePagesAdmin(): Promise<WebsitePage[]> {
  await connection();
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data } = await supabase.from("website_pages").select("*").order("name");
  return (data ?? []) as WebsitePage[];
}
