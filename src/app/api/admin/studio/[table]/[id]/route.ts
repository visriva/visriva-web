import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";
import { isStudioTable } from "@/lib/studio-tables";

type Context = { params: Promise<{ table: string; id: string }> };

export async function PATCH(request: Request, context: Context) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const { table, id } = await context.params;
  if (!isStudioTable(table)) return NextResponse.json({ error: "Unknown table." }, { status: 400 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Missing body." }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const row =
    table === "studio_bookings" || table === "studio_customers"
      ? body
      : { ...body, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from(table).update(row).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ row: data });
}

export async function DELETE(_request: Request, context: Context) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const { table, id } = await context.params;
  if (!isStudioTable(table)) return NextResponse.json({ error: "Unknown table." }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}