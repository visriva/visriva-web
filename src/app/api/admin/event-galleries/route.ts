import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { normalizeEventGalleryRow } from "@/lib/event-galleries-types";
import { listEventGalleriesAdmin } from "@/lib/event-galleries";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";

function revalidateEventPhotos() {
  revalidateTag("event-galleries", "max");
  revalidatePath("/qr");
}

export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const rows = await listEventGalleriesAdmin();
  const supabase = createAdminClient();
  return NextResponse.json({
    rows,
    supabase: Boolean(supabase),
    tableReady: supabase ? rows.length >= 0 : false,
  });
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body?.event_name || !body?.event_date || !body?.gallery_url) {
    return NextResponse.json({ error: "Event name, date, and gallery link are required." }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured.", useClientFallback: true }, { status: 503 });
  }

  const row = {
    event_name: String(body.event_name).trim().slice(0, 200),
    event_date: String(body.event_date).slice(0, 10),
    password: String(body.password ?? "").trim().slice(0, 32),
    gallery_url: String(body.gallery_url).trim().slice(0, 2000),
    embed_mode: body.embed_mode === "fullscreen" ? "fullscreen" : "embed",
    is_active: body.is_active !== false,
    cover_image: body.cover_image ? String(body.cover_image).trim().slice(0, 2000) : null,
    updated_at: new Date().toISOString(),
  };

  if (!row.password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const { data, error } = await supabase.from("event_galleries").insert(row).select("*").single();
  if (error) {
    return NextResponse.json({ error: error.message, useClientFallback: error.message.includes("does not exist") }, { status: 500 });
  }

  revalidateEventPhotos();
  return NextResponse.json({ row: normalizeEventGalleryRow(data as Record<string, unknown>) });
}