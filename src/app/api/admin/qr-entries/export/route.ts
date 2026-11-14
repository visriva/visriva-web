import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";

function csvEscape(value: string) {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const { data, error } = await supabase
    .from("qr_giveaway_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const header = ["created_at", "full_name", "instagram_handle", "phone", "station", "screenshot_url"].join(",");
  const rows = (data ?? []).map((row) =>
  [
    csvEscape(String(row.created_at ?? "")),
    csvEscape(String(row.full_name ?? "")),
    csvEscape(String(row.instagram_handle ?? "")),
    csvEscape(String(row.phone ?? "")),
    csvEscape(String(row.station ?? "")),
    csvEscape(String(row.screenshot_url ?? "")),
  ].join(","),
);

  const body = [header, ...rows].join("\n");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="visriva-qr-giveaway-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}