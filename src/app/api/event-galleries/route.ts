import { NextResponse } from "next/server";
import { getActiveEventGalleriesPublic, getEventPhotosSettings } from "@/lib/event-galleries";

export async function GET() {
  const [events, settings] = await Promise.all([getActiveEventGalleriesPublic(), getEventPhotosSettings()]);
  return NextResponse.json({ events, settings });
}