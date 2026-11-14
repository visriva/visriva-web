import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createPublicClient } from "@/lib/supabase-public";
import { QR_GIVEAWAY_STATIONS, type QrFormMode, type QrPageSettings } from "@/lib/qr-constants";
import { whatsAppNumber } from "@/lib/whatsapp";

export type { QrFormMode, QrPageSettings, QrGiveawayStation, QrGiveawayEntry } from "@/lib/qr-constants";
export { QR_GIVEAWAY_STATIONS };

function defaultSettings(): QrPageSettings {
  return {
    id: "qr_page",
    form_mode: "native",
    external_form_url: null,
    whatsapp_number: null,
    updated_at: new Date().toISOString(),
  };
}

function normalize(row: Record<string, unknown>): QrPageSettings {
  const mode = row.form_mode === "external" ? "external" : "native";
  const external = String(row.external_form_url ?? "").trim();
  const whatsapp = String(row.whatsapp_number ?? "").trim();
  return {
    id: "qr_page",
    form_mode: mode,
    external_form_url: external || null,
    whatsapp_number: whatsapp || null,
    updated_at: String(row.updated_at ?? new Date().toISOString()),
  };
}

export function resolveQrWhatsAppDigits(settings: QrPageSettings): string {
  const override = (settings.whatsapp_number ?? "").replace(/\D/g, "");
  if (override) return override;
  return whatsAppNumber();
}

export function canEmbedExternalForm(url: string | null): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host.includes("docs.google.com") ||
      host === "forms.gle" ||
      host.endsWith("typeform.com") ||
      host.endsWith("tally.so")
    );
  } catch {
    return false;
  }
}

export async function getQrPageSettings(): Promise<QrPageSettings> {
  "use cache";
  cacheLife("minutes");
  cacheTag("qr-page-settings");

  const supabase = createPublicClient();
  if (!supabase) return defaultSettings();

  const { data, error } = await supabase
    .from("qr_page_settings")
    .select("*")
    .eq("id", "qr_page")
    .maybeSingle();

  if (error || !data) return defaultSettings();
  return normalize(data as Record<string, unknown>);
}

export async function getQrPageSettingsAdmin(): Promise<QrPageSettings> {
  await connection();
  const supabase = createAdminClient();
  if (!supabase) return defaultSettings();

  const { data, error } = await supabase
    .from("qr_page_settings")
    .select("*")
    .eq("id", "qr_page")
    .maybeSingle();

  if (error || !data) return defaultSettings();
  return normalize(data as Record<string, unknown>);
}
