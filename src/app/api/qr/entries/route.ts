import { NextResponse } from "next/server";
import { cleanText } from "@/lib/format";
import { QR_GIVEAWAY_STATIONS } from "@/lib/qr-page";
import { uploadQrScreenshot } from "@/lib/qr-upload";
import { createAdminClient } from "@/lib/supabase-admin";
import { isValidIndianMobile } from "@/lib/validation";

const stationSet = new Set<string>(QR_GIVEAWAY_STATIONS);

function normalizeInstagram(handle: string) {
  const trimmed = handle.trim();
  const core = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  if (!/^[a-zA-Z0-9._]{1,30}$/.test(core)) return null;
  return `@${core.toLowerCase()}`;
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Could not read your entry." }, { status: 400 });

  if (cleanText(form.get("website"), 120)) {
    return NextResponse.json({ ok: true });
  }

  const full_name = cleanText(form.get("full_name"), 160);
  const instagram_handle = normalizeInstagram(String(form.get("instagram_handle") ?? ""));
  const phone = cleanText(form.get("phone"), 30);
  const station = cleanText(form.get("station"), 80);
  const screenshot = form.get("screenshot");

  if (!full_name) {
    return NextResponse.json({ error: "Add your full name." }, { status: 400 });
  }
  if (!instagram_handle) {
    return NextResponse.json({ error: "Add a valid Instagram handle (e.g. @visriva.co)." }, { status: 400 });
  }
  if (!phone || !isValidIndianMobile(phone)) {
    return NextResponse.json({ error: "Enter a valid Indian WhatsApp/mobile number." }, { status: 400 });
  }
  if (!station || !stationSet.has(station)) {
    return NextResponse.json({ error: "Choose which Visriva station you visited." }, { status: 400 });
  }
  if (!(screenshot instanceof File) || screenshot.size === 0) {
    return NextResponse.json({ error: "Upload a screenshot of your Instagram post tagging @visriva.co." }, { status: 400 });
  }

  const uploaded = await uploadQrScreenshot(screenshot);
  if ("error" in uploaded) {
    return NextResponse.json({ error: uploaded.error }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Entries are temporarily unavailable. Please try again or message us on WhatsApp." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("qr_giveaway_entries").insert({
    full_name,
    instagram_handle,
    phone,
    station,
    screenshot_path: uploaded.path,
    screenshot_url: uploaded.url,
  });

  if (error) {
    console.error("QR giveaway insert failed", error.message);
    return NextResponse.json({ error: "We could not save your entry. Please try again." }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}