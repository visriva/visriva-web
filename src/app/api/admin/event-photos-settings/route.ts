import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { mergeEventPhotosSettings } from "@/lib/event-galleries-types";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ settings: mergeEventPhotosSettings(null), supabase: false });
  }

  const { data, error } = await supabase.from("event_photos_settings").select("content, updated_at").eq("id", "main").maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message, useClientFallback: true }, { status: 500 });
  }

  return NextResponse.json({
    settings: mergeEventPhotosSettings(data?.content),
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

  const settings = mergeEventPhotosSettings(body.settings);

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured.", useClientFallback: true }, { status: 503 });
  }

  const row = {
    id: "main",
    content: settings,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("event_photos_settings").upsert(row, { onConflict: "id" }).select("content, updated_at").single();
  if (error) {
    return NextResponse.json({ error: error.message, useClientFallback: true }, { status: 500 });
  }

  revalidateTag("event-photos-settings", "max");
  revalidatePath("/qr");

  return NextResponse.json({ settings: mergeEventPhotosSettings(data.content), ok: true });
}