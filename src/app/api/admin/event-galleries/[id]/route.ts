import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { normalizeEventGalleryRow } from "@/lib/event-galleries-types";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";

type Context = { params: Promise<{ id: string }> };

function revalidateEventPhotos() {
  revalidateTag("event-galleries", "max");
  revalidatePath("/qr");
}

export async function PATCH(request: Request, context: Context) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const { id } = await context.params;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Missing body." }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured.", useClientFallback: true }, { status: 503 });

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.event_name !== undefined) patch.event_name = String(body.event_name).trim().slice(0, 200);
  if (body.event_date !== undefined) patch.event_date = String(body.event_date).slice(0, 10);
  if (body.password !== undefined) patch.password = String(body.password).trim().slice(0, 32);
  if (body.gallery_url !== undefined) patch.gallery_url = String(body.gallery_url).trim().slice(0, 2000);
  if (body.embed_mode !== undefined) patch.embed_mode = body.embed_mode === "fullscreen" ? "fullscreen" : "embed";
  if (body.is_active !== undefined) patch.is_active = Boolean(body.is_active);
  if (body.cover_image !== undefined) patch.cover_image = body.cover_image ? String(body.cover_image).trim().slice(0, 2000) : null;

  const { data, error } = await supabase.from("event_galleries").update(patch).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateEventPhotos();
  return NextResponse.json({ row: normalizeEventGalleryRow(data as Record<string, unknown>) });
}

export async function DELETE(_request: Request, context: Context) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const { id } = await context.params;

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured.", useClientFallback: true }, { status: 503 });

  const { error } = await supabase.from("event_galleries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateEventPhotos();
  return NextResponse.json({ ok: true });
}