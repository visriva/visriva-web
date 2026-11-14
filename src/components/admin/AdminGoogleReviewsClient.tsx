"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminFloatingSaveBar } from "@/components/admin/AdminFloatingSaveBar";
import {
  GOOGLE_REVIEW_DRAFT_KEY,
  mergeGoogleReviewSettings,
  type GoogleReviewCard,
  type GoogleReviewSettings,
} from "@/lib/google-review-types";
import { clearAdminDraft, readAdminDraft, stashAdminDraft } from "@/lib/admin-draft-storage";

const input = "field mt-2";

export function AdminGoogleReviewsClient({ initial }: { initial: GoogleReviewSettings }) {
  const [settings, setSettings] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function save() {
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/google-reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      if (body.useClientFallback) {
        stashAdminDraft(GOOGLE_REVIEW_DRAFT_KEY, settings);
        setNotice("Saved locally — apply Supabase migration to persist.");
        setDirty(false);
        return;
      }
      setError(typeof body.error === "string" ? body.error : "Could not save.");
      return;
    }
    clearAdminDraft(GOOGLE_REVIEW_DRAFT_KEY);
    setSettings(mergeGoogleReviewSettings(body.settings));
    setDirty(false);
    setNotice("Google Review Studio saved.");
  }

  function patch(partial: Partial<GoogleReviewSettings>) {
    setSettings((s) => ({ ...s, ...partial }));
    setDirty(true);
  }

  function patchCard(index: number, partial: Partial<GoogleReviewCard>) {
    setSettings((s) => {
      const cards = [...s.cards];
      cards[index] = { ...cards[index], ...partial };
      return { ...s, cards };
    });
    setDirty(true);
  }

  function addCard() {
    setSettings((s) => ({
      ...s,
      cards: [
        ...s.cards,
        {
          id: `card-${Date.now()}`,
          author: "New reviewer",
          rating: 5,
          quote: "",
          event_label: "Event",
          date_label: "2026",
        },
      ],
    }));
    setDirty(true);
  }

  function removeCard(index: number) {
    setSettings((s) => ({ ...s, cards: s.cards.filter((_, i) => i !== index) }));
    setDirty(true);
  }

  const draft = readAdminDraft<GoogleReviewSettings>(GOOGLE_REVIEW_DRAFT_KEY);

  return (
    <div className="space-y-8 pb-24">
      {draft ? (
        <p className="rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-champagne">
          Local draft detected — save to Supabase when migration is applied.
        </p>
      ) : null}

      <header>
        <p className="font-royal text-[0.62rem] uppercase tracking-[0.28em] text-gold">Reputation</p>
        <h1 className="font-display text-4xl italic text-white">Google reviews</h1>
        <p className="mt-3 max-w-2xl text-base admin-muted">
          Curated review wall on{" "}
          <Link href="/reviews" className="text-[#E8D48A] underline">
            /reviews
          </Link>
          . Launches{" "}
          <a href={settings.review_url} target="_blank" rel="noreferrer" className="text-[#E8D48A] underline">
            Google review link
          </a>{" "}
          in a popup (never iframe).{" "}
          <Link href="/docforreview" className="text-[#E8D48A] underline">
            Printable QR handout ↗
          </Link>
        </p>
      </header>

      <section className="admin-surface space-y-4 p-6 sm:p-8">
        <h2 className="font-royal text-[0.62rem] uppercase tracking-[0.22em] text-gold">Placement</h2>
        <label className="flex items-center gap-2 text-sm admin-muted">
          <input type="checkbox" checked={settings.enabled} onChange={(e) => patch({ enabled: e.target.checked })} />
          Enable review studio
        </label>
        <label className="flex items-center gap-2 text-sm admin-muted">
          <input type="checkbox" checked={settings.show_on_home} onChange={(e) => patch({ show_on_home: e.target.checked })} />
          Show on homepage
        </label>
        <label className="flex items-center gap-2 text-sm admin-muted">
          <input type="checkbox" checked={settings.show_on_qr} onChange={(e) => patch({ show_on_qr: e.target.checked })} />
          Show on /qr
        </label>
      </section>

      <section className="admin-surface grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
        <Field label="Google review URL" value={settings.review_url} onChange={(v) => patch({ review_url: v })} />
        <Field label="Rating display" value={settings.rating_value} onChange={(v) => patch({ rating_value: v })} />
        <Field label="Kicker" value={settings.kicker} onChange={(v) => patch({ kicker: v })} />
        <Field label="Headline" value={settings.headline} onChange={(v) => patch({ headline: v })} />
        <Field label="Headline accent" value={settings.headline_accent} onChange={(v) => patch({ headline_accent: v })} />
        <Field label="Rating label" value={settings.rating_label} onChange={(v) => patch({ rating_label: v })} />
        <Field label="Primary CTA" value={settings.cta_primary} onChange={(v) => patch({ cta_primary: v })} />
        <Field label="Secondary CTA" value={settings.cta_secondary} onChange={(v) => patch({ cta_secondary: v })} />
        <Field label="Wall title" value={settings.wall_title} onChange={(v) => patch({ wall_title: v })} />
        <Field
          label="Prompt chips (comma-separated)"
          value={settings.prompt_chips.join(", ")}
          onChange={(v) => patch({ prompt_chips: v.split(",").map((s) => s.trim()).filter(Boolean) })}
        />
        <Field label="Subtitle" value={settings.subtitle} multiline onChange={(v) => patch({ subtitle: v })} className="sm:col-span-2" />
      </section>

      <section className="admin-surface p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-royal text-[0.62rem] uppercase tracking-[0.22em] text-gold">Review wall cards</h2>
          <button type="button" onClick={addCard} className="inline-flex items-center gap-1 text-xs text-gold-2 underline">
            <Plus className="h-3 w-3" />
            Add card
          </button>
        </div>
        <ul className="mt-4 space-y-4">
          {settings.cards.map((card, i) => (
            <li key={card.id} className="rounded-2xl border-2 border-gold/25 bg-[#0A1F17] p-4">
              <div className="flex justify-end">
                <button type="button" onClick={() => removeCard(i)} className="text-red-300" aria-label="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Author" value={card.author} onChange={(v) => patchCard(i, { author: v })} />
                <Field label="Rating (1-5)" value={String(card.rating)} onChange={(v) => patchCard(i, { rating: Number(v) || 5 })} />
                <Field label="Event" value={card.event_label} onChange={(v) => patchCard(i, { event_label: v })} />
                <Field label="Date label" value={card.date_label} onChange={(v) => patchCard(i, { date_label: v })} />
                <Field label="Quote" value={card.quote} multiline onChange={(v) => patchCard(i, { quote: v })} className="md:col-span-2" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <AdminFloatingSaveBar dirty={dirty} pending={pending} notice={notice} error={error} previewHref="/reviews" onSave={() => void save()} />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="admin-label">{label}</span>
      {multiline ? (
        <textarea className={`${input} min-h-20`} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={input} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}