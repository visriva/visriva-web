import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { mergeGoogleReviewSettings } from "@/lib/google-review-types";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ settings: mergeGoogleReviewSettings(null), supabase: false });
  }

  const { data, error } = await supabase.from("google_review_settings").select("content, updated_at").eq("id", "main").maybeSingle();
  if (error) return NextResponse.json({ error: error.message, useClientFallback: true }, { status: 500 });

  return NextResponse.json({
    settings: mergeGoogleReviewSettings(data?.content),
    updated_at: data?.updated_at ?? null,
    supabase: true,
  });
}

export async function PATCH(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = (await request.json().catch(() => null)) as { settings?: unknown } | null;
  if (!body?.settings || typeof body.settings !== "object") {
    return NextResponse.json({ error: "Send a settings object." }, { status: 400 });
  }

  const settings = mergeGoogleReviewSettings(body.settings);
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured.", useClientFallback: true }, { status: 503 });
  }

  const row = {
    id: "main",
    content: settings,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("google_review_settings").upsert(row, { onConflict: "id" }).select("content").single();
  if (error) return NextResponse.json({ error: error.message, useClientFallback: true }, { status: 500 });

  revalidatePath("/reviews");
  revalidatePath("/qr");
  revalidatePath("/");

  return NextResponse.json({ settings: mergeGoogleReviewSettings(data.content), ok: true });
}