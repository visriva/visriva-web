import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";
import type { QrFormMode } from "@/lib/qr-page";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const { data, error } = await supabase.from("qr_page_settings").select("*").eq("id", "qr_page").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PATCH(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const form_mode: QrFormMode = body?.form_mode === "external" ? "external" : "native";
  const external_form_url = String(body?.external_form_url ?? "").trim().slice(0, 2000) || null;
  const whatsapp_number = String(body?.whatsapp_number ?? "").trim().slice(0, 30) || null;

  if (form_mode === "external" && external_form_url) {
    try {
      const parsed = new URL(external_form_url);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return NextResponse.json({ error: "Form link must start with https:// or http://" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Enter a valid form URL." }, { status: 400 });
    }
  }

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const row = {
    id: "qr_page",
    form_mode,
    external_form_url: form_mode === "external" ? external_form_url : null,
    whatsapp_number,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("qr_page_settings").upsert(row, { onConflict: "id" }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag("qr-page-settings", "max");
  revalidatePath("/qr");

  return NextResponse.json({ settings: data, ok: true });
}