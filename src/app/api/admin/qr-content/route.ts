import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { mergeQrPageContent, type QrPageContent } from "@/lib/qr-content-types";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const { data, error } = await supabase.from("qr_page_content").select("content, updated_at").eq("id", "qr_page").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const content = mergeQrPageContent(data?.content);
  return NextResponse.json({ content, updated_at: data?.updated_at ?? null });
}

export async function PATCH(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = (await request.json().catch(() => null)) as { content?: unknown } | null;
  if (!body?.content || typeof body.content !== "object") {
    return NextResponse.json({ error: "Send a content object." }, { status: 400 });
  }

  const content: QrPageContent = mergeQrPageContent(body.content);

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const row = {
    id: "qr_page",
    content,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("qr_page_content").upsert(row, { onConflict: "id" }).select("content, updated_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag("qr-page-content", "max");
  revalidatePath("/qr");
  revalidatePath("/");

  return NextResponse.json({ content: mergeQrPageContent(data.content), ok: true });
}