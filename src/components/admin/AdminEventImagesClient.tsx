"use client";

import { Copy, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminFloatingSaveBar } from "@/components/admin/AdminFloatingSaveBar";
import { UniversalImageUploader } from "@/components/admin/UniversalImageUploader";
import {
  EVENT_GALLERIES_DRAFT_KEY,
  EVENT_PHOTOS_SETTINGS_DRAFT_KEY,
  mergeEventPhotosSettings,
  normalizeEventGalleryRow,
  passwordFromEventDate,
  type EventGalleryRow,
  type EventPhotosSettings,
} from "@/lib/event-galleries-types";
import { clearAdminDraft, readAdminDraft, stashAdminDraft } from "@/lib/admin-draft-storage";
import { resolveGalleryEmbed } from "@/lib/gallery-embed";

const input = "field mt-2";

type Props = {
  initialSettings: EventPhotosSettings;
  initialRows: EventGalleryRow[];
};

export function AdminEventImagesClient({ initialSettings, initialRows }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [settingsDirty, setSettingsDirty] = useState(false);
  const [rows, setRows] = useState(initialRows);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Partial<EventGalleryRow> | null>(null);
  const [passwordManual, setPasswordManual] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/admin/event-galleries");
    const body = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      const local = readAdminDraft<EventGalleryRow[]>(EVENT_GALLERIES_DRAFT_KEY);
      if (local?.length) {
        setRows(local);
        setFallbackMode(true);
        setNotice("Using local draft (apply Supabase migration to sync).");
      }
      return;
    }
    setRows((body.rows ?? []) as EventGalleryRow[]);
    setFallbackMode(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function startCreate() {
    setDraft({
      event_name: "",
      event_date: new Date().toISOString().slice(0, 10),
      password: passwordFromEventDate(new Date().toISOString().slice(0, 10)),
      gallery_url: "",
      embed_mode: "embed",
      is_active: true,
      cover_image: null,
    });
    setPasswordManual(false);
    setError("");
  }

  function onDraftDateChange(date: string) {
    if (!draft) return;
    const next = { ...draft, event_date: date };
    if (!passwordManual) next.password = passwordFromEventDate(date);
    setDraft(next);
  }

  async function saveSettings() {
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/event-photos-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      if (body.useClientFallback) {
        stashAdminDraft(EVENT_PHOTOS_SETTINGS_DRAFT_KEY, settings);
        setFallbackMode(true);
        setNotice("Settings saved locally — run DB migration to persist.");
        setSettingsDirty(false);
        return;
      }
      setError(typeof body.error === "string" ? body.error : "Could not save settings.");
      return;
    }
    clearAdminDraft(EVENT_PHOTOS_SETTINGS_DRAFT_KEY);
    setSettings(mergeEventPhotosSettings(body.settings));
    setSettingsDirty(false);
    setNotice("Popup copy saved.");
  }

  async function createEvent() {
    if (!draft?.event_name || !draft.event_date || !draft.gallery_url || !draft.password) {
      setError("Fill event name, date, gallery link, and password.");
      return;
    }
    setPending(true);
    const response = await fetch("/api/admin/event-galleries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      if (body.useClientFallback) {
        const local = readAdminDraft<EventGalleryRow[]>(EVENT_GALLERIES_DRAFT_KEY) ?? rows;
        const id = crypto.randomUUID();
        const row = normalizeEventGalleryRow({ ...draft, id, created_at: new Date().toISOString() });
        const next = [row, ...local];
        stashAdminDraft(EVENT_GALLERIES_DRAFT_KEY, next);
        setRows(next);
        setFallbackMode(true);
        setDraft(null);
        setNotice("Event saved locally — apply migration to sync.");
        return;
      }
      setError(typeof body.error === "string" ? body.error : "Could not create event.");
      return;
    }
    setDraft(null);
    setNotice("Event gallery created.");
    await refresh();
  }

  async function patchRow(id: string, patch: Record<string, unknown>) {
    setPending(true);
    const response = await fetch(`/api/admin/event-galleries/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      if (body.useClientFallback) {
        const next = rows.map((r) => (r.id === id ? { ...r, ...patch } as EventGalleryRow : r));
        stashAdminDraft(EVENT_GALLERIES_DRAFT_KEY, next);
        setRows(next);
        setFallbackMode(true);
        return;
      }
      setError("Update failed.");
      return;
    }
    if (body.row) setRows((list) => list.map((r) => (r.id === id ? (body.row as EventGalleryRow) : r)));
  }

  async function deleteRow(id: string) {
    if (!confirm("Delete this event gallery?")) return;
    setPending(true);
    const response = await fetch(`/api/admin/event-galleries/${encodeURIComponent(id)}`, { method: "DELETE" });
    setPending(false);
    if (!response.ok) {
      const next = rows.filter((r) => r.id !== id);
      stashAdminDraft(EVENT_GALLERIES_DRAFT_KEY, next);
      setRows(next);
      setFallbackMode(true);
      return;
    }
    setRows((list) => list.filter((r) => r.id !== id));
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice("Copied to clipboard.");
    } catch {
      setError("Could not copy.");
    }
  }

  return (
    <div className="space-y-10 pb-24">
      {fallbackMode ? (
        <p className="rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-champagne">
          Local draft mode — run <code className="text-gold-2">supabase/migrations/20261114220000_event_galleries.sql</code> on production Supabase.
        </p>
      ) : null}

      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-royal text-[0.62rem] uppercase tracking-[0.28em] text-gold">QR guest flow</p>
          <h1 className="font-display text-4xl italic text-cream">Event images</h1>
          <p className="mt-2 max-w-2xl text-sm text-mist">Manage password-protected galleries for <Link href="/qr?tab=photos" className="text-gold-2 underline">/qr</Link> guests.</p>
        </div>
        <button type="button" onClick={startCreate} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-champagne">
          <Plus className="h-4 w-4" />
          New event gallery
        </button>
      </header>

      <section className="space-y-4 rounded-2xl border border-gold/20 bg-white/[0.02] p-5 sm:p-6">
        <h2 className="font-royal text-[0.62rem] uppercase tracking-[0.22em] text-gold">Gatekeeper popup copy</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <SettingsField label="Hero CTA on /qr" value={settings.hero_button_text} onChange={(v) => { setSettings({ ...settings, hero_button_text: v }); setSettingsDirty(true); }} />
          <SettingsField label="Instagram URL" value={settings.instagram_url} onChange={(v) => { setSettings({ ...settings, instagram_url: v }); setSettingsDirty(true); }} />
          <SettingsField label="Instagram headline" value={settings.instagram_headline} multiline onChange={(v) => { setSettings({ ...settings, instagram_headline: v }); setSettingsDirty(true); }} />
          <SettingsField label="Instagram button" value={settings.instagram_button_text} onChange={(v) => { setSettings({ ...settings, instagram_button_text: v }); setSettingsDirty(true); }} />
          <SettingsField label="WhatsApp number" value={settings.whatsapp_number} onChange={(v) => { setSettings({ ...settings, whatsapp_number: v }); setSettingsDirty(true); }} />
          <SettingsField label="WhatsApp button" value={settings.whatsapp_button_text} onChange={(v) => { setSettings({ ...settings, whatsapp_button_text: v }); setSettingsDirty(true); }} />
          <SettingsField label="Customisation message" value={settings.customization_message} multiline onChange={(v) => { setSettings({ ...settings, customization_message: v }); setSettingsDirty(true); }} />
          <SettingsField label="WhatsApp prefill" value={settings.whatsapp_message} multiline onChange={(v) => { setSettings({ ...settings, whatsapp_message: v }); setSettingsDirty(true); }} />
          <SettingsField label="Next button label" value={settings.gate_next_label} onChange={(v) => { setSettings({ ...settings, gate_next_label: v }); setSettingsDirty(true); }} />
          <SettingsField label="Password hint" value={settings.password_hint} multiline onChange={(v) => { setSettings({ ...settings, password_hint: v }); setSettingsDirty(true); }} />
          <SettingsField label="Wrong password message" value={settings.password_error} multiline onChange={(v) => { setSettings({ ...settings, password_error: v }); setSettingsDirty(true); }} />
        </div>
        {settingsDirty ? (
          <button type="button" disabled={pending} onClick={() => void saveSettings()} className="rounded-full border border-gold/40 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-cream">
            Save popup copy
          </button>
        ) : null}
      </section>

      {draft ? (
        <section className="space-y-4 rounded-2xl border border-gold/25 bg-white/[0.02] p-5 sm:p-6">
          <h2 className="font-display text-2xl text-cream">New event gallery</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-mist">
              Event name
              <input className={input} value={draft.event_name ?? ""} onChange={(e) => setDraft({ ...draft, event_name: e.target.value })} />
            </label>
            <label className="text-sm text-mist">
              Event date
              <input type="date" className={input} value={draft.event_date ?? ""} onChange={(e) => onDraftDateChange(e.target.value)} />
            </label>
            <label className="text-sm text-mist">
              Password (DDMM)
              <input
                className={input}
                value={draft.password ?? ""}
                onChange={(e) => {
                  setPasswordManual(true);
                  setDraft({ ...draft, password: e.target.value });
                }}
              />
            </label>
            <label className="text-sm text-mist">
              Display mode
              <select className={input} value={draft.embed_mode ?? "embed"} onChange={(e) => setDraft({ ...draft, embed_mode: e.target.value as "embed" | "fullscreen" })}>
                <option value="embed">Embed inside visriva.com (recommended)</option>
                <option value="fullscreen">Branded full-screen frame</option>
              </select>
            </label>
            <label className="text-sm text-mist md:col-span-2">
              Gallery link
              <input className={input} placeholder="Google Drive folder, Pixieset, etc." value={draft.gallery_url ?? ""} onChange={(e) => setDraft({ ...draft, gallery_url: e.target.value })} />
            </label>
            <div className="md:col-span-2">
              <UniversalImageUploader
                label="Cover image (recommended 800×600)"
                preset="service"
                slot="event_gallery_cover"
                value={draft.cover_image ?? ""}
                onChange={(url) => setDraft({ ...draft, cover_image: url })}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={pending} onClick={() => void createEvent()} className="rounded-full bg-gold/20 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-cream">
              Create event
            </button>
            <button type="button" onClick={() => setDraft(null)} className="rounded-full border border-gold/30 px-6 py-3 text-[10px] uppercase tracking-[0.14em] text-mist">
              Cancel
            </button>
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gold/20 bg-white/[0.02] p-5 sm:p-6">
        <h2 className="font-royal text-[0.62rem] uppercase tracking-[0.22em] text-gold">Event galleries</h2>
        {loading ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-mist">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </p>
        ) : rows.length === 0 ? (
          <p className="mt-4 text-sm text-mist">No events yet. Create one above.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {rows.map((row) => (
              <EventRowCard key={row.id} row={row} pending={pending} onCopy={copyText} onPatch={patchRow} onDelete={deleteRow} />
            ))}
          </ul>
        )}
      </section>

      <AdminFloatingSaveBar dirty={settingsDirty} pending={pending} onSave={() => void saveSettings()} notice={notice} error={error} previewHref="/qr?tab=photos" />
    </div>
  );
}

function SettingsField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="text-sm text-mist">
      {label}
      {multiline ? (
        <textarea className={`${input} min-h-20`} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={input} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function EventRowCard({
  row,
  pending,
  onCopy,
  onPatch,
  onDelete,
}: {
  row: EventGalleryRow;
  pending: boolean;
  onCopy: (t: string) => void;
  onPatch: (id: string, patch: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const embed = resolveGalleryEmbed(row.gallery_url);
  const previewHref = `/qr?tab=photos`;

  return (
    <li className="rounded-2xl border border-gold/20 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xl text-cream">{row.event_name}</p>
          <p className="text-xs text-mist">{row.event_date}</p>
          <button type="button" onClick={() => onCopy(row.password)} className="mt-2 inline-flex items-center gap-1 rounded-full border border-gold/30 px-3 py-1 text-[10px] font-mono text-gold-2">
            {row.password}
            <Copy className="h-3 w-3" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={previewHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-gold/35 px-3 py-2 text-[10px] uppercase tracking-wider text-champagne">
            Test on /qr
            <ExternalLink className="h-3 w-3" />
          </a>
          <button
            type="button"
            disabled={pending}
            onClick={() => onPatch(row.id, { is_active: !row.is_active })}
            className={`rounded-full px-3 py-2 text-[10px] uppercase tracking-wider ${row.is_active ? "border border-emerald-400/40 text-emerald-200" : "border border-mist/40 text-mist"}`}
          >
            {row.is_active ? "Active" : "Hidden"}
          </button>
          <button type="button" onClick={() => onDelete(row.id)} className="grid h-9 w-9 place-items-center rounded-full border border-red-400/30 text-red-300" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <label className="mt-4 block text-xs text-mist">
        Gallery URL
        <input
          className="field mt-1 font-mono text-xs"
          defaultValue={row.gallery_url}
          onBlur={(e) => {
            if (e.target.value !== row.gallery_url) onPatch(row.id, { gallery_url: e.target.value });
          }}
        />
      </label>
      <p className="mt-2 text-[10px] text-mist">
        Embed preview: <span className="text-gold-2">{embed.provider}</span> → {embed.embedUrl.slice(0, 80)}…
      </p>
    </li>
  );
}