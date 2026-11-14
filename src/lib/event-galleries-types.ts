export type EventGalleryEmbedMode = "embed" | "fullscreen";

export type EventGalleryRow = {
  id: string;
  event_name: string;
  event_date: string;
  password: string;
  gallery_url: string;
  embed_mode: EventGalleryEmbedMode;
  is_active: boolean;
  cover_image: string | null;
  created_at?: string;
  updated_at?: string;
};

export type EventGalleryPublic = {
  id: string;
  event_name: string;
  event_date: string;
  cover_image: string | null;
};

export type EventPhotosSettings = {
  hero_button_text: string;
  instagram_headline: string;
  instagram_url: string;
  instagram_button_text: string;
  customization_message: string;
  whatsapp_number: string;
  whatsapp_message: string;
  whatsapp_button_text: string;
  gate_next_label: string;
  password_hint: string;
  password_error: string;
  vault_title: string;
  vault_subtitle: string;
  unlock_button_text: string;
  gallery_whatsapp_label: string;
  gallery_change_event_label: string;
  gallery_fullscreen_label: string;
};

export const DEFAULT_EVENT_PHOTOS_SETTINGS: EventPhotosSettings = {
  hero_button_text: "📸 View & Download Your Event Photos",
  instagram_headline: "Before you view your photos, please follow our Instagram!",
  instagram_url: "https://www.instagram.com/visriva.co/",
  instagram_button_text: "Follow @visriva.co on Instagram",
  customization_message:
    "Need any customisation, edits, or a soft copy of your physical print? We'll make it and send it directly to you!",
  whatsapp_number: "8884484828",
  whatsapp_message:
    "Hi Visriva! I was at your live station and would like customisation / my soft copy photo.",
  whatsapp_button_text: "Message us on WhatsApp",
  gate_next_label: "Next: Access Event Photos →",
  password_hint: "💡 Hint: The password is your event date in DDMM format (e.g., Nov 14th = 1411)",
  password_error: "Incorrect password. Hint: Try DDMM format of your event date, like 1411 for Nov 14th.",
  vault_title: "Visriva Event Photo Vault",
  vault_subtitle: "Select your event and enter the event password to unlock your gallery.",
  unlock_button_text: "Unlock photos",
  gallery_whatsapp_label: "Need customisation? WhatsApp us",
  gallery_change_event_label: "← Change event",
  gallery_fullscreen_label: "Full screen / direct view",
};

function trim(value: unknown, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
}

export function passwordFromEventDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  if (!match) return "";
  const [, , mm, dd] = match;
  return `${dd}${mm}`;
}

export function mergeEventPhotosSettings(partial: unknown): EventPhotosSettings {
  const d = DEFAULT_EVENT_PHOTOS_SETTINGS;
  if (!partial || typeof partial !== "object") return { ...d };
  const p = partial as Partial<EventPhotosSettings>;
  return {
    hero_button_text: trim(p.hero_button_text, 200) || d.hero_button_text,
    instagram_headline: trim(p.instagram_headline, 400) || d.instagram_headline,
    instagram_url: trim(p.instagram_url, 500) || d.instagram_url,
    instagram_button_text: trim(p.instagram_button_text, 120) || d.instagram_button_text,
    customization_message: trim(p.customization_message, 800) || d.customization_message,
    whatsapp_number: trim(p.whatsapp_number, 20).replace(/\D/g, "") || d.whatsapp_number,
    whatsapp_message: trim(p.whatsapp_message, 800) || d.whatsapp_message,
    whatsapp_button_text: trim(p.whatsapp_button_text, 120) || d.whatsapp_button_text,
    gate_next_label: trim(p.gate_next_label, 120) || d.gate_next_label,
    password_hint: trim(p.password_hint, 400) || d.password_hint,
    password_error: trim(p.password_error, 400) || d.password_error,
    vault_title: trim(p.vault_title, 200) || d.vault_title,
    vault_subtitle: trim(p.vault_subtitle, 500) || d.vault_subtitle,
    unlock_button_text: trim(p.unlock_button_text, 80) || d.unlock_button_text,
    gallery_whatsapp_label: trim(p.gallery_whatsapp_label, 120) || d.gallery_whatsapp_label,
    gallery_change_event_label: trim(p.gallery_change_event_label, 80) || d.gallery_change_event_label,
    gallery_fullscreen_label: trim(p.gallery_fullscreen_label, 80) || d.gallery_fullscreen_label,
  };
}

export function normalizeEventGalleryRow(raw: Record<string, unknown>): EventGalleryRow {
  const embed = raw.embed_mode === "fullscreen" ? "fullscreen" : "embed";
  return {
    id: String(raw.id ?? ""),
    event_name: trim(raw.event_name, 200),
    event_date: String(raw.event_date ?? "").slice(0, 10),
    password: trim(raw.password, 32),
    gallery_url: trim(raw.gallery_url, 2000),
    embed_mode: embed,
    is_active: raw.is_active !== false,
    cover_image: raw.cover_image ? trim(raw.cover_image, 2000) : null,
    created_at: raw.created_at ? String(raw.created_at) : undefined,
    updated_at: raw.updated_at ? String(raw.updated_at) : undefined,
  };
}

export const EVENT_GALLERIES_DRAFT_KEY = "event_galleries";
export const EVENT_PHOTOS_SETTINGS_DRAFT_KEY = "event_photos_settings";