import { NextResponse } from "next/server";
import { getGoogleReviewSettings } from "@/lib/google-review";

export async function GET() {
  const settings = await getGoogleReviewSettings();
  return NextResponse.json({ settings }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}