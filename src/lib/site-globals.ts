import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { DEFAULT_SITE_GLOBALS, mergeSiteGlobals, type SiteGlobals } from "@/lib/site-globals-types";

export async function getSiteGlobals(): Promise<SiteGlobals> {
  "use cache";
  cacheLife("minutes");
  cacheTag("site-globals");

  const supabase = createAdminClient();
  if (!supabase) return { ...DEFAULT_SITE_GLOBALS };

  const { data, error } = await supabase.from("site_globals").select("content").eq("id", "main").maybeSingle();
  if (error || !data?.content) return withEnvFallback({ ...DEFAULT_SITE_GLOBALS });
  return withEnvFallback(mergeSiteGlobals(data.content));
}

function withEnvFallback(globals: SiteGlobals): SiteGlobals {
  return {
    ...globals,
    instagram_url: globals.instagram_url || process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    linkedin_url: globals.linkedin_url || process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
  };
}

export async function getSiteGlobalsAdmin(): Promise<SiteGlobals> {
  await connection();
  const supabase = createAdminClient();
  if (!supabase) return { ...DEFAULT_SITE_GLOBALS };

  const { data } = await supabase.from("site_globals").select("content").eq("id", "main").maybeSingle();
  return mergeSiteGlobals(data?.content);
}