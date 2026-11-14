import { NextResponse } from "next/server";
import { getEventGalleryById, getEventPhotosSettings } from "@/lib/event-galleries";
import { pickGalleryFrameUrl, resolveGalleryEmbed } from "@/lib/gallery-embed";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { eventId?: string; password?: string } | null;
  const eventId = String(body?.eventId ?? "").trim();
  const password = String(body?.password ?? "").trim();

  if (!eventId || !password) {
    return NextResponse.json({ error: "Select an event and enter the password." }, { status: 400 });
  }

  const event = await getEventGalleryById(eventId);
  if (!event || !event.is_active) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  if (password !== event.password.trim()) {
    const settings = await getEventPhotosSettings();
    return NextResponse.json({ error: settings.password_error }, { status: 401 });
  }

  const resolution = resolveGalleryEmbed(event.gallery_url);
  const frameUrl = pickGalleryFrameUrl(resolution, event.embed_mode, false);

  return NextResponse.json({
    ok: true,
    event_name: event.event_name,
    event_date: event.event_date,
    embed_mode: event.embed_mode,
    provider: resolution.provider,
    frameUrl,
    directUrl: resolution.directUrl,
    embedUrl: resolution.embedUrl,
    likelyEmbeddable: resolution.likelyEmbeddable,
    cover_image: event.cover_image,
  });
}