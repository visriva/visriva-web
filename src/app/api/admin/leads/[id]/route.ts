import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";

const STATUSES = new Set(["new", "contacted", "quoted", "confirmed", "closed"]);

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const { id } = await context.params;

  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  const status = body?.status?.trim();
  if (!status || !STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const { data, error } = await supabase.from("leads").update({ status }).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ lead: data });
}

export async function DELETE(_request: Request, context: Context) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const { id } = await context.params;

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}