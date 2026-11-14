"use client";

import Link from "next/link";
import { useState } from "react";
import { UniversalImageUploader } from "@/components/admin/UniversalImageUploader";
import type { QrPageContent, QrStep, QrWinner } from "@/lib/qr-content-types";

const input = "field mt-2";
const QR_IMAGE_API = "/api/admin/qr-content/image";

export function AdminQrCms({ initial }: { initial: QrPageContent }) {
  const [content, setContent] = useState(initial);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function patch<K extends keyof QrPageContent>(section: K, value: QrPageContent[K]) {
    setContent((current) => ({ ...current, [section]: value }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setNotice("");
    const response = await fetch("/api/admin/qr-content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(typeof body.error === "string" ? body.error : "Could not save QR content.");
      return;
    }
    if (body.content) setContent(body.content as QrPageContent);
    setNotice("Visual CMS saved — /qr updated.");
  }

  return (
    <form onSubmit={save} className="space-y-8">
      <Section title="01 · SEO">
        <label className="block text-sm text-mist">
          Page title
          <input className={input} value={content.seo.title} onChange={(e) => patch("seo", { ...content.seo, title: e.target.value })} />
        </label>
        <label className="mt-4 block text-sm text-mist">
          Meta description
          <textarea className={`${input} min-h-24`} value={content.seo.description} onChange={(e) => patch("seo", { ...content.seo, description: e.target.value })} />
        </label>
      </Section>

      <Section title="02 · Hero">
        <div className="grid gap-4 md:grid-cols-2">
          <UniversalImageUploader
            label="Hero logo / emblem"
            preset="logo"
            slot="hero_logo"
            uploadEndpoint={QR_IMAGE_API}
            value={content.hero.logo_url}
            onChange={(url) => patch("hero", { ...content.hero, logo_url: url })}
          />
          <label className="text-sm text-mist">
            Logo alt
            <input className={input} value={content.hero.logo_alt} onChange={(e) => patch("hero", { ...content.hero, logo_alt: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            Wordmark
            <input className={input} value={content.hero.wordmark} onChange={(e) => patch("hero", { ...content.hero, wordmark: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            Badge
            <input className={input} value={content.hero.badge} onChange={(e) => patch("hero", { ...content.hero, badge: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            Title
            <input className={input} value={content.hero.title} onChange={(e) => patch("hero", { ...content.hero, title: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            Accent (italic)
            <input className={input} value={content.hero.title_accent} onChange={(e) => patch("hero", { ...content.hero, title_accent: e.target.value })} />
          </label>
          <label className="text-sm text-mist md:col-span-2">
            Subtitle
            <textarea className={`${input} min-h-24`} value={content.hero.subtitle} onChange={(e) => patch("hero", { ...content.hero, subtitle: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            Primary CTA
            <input className={input} value={content.hero.cta_text} onChange={(e) => patch("hero", { ...content.hero, cta_text: e.target.value })} />
          </label>
        </div>
      </Section>

      <Section title="03 · WhatsApp soft-copy">
        <label className="block text-sm text-mist">
          Banner message (bold)
          <textarea className={`${input} min-h-20`} value={content.whatsapp.body} onChange={(e) => patch("whatsapp", { ...content.whatsapp, body: e.target.value })} />
        </label>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-mist">
            Button text
            <input className={input} value={content.whatsapp.button_text} onChange={(e) => patch("whatsapp", { ...content.whatsapp, button_text: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            Phone digits (optional)
            <input className={input} placeholder="918884484828" value={content.whatsapp.phone_digits} onChange={(e) => patch("whatsapp", { ...content.whatsapp, phone_digits: e.target.value })} />
          </label>
          <label className="text-sm text-mist md:col-span-2">
            Pre-filled message
            <textarea className={`${input} min-h-24`} value={content.whatsapp.prefilled_message} onChange={(e) => patch("whatsapp", { ...content.whatsapp, prefilled_message: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            Display hint (optional)
            <input className={input} value={content.whatsapp.phone_display_hint} onChange={(e) => patch("whatsapp", { ...content.whatsapp, phone_display_hint: e.target.value })} />
          </label>
        </div>
      </Section>

      <Section title="04 · How it works">
        <label className="block text-sm text-mist">
          Section kicker
          <input className={input} value={content.steps.kicker} onChange={(e) => patch("steps", { ...content.steps, kicker: e.target.value })} />
        </label>
        <div className="mt-4 space-y-3">
          {content.steps.items.map((step, i) => (
            <StepRow
              key={i}
              step={step}
              onChange={(next) => {
                const items = [...content.steps.items];
                items[i] = next;
                patch("steps", { ...content.steps, items });
              }}
              onRemove={() => patch("steps", { ...content.steps, items: content.steps.items.filter((_, idx) => idx !== i) })}
            />
          ))}
          <button
            type="button"
            className="text-xs text-gold-2 underline"
            onClick={() =>
              patch("steps", {
                ...content.steps,
                items: [...content.steps.items, { number: "0", title: "New step", copy: "" }],
              })
            }
          >
            + Add step
          </button>
        </div>
      </Section>

      <Section title="05 · Entry block">
        <div className="grid gap-4">
          <label className="text-sm text-mist">
            Section kicker
            <input className={input} value={content.entry.kicker} onChange={(e) => patch("entry", { ...content.entry, kicker: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            External form body
            <textarea className={`${input} min-h-20`} value={content.entry.external_body} onChange={(e) => patch("entry", { ...content.entry, external_body: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            External form button
            <input className={input} value={content.entry.external_button} onChange={(e) => patch("entry", { ...content.entry, external_button: e.target.value })} />
          </label>
        </div>
      </Section>

      <Section title="06 · Native form labels">
        <FormLabels content={content} onChange={(form) => patch("form", form)} />
      </Section>

      <Section title="07 · Hamper showcase">
        <HamperEditor content={content} patch={patch} />
      </Section>

      <Section title="08 · Winners wall">
        <WinnersEditor content={content} patch={patch} />
      </Section>

      <Section title="09 · B2B card & rules">
        <div className="grid gap-4">
          <label className="text-sm text-mist">
            B2B title
            <input className={input} value={content.b2b.title} onChange={(e) => patch("b2b", { ...content.b2b, title: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            B2B body
            <textarea className={`${input} min-h-20`} value={content.b2b.body} onChange={(e) => patch("b2b", { ...content.b2b, body: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            CTA text
            <input className={input} value={content.b2b.cta_text} onChange={(e) => patch("b2b", { ...content.b2b, cta_text: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            CTA link
            <input className={input} value={content.b2b.cta_href} onChange={(e) => patch("b2b", { ...content.b2b, cta_href: e.target.value })} />
          </label>
          <label className="text-sm text-mist">
            Rules accordion title
            <input className={input} value={content.rules.title} onChange={(e) => patch("rules", { ...content.rules, title: e.target.value })} />
          </label>
          <RulesEditor content={content} patch={patch} />
        </div>
      </Section>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-300">{notice}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="liquid-button rounded-full px-7 py-3 text-xs font-bold uppercase tracking-wider disabled:opacity-50">
          {pending ? "Saving…" : "Save visual CMS ↗"}
        </button>
        <Link href="/qr" target="_blank" className="text-xs text-champagne underline">
          Preview /qr ↗
        </Link>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gold/20 bg-[#0D2117] p-5 sm:p-7">
      <p className="section-kicker">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function StepRow({ step, onChange, onRemove }: { step: QrStep; onChange: (s: QrStep) => void; onRemove: () => void }) {
  return (
    <div className="grid gap-2 rounded-xl border border-gold/15 p-3 md:grid-cols-[80px_1fr_1fr_auto]">
      <input className="field" value={step.number} onChange={(e) => onChange({ ...step, number: e.target.value })} />
      <input className="field" value={step.title} onChange={(e) => onChange({ ...step, title: e.target.value })} />
      <input className="field" value={step.copy} onChange={(e) => onChange({ ...step, copy: e.target.value })} />
      <button type="button" onClick={onRemove} className="text-xs text-gold-2">
        Remove
      </button>
    </div>
  );
}

function FormLabels({
  content,
  onChange,
}: {
  content: QrPageContent;
  onChange: (form: QrPageContent["form"]) => void;
}) {
  const form = content.form;
  const fields: { key: keyof QrPageContent["form"]; label: string }[] = [
    { key: "full_name_label", label: "Full name label" },
    { key: "instagram_label", label: "Instagram label" },
    { key: "instagram_placeholder", label: "Instagram placeholder" },
    { key: "phone_label", label: "Phone label" },
    { key: "phone_placeholder", label: "Phone placeholder" },
    { key: "station_legend", label: "Station legend" },
    { key: "screenshot_label", label: "Screenshot label" },
    { key: "screenshot_hint", label: "Screenshot hint" },
    { key: "submit_button", label: "Submit button" },
    { key: "success_title", label: "Success title" },
    { key: "success_body", label: "Success body" },
    { key: "success_cta", label: "Success CTA" },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {fields.map((field) => (
        <label key={field.key} className="text-sm text-mist">
          {field.label}
          <input
            className={input}
            value={form[field.key]}
            onChange={(e) => onChange({ ...form, [field.key]: e.target.value })}
          />
        </label>
      ))}
    </div>
  );
}

function HamperEditor({
  content,
  patch,
}: {
  content: QrPageContent;
  patch: <K extends keyof QrPageContent>(section: K, value: QrPageContent[K]) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm text-mist">
        Kicker
        <input className={input} value={content.hamper.kicker} onChange={(e) => patch("hamper", { ...content.hamper, kicker: e.target.value })} />
      </label>
      <label className="text-sm text-mist">
        Title
        <input className={input} value={content.hamper.title} onChange={(e) => patch("hamper", { ...content.hamper, title: e.target.value })} />
      </label>
      <label className="text-sm text-mist md:col-span-2">
        Bullets (one per line)
        <textarea
          className={`${input} min-h-28`}
          value={content.hamper.bullets.join("\n")}
          onChange={(e) => patch("hamper", { ...content.hamper, bullets: e.target.value.split("\n").filter(Boolean) })}
        />
      </label>
      <div className="md:col-span-2">
        <UniversalImageUploader
          label="Prize hamper showcase"
          preset="square"
          slot="hamper"
          uploadEndpoint={QR_IMAGE_API}
          value={content.hamper.image_url}
          onChange={(url) => patch("hamper", { ...content.hamper, image_url: url })}
        />
      </div>
    </div>
  );
}

function WinnersEditor({
  content,
  patch,
}: {
  content: QrPageContent;
  patch: <K extends keyof QrPageContent>(section: K, value: QrPageContent[K]) => void;
}) {
  return (
  <>
      <label className="block text-sm text-mist">
        Section kicker
        <input className={input} value={content.winners.kicker} onChange={(e) => patch("winners", { ...content.winners, kicker: e.target.value })} />
      </label>
      <label className="mt-3 block text-sm text-mist">
        Title
        <input className={input} value={content.winners.title} onChange={(e) => patch("winners", { ...content.winners, title: e.target.value })} />
      </label>
      <div className="mt-4 space-y-4">
        {content.winners.items.map((winner, i) => (
          <WinnerRow
            key={i}
            winner={winner}
            index={i}
            onChange={(next) => {
              const items = [...content.winners.items];
              items[i] = next;
              patch("winners", { ...content.winners, items });
            }}
            onRemove={() => patch("winners", { ...content.winners, items: content.winners.items.filter((_, idx) => idx !== i) })}
            onImageUrl={(url) => {
              const items = [...content.winners.items];
              items[i] = { ...items[i], image_url: url };
              patch("winners", { ...content.winners, items });
            }}
          />
        ))}
        <button
          type="button"
          className="text-xs text-gold-2 underline"
          onClick={() =>
            patch("winners", {
              ...content.winners,
              items: [
                ...content.winners.items,
                { week: "Week", name: "Name", station: "Station", event: "Event", image_url: "", image_alt: "Winner" },
              ],
            })
          }
        >
          + Add winner
        </button>
      </div>
  </>
  );
}

function WinnerRow({
  winner,
  index,
  onChange,
  onRemove,
  onImageUrl,
}: {
  winner: QrWinner;
  index: number;
  onChange: (w: QrWinner) => void;
  onRemove: () => void;
  onImageUrl: (url: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gold/15 p-3">
      <p className="font-royal text-[10px] uppercase tracking-wider text-gold">Winner {index + 1}</p>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        <input className="field" placeholder="Week" value={winner.week} onChange={(e) => onChange({ ...winner, week: e.target.value })} />
        <input className="field" placeholder="Name" value={winner.name} onChange={(e) => onChange({ ...winner, name: e.target.value })} />
        <input className="field" placeholder="Station" value={winner.station} onChange={(e) => onChange({ ...winner, station: e.target.value })} />
        <input className="field" placeholder="Event" value={winner.event} onChange={(e) => onChange({ ...winner, event: e.target.value })} />
        <div className="md:col-span-2">
          <UniversalImageUploader
            label="Winner photo / thumbnail"
            preset="story"
            slot={`winner_${index}`}
            uploadEndpoint={QR_IMAGE_API}
            value={winner.image_url}
            onChange={onImageUrl}
          />
        </div>
      </div>
      <button type="button" onClick={onRemove} className="mt-2 text-xs text-gold-2">
        Remove winner
      </button>
    </div>
  );
}

function RulesEditor({
  content,
  patch,
}: {
  content: QrPageContent;
  patch: <K extends keyof QrPageContent>(section: K, value: QrPageContent[K]) => void;
}) {
  return (
    <label className="mt-3 block text-sm text-mist">
      Rules (one per line)
      <textarea
        className={`${input} min-h-32`}
        value={content.rules.items.join("\n")}
        onChange={(e) => patch("rules", { ...content.rules, items: e.target.value.split("\n").filter(Boolean) })}
      />
    </label>
  );
}
