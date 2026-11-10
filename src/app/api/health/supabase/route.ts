import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase-public";

export async function GET() {
  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, configured: false }, { status: 503 });
  }

  const { error } = await supabase.from("services").select("id").limit(1);
  if (error) {
    console.error("Supabase health check failed", error.message);
    return NextResponse.json({ ok: false, configured: true, db: "error" }, { status: 503 });
  }

  return NextResponse.json(
    { ok: true, configured: true, db: "reachable" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
