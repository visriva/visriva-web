import "server-only";
import { connection } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import {
  mergeEventPhotosSettings,
  normalizeEventGalleryRow,
  type EventGalleryPublic,
  type EventGalleryRow,
  type EventPhotosSettings,
} from "@/lib/event-galleries-types";

export async function getEventPhotosSettings(): Promise<EventPhotosSettings> {
  await connection();

  const supabase = createAdminClient();
  if (!supabase) return mergeEventPhotosSettings(null);

  const { data, error } = await supabase.from("event_photos_settings").select("content").eq("id", "main").maybeSingle();
  if (error) return mergeEventPhotosSettings(null);
  return mergeEventPhotosSettings(data?.content);
}

export async function getActiveEventGalleriesPublic(): Promise<EventGalleryPublic[]> {
  await connection();

  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("event_galleries")
    .select("id, event_name, event_date, cover_image")
    .eq("is_active", true)
    .order("event_date", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: String(row.id),
    event_name: String(row.event_name),
    event_date: String(row.event_date).slice(0, 10),
    cover_image: row.cover_image ? String(row.cover_image) : null,
  }));
}

export async function listEventGalleriesAdmin(): Promise<EventGalleryRow[]> {
  await connection();

  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("event_galleries").select("*").order("event_date", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => normalizeEventGalleryRow(row as Record<string, unknown>));
}

export async function getEventGalleryById(id: string): Promise<EventGalleryRow | null> {
  await connection();

  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("event_galleries").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return normalizeEventGalleryRow(data as Record<string, unknown>);
}