import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";
import { mergeSiteGlobals, type SiteGlobals } from "@/lib/site-globals-types";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const { data, error } = await supabase.from("site_globals").select("content").eq("id", "main").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ globals: mergeSiteGlobals(data?.content) });
}

export async function PATCH(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = (await request.json().catch(() => null)) as { globals?: SiteGlobals } | null;
  if (!body?.globals) return NextResponse.json({ error: "Missing globals payload." }, { status: 400 });

  const globals = mergeSiteGlobals(body.globals);
  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const { error } = await supabase
    .from("site_globals")
    .upsert({ id: "main", content: globals, updated_at: new Date().toISOString() }, { onConflict: "id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  revalidateTag("site-globals", "max");

  return NextResponse.json({ globals });
}