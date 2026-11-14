import "server-only";
import { createAdminClient } from "@/lib/supabase-admin";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif"]);

export async function uploadQrScreenshot(file: File) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Storage is not configured." as const };

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  if (!ALLOWED.has(ext)) return { error: "Use a JPG, PNG, or WebP screenshot." as const };
  if (file.size > MAX_BYTES) return { error: "Screenshot must be under 6 MB." as const };

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType =
    file.type || (ext.startsWith("heic") ? "image/heic" : ext === "png" ? "image/png" : "image/jpeg");

  const { error: uploadError } = await supabase.storage.from("qr-screenshots").upload(path, buffer, {
    contentType,
    upsert: false,
  });
  if (uploadError) return { error: uploadError.message };

  const { data: publicUrl } = supabase.storage.from("qr-screenshots").getPublicUrl(path);
  return { path, url: publicUrl.publicUrl };
}