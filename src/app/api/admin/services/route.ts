import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getAllServicesAdmin } from "@/lib/services-catalog";
import { parseServiceBody, saveServiceRow } from "@/lib/admin-service-mutate";
import { revalidatePublicServices } from "@/lib/revalidate-catalog";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const rows = await getAllServicesAdmin();
  return NextResponse.json({ services: rows });
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = await request.json().catch(() => null);
  const parsed = parseServiceBody(body, true);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const saved = await saveServiceRow(parsed);
  if ("error" in saved) return NextResponse.json({ error: saved.error }, { status: 500 });

  if (parsed.publish_status === "published") revalidatePublicServices();

  return NextResponse.json({ service: saved.data }, { status: 201 });
}
