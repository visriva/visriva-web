import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  const url = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const service = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !service) {
    return NextResponse.json({ ok: false, configured: false, reason: "missing_env" });
  }
  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ ok: false, configured: false, reason: "client" });

  const { error } = await supabase.from("services").select("id").limit(1);
  return NextResponse.json({
    ok: !error,
    configured: true,
    db: error ? "error" : "reachable",
  });
}
