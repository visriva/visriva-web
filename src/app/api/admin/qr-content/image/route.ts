import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["jpg", "jpeg", "png", "webp", "gif", "heic", "heif", "avif", "svg"]);

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  const slot = String(form?.get("slot") ?? "asset").replace(/[^a-z0-9_-]/gi, "").slice(0, 40);

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  if (!ALLOWED.has(ext)) return NextResponse.json({ error: "Unsupported image format." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be under 8 MB." }, { status: 400 });

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const path = `cms/${slot}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from("qr-screenshots").upload(path, buffer, {
    contentType: file.type || `image/${ext}`,
    upsert: true,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 400 });

  const { data: publicUrl } = supabase.storage.from("qr-screenshots").getPublicUrl(path);
  return NextResponse.json({ url: publicUrl.publicUrl, path });
}