import "server-only";
import { connection } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { mergeGoogleReviewSettings, type GoogleReviewSettings } from "@/lib/google-review-types";

export async function getGoogleReviewSettings(): Promise<GoogleReviewSettings> {
  await connection();

  const supabase = createAdminClient();
  if (!supabase) return mergeGoogleReviewSettings(null);

  const { data, error } = await supabase.from("google_review_settings").select("content").eq("id", "main").maybeSingle();
  if (error) return mergeGoogleReviewSettings(null);
  return mergeGoogleReviewSettings(data?.content);
}