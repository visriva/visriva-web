import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";
import { parseServiceBody, saveServiceRow } from "@/lib/admin-service-mutate";
import { revalidatePublicServices } from "@/lib/revalidate-catalog";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const { id } = await context.params;
  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const { data, error } = await supabase.from("services").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: "Service not found." }, { status: 404 });
  return NextResponse.json({ service: data });
}

export async function PATCH(request: Request, context: Context) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const { id } = await context.params;

  const body = await request.json().catch(() => null);
  const parsed = parseServiceBody({ ...(body as object), id }, false);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const saved = await saveServiceRow({ ...parsed, id }, id);
  if ("error" in saved) return NextResponse.json({ error: saved.error }, { status: 500 });

  if (parsed.publish_status === "published") revalidatePublicServices();

  return NextResponse.json({ service: saved.data });
}
