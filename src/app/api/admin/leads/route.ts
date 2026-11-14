import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(400);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ leads: data ?? [] });
}