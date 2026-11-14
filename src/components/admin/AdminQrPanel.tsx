"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { QrGiveawayEntry, QrPageSettings } from "@/lib/qr-constants";

const when = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export function AdminQrPanel({
  initialSettings,
  initialEntries,
}: {
  initialSettings: QrPageSettings;
  initialEntries: QrGiveawayEntry[];
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [entries, setEntries] = useState(initialEntries);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const liveHref = useMemo(() => {
    if (settings.form_mode === "external" && settings.external_form_url) {
      return settings.external_form_url;
    }
    return "/qr#qr-entry";
  }, [settings]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setNotice("");
    setError("");

    const response = await fetch("/api/admin/qr-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form_mode: settings.form_mode,
        external_form_url: settings.external_form_url,
        whatsapp_number: settings.whatsapp_number,
      }),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);

    if (!response.ok) {
      setError(typeof body.error === "string" ? body.error : "Could not save settings.");
      return;
    }

    if (body.settings) setSettings(body.settings as QrPageSettings);
    setNotice("Saved — visriva.com/qr is updated.");

    const refresh = await fetch("/api/admin/qr-entries");
    if (refresh.ok) {
      const data = await refresh.json();
      setEntries(data.entries ?? entries);
    }
  }

  return (
    <div className="space-y-12">
      <form onSubmit={save} className="max-w-2xl space-y-6 rounded-2xl border border-gold/25 bg-[#0D2117] p-6 sm:p-8">
        <div>
          <p className="font-royal text-[0.62rem] uppercase tracking-[0.28em] text-gold">QR giveaway settings</p>
          <h1 className="mt-2 font-display text-4xl italic text-cream">visriva.com/qr</h1>
          <p className="mt-3 text-sm text-mist">
            Control the guest QR landing form destination and WhatsApp soft-copy number.
          </p>
        </div>

        <fieldset className="space-y-3">
          <legend className="section-kicker">Form destination</legend>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gold/20 px-4 py-3 text-sm text-champagne">
            <input
              type="radio"
              name="form_mode"
              checked={settings.form_mode === "native"}
              onChange={() => setSettings((s) => ({ ...s, form_mode: "native" }))}
            />
            Use built-in native form
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gold/20 px-4 py-3 text-sm text-champagne">
            <input
              type="radio"
              name="form_mode"
              checked={settings.form_mode === "external"}
              onChange={() => setSettings((s) => ({ ...s, form_mode: "external" }))}
            />
            Use custom external form link
          </label>
        </fieldset>

        {settings.form_mode === "external" ? (
          <label className="block text-sm text-mist">
            External form URL
            <input
              className="field mt-2"
              placeholder="https://docs.google.com/forms/..."
              value={settings.external_form_url ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, external_form_url: e.target.value }))}
            />
          </label>
        ) : null}

        <label className="block text-sm text-mist">
          WhatsApp number for soft-copy button
          <input
            className="field mt-2"
            placeholder="918884484828 or +91..."
            value={settings.whatsapp_number ?? ""}
            onChange={(e) => setSettings((s) => ({ ...s, whatsapp_number: e.target.value }))}
          />
          <span className="mt-1 block text-xs text-mist/70">Leave blank to use NEXT_PUBLIC_WHATSAPP_NUMBER.</span>
        </label>

        {error ? (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p role="status" className="text-sm text-emerald-300">
            {notice}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={pending} className="liquid-button rounded-full px-7 py-3 text-xs font-bold uppercase tracking-wider disabled:opacity-50">
            {pending ? "Saving…" : "Save & publish to /qr"}
          </button>
          <Link href="/qr" target="_blank" className="text-xs text-champagne underline">
            Preview live page ↗
          </Link>
          <a href={liveHref} target="_blank" rel="noopener noreferrer" className="text-xs text-gold-2 underline">
            Preview active form target ↗
          </a>
        </div>
      </form>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Native submissions</p>
            <h2 className="mt-1 font-display text-3xl italic text-cream">Giveaway entries</h2>
          </div>
          <a
            href="/api/admin/qr-entries/export"
            className="rounded-full border border-gold/40 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-champagne"
          >
            Export CSV
          </a>
        </div>

        <div className="mt-6 overflow-x-auto border border-gold/25">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-emerald/40 font-royal text-[0.6rem] uppercase tracking-[0.18em] text-gold">
              <tr>
                {["When", "Name", "Instagram", "Phone", "Station", "Screenshot"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-normal">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.length ? (
                entries.map((entry) => (
                  <tr key={entry.id} className="border-t border-gold/15 align-top">
                    <td className="px-4 py-4 text-mist">{when.format(new Date(entry.created_at))}</td>
                    <td className="px-4 py-4 text-cream">{entry.full_name}</td>
                    <td className="px-4 py-4 text-cream">{entry.instagram_handle}</td>
                    <td className="px-4 py-4 text-cream">{entry.phone}</td>
                    <td className="px-4 py-4 text-champagne">{entry.station}</td>
                    <td className="px-4 py-4">
                      {entry.screenshot_url ? (
                        <a href={entry.screenshot_url} target="_blank" rel="noopener noreferrer" className="text-gold-2 underline">
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-mist">
                    No native entries yet. They appear here when guests submit on /qr (built-in form mode).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}