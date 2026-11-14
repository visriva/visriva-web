"use client";

import { useMemo, useRef, useState } from "react";
import { AdminFloatingSaveBar } from "@/components/admin/AdminFloatingSaveBar";
import { AdminListItemToolbar } from "@/components/admin/AdminListItemToolbar";
import { AdminRestoreSectionsDrawer } from "@/components/admin/AdminRestoreSectionsDrawer";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";
import { UniversalImageUploader } from "@/components/admin/UniversalImageUploader";
import {
  adminOrderedQrSections,
  QR_SECTION_LABELS,
  type QrPageContent,
  type QrPrizeCard,
  type QrSectionId,
  type QrStep,
  type QrWinner,
} from "@/lib/qr-content-types";
import { clearAdminDraft, stashAdminDraft } from "@/lib/admin-draft-storage";
import {
  deleteSection,
  moveListItem,
  moveSection,
  restoreSection,
  toggleSectionVisibility,
} from "@/lib/page-section-layout";

const input = "field mt-2";
const QR_IMAGE_API = "/api/admin/qr-content/image";

export function AdminQrCms({ initial }: { initial: QrPageContent }) {
  const [content, setContent] = useState(initial);
  const baseline = useRef(JSON.stringify(initial));
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const dirty = useMemo(() => JSON.stringify(content) !== baseline.current, [content]);
  const ordered = adminOrderedQrSections(content);

  function patch<K extends keyof QrPageContent>(section: K, value: QrPageContent[K]) {
    setContent((current) => ({ ...current, [section]: value }));
  }

  function setLayout(next: QrPageContent["layout"]) {
    patch("layout", next);
  }

  async function save() {
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
      stashAdminDraft("qr_page_content", content);
      setError(typeof body.error === "string" ? `${body.error} (draft kept in this browser.)` : "Could not save QR content. Draft kept in this browser.");
      return;
    }
    if (body.content) {
      const saved = body.content as QrPageContent;
      setContent(saved);
      baseline.current = JSON.stringify(saved);
      clearAdminDraft("qr_page_content");
    }
    setNotice("Visual CMS saved — /qr updated.");
  }

  const archivedLabels = content.layout.archived.map((s) => ({
    id: s.id,
    label: QR_SECTION_LABELS[s.id as QrSectionId] ?? s.id,
  }));

  return (
    <div className="space-y-8 pb-24">
      <section className="rounded-2xl border border-gold/20 bg-[#0D2117] p-5 sm:p-7">
        <p className="section-kicker">Page SEO</p>
        <label className="block text-sm text-mist">
          Page title
          <input className={input} value={content.seo.title} onChange={(e) => patch("seo", { ...content.seo, title: e.target.value })} />
        </label>
        <label className="mt-4 block text-sm text-mist">
          Meta description
          <textarea className={`${input} min-h-24`} value={content.seo.description} onChange={(e) => patch("seo", { ...content.seo, description: e.target.value })} />
        </label>
      </section>

      {ordered.map((slot, index) => {
        const id = slot.id as QrSectionId;
        const title = QR_SECTION_LABELS[id] ?? id;
        return (
          <AdminSectionShell
            key={id}
            title={title}
            visible={slot.visible}
            canMoveUp={index > 0}
            canMoveDown={index < ordered.length - 1}
            onToggleVisible={() => setLayout(toggleSectionVisibility(content.layout, id))}
            onMoveUp={() => setLayout(moveSection(content.layout, id, "up"))}
            onMoveDown={() => setLayout(moveSection(content.layout, id, "down"))}
            onDelete={() => setLayout(deleteSection(content.layout, id))}
          >
            <QrSectionEditor id={id} content={content} patch={patch} />
          </AdminSectionShell>
        );
      })}

      <AdminRestoreSectionsDrawer
        archived={archivedLabels}
        onRestore={(id) => setLayout(restoreSection(content.layout, id))}
      />

      <AdminFloatingSaveBar dirty={dirty} pending={pending} notice={notice} error={error} previewHref="/qr" onSave={save} />
    </div>
  );
}

function QrSectionEditor({
  id,
  content,
  patch,
}: {
  id: QrSectionId;
  content: QrPageContent;
  patch: <K extends keyof QrPageContent>(section: K, value: QrPageContent[K]) => void;
}) {
  switch (id) {
    case "hero":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <UniversalImageUploader label="Hero logo / emblem" preset="logo" slot="hero_logo" uploadEndpoint={QR_IMAGE_API} value={content.hero.logo_url} onChange={(url) => patch("hero", { ...content.hero, logo_url: url })} />
          <label className="text-sm text-mist">Logo alt<input className={input} value={content.hero.logo_alt} onChange={(e) => patch("hero", { ...content.hero, logo_alt: e.target.value })} /></label>
          <label className="text-sm text-mist">Wordmark<input className={input} value={content.hero.wordmark} onChange={(e) => patch("hero", { ...content.hero, wordmark: e.target.value })} /></label>
          <label className="text-sm text-mist">Badge<input className={input} value={content.hero.badge} onChange={(e) => patch("hero", { ...content.hero, badge: e.target.value })} /></label>
          <label className="text-sm text-mist">Title<input className={input} value={content.hero.title} onChange={(e) => patch("hero", { ...content.hero, title: e.target.value })} /></label>
          <label className="text-sm text-mist">Accent (italic)<input className={input} value={content.hero.title_accent} onChange={(e) => patch("hero", { ...content.hero, title_accent: e.target.value })} /></label>
          <label className="text-sm text-mist md:col-span-2">Subtitle<textarea className={`${input} min-h-24`} value={content.hero.subtitle} onChange={(e) => patch("hero", { ...content.hero, subtitle: e.target.value })} /></label>
          <label className="text-sm text-mist">Primary CTA<input className={input} value={content.hero.cta_text} onChange={(e) => patch("hero", { ...content.hero, cta_text: e.target.value })} /></label>
        </div>
      );
    case "whatsapp":
      return (
        <>
          <label className="block text-sm text-mist">Banner message (bold)<textarea className={`${input} min-h-20`} value={content.whatsapp.body} onChange={(e) => patch("whatsapp", { ...content.whatsapp, body: e.target.value })} /></label>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-mist">Button text<input className={input} value={content.whatsapp.button_text} onChange={(e) => patch("whatsapp", { ...content.whatsapp, button_text: e.target.value })} /></label>
            <label className="text-sm text-mist">Phone digits<input className={input} placeholder="918884484828" value={content.whatsapp.phone_digits} onChange={(e) => patch("whatsapp", { ...content.whatsapp, phone_digits: e.target.value })} /></label>
            <label className="text-sm text-mist md:col-span-2">Pre-filled message<textarea className={`${input} min-h-24`} value={content.whatsapp.prefilled_message} onChange={(e) => patch("whatsapp", { ...content.whatsapp, prefilled_message: e.target.value })} /></label>
            <label className="text-sm text-mist">Display hint<input className={input} value={content.whatsapp.phone_display_hint} onChange={(e) => patch("whatsapp", { ...content.whatsapp, phone_display_hint: e.target.value })} /></label>
          </div>
        </>
      );
    case "steps":
      return (
        <>
          <label className="block text-sm text-mist">Section kicker<input className={input} value={content.steps.kicker} onChange={(e) => patch("steps", { ...content.steps, kicker: e.target.value })} /></label>
          <div className="mt-4 space-y-3">
            {content.steps.items.map((step, i) => (
              <StepRow
                key={i}
                step={step}
                index={i}
                total={content.steps.items.length}
                onChange={(next) => {
                  const items = [...content.steps.items];
                  items[i] = next;
                  patch("steps", { ...content.steps, items });
                }}
                onRemove={() => patch("steps", { ...content.steps, items: content.steps.items.filter((_, idx) => idx !== i) })}
                onMoveUp={() => patch("steps", { ...content.steps, items: moveListItem(content.steps.items, i, "up") })}
                onMoveDown={() => patch("steps", { ...content.steps, items: moveListItem(content.steps.items, i, "down") })}
              />
            ))}
            <button type="button" className="text-xs text-gold-2 underline" onClick={() => patch("steps", { ...content.steps, items: [...content.steps.items, { number: String(content.steps.items.length + 1).padStart(2, "0"), title: "New step", copy: "" }] })}>
              + Add step
            </button>
          </div>
        </>
      );
    case "entry":
      return (
        <div className="grid gap-6">
          <UsageHint hint="Switch native vs external form in the Form settings tab." />
          <div className="grid gap-4">
            <label className="text-sm text-mist">Section kicker<input className={input} value={content.entry.kicker} onChange={(e) => patch("entry", { ...content.entry, kicker: e.target.value })} /></label>
            <label className="text-sm text-mist">External form body<textarea className={`${input} min-h-20`} value={content.entry.external_body} onChange={(e) => patch("entry", { ...content.entry, external_body: e.target.value })} /></label>
            <label className="text-sm text-mist">External form button<input className={input} value={content.entry.external_button} onChange={(e) => patch("entry", { ...content.entry, external_button: e.target.value })} /></label>
          </div>
          <FormLabels content={content} onChange={(form) => patch("form", form)} />
          <StationOptionsEditor content={content} patch={patch} />
        </div>
      );
    case "hamper":
      return <HamperEditor content={content} patch={patch} />;
    case "winners":
      return <WinnersEditor content={content} patch={patch} />;
    case "b2b":
      return (
        <div className="grid gap-4">
          <label className="text-sm text-mist">Title<input className={input} value={content.b2b.title} onChange={(e) => patch("b2b", { ...content.b2b, title: e.target.value })} /></label>
          <label className="text-sm text-mist">Body<textarea className={`${input} min-h-20`} value={content.b2b.body} onChange={(e) => patch("b2b", { ...content.b2b, body: e.target.value })} /></label>
          <label className="text-sm text-mist">CTA text<input className={input} value={content.b2b.cta_text} onChange={(e) => patch("b2b", { ...content.b2b, cta_text: e.target.value })} /></label>
          <label className="text-sm text-mist">CTA link<input className={input} value={content.b2b.cta_href} onChange={(e) => patch("b2b", { ...content.b2b, cta_href: e.target.value })} /></label>
        </div>
      );
    case "rules":
      return (
        <>
          <label className="text-sm text-mist">Accordion title<input className={input} value={content.rules.title} onChange={(e) => patch("rules", { ...content.rules, title: e.target.value })} /></label>
          <RulesEditor content={content} patch={patch} />
        </>
      );
    default:
      return null;
  }
}

function UsageHint({ hint }: { hint: string }) {
  return <p className="rounded-lg border border-gold/20 bg-gold/5 px-3 py-2 text-xs text-mist">{hint}</p>;
}

function StationOptionsEditor({
  content,
  patch,
}: {
  content: QrPageContent;
  patch: <K extends keyof QrPageContent>(section: K, value: QrPageContent[K]) => void;
}) {
  return (
    <div>
      <p className="font-royal text-[10px] uppercase tracking-wider text-gold">Station dropdown options</p>
      <ul className="mt-3 space-y-2">
        {content.station_options.map((station, i) => (
          <li key={`${station}-${i}`} className="flex gap-2">
            <AdminListItemToolbar
              index={i}
              total={content.station_options.length}
              onMoveUp={() => patch("station_options", moveListItem(content.station_options, i, "up"))}
              onMoveDown={() => patch("station_options", moveListItem(content.station_options, i, "down"))}
              onRemove={() => patch("station_options", content.station_options.filter((_, idx) => idx !== i))}
            />
            <input className="field min-h-11 flex-1" value={station} onChange={(e) => {
              const next = [...content.station_options];
              next[i] = e.target.value;
              patch("station_options", next);
            }} />
          </li>
        ))}
      </ul>
      <button type="button" className="mt-2 text-xs text-gold-2 underline" onClick={() => patch("station_options", [...content.station_options, "New station"])}>
        + Add station option
      </button>
    </div>
  );
}

function StepRow({
  step,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  step: QrStep;
  index: number;
  total: number;
  onChange: (s: QrStep) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="flex gap-2 rounded-xl border border-gold/15 p-3">
      <AdminListItemToolbar index={index} total={total} onMoveUp={onMoveUp} onMoveDown={onMoveDown} onRemove={onRemove} />
      <div className="grid flex-1 gap-2 md:grid-cols-[80px_1fr_1fr]">
        <input className="field" value={step.number} onChange={(e) => onChange({ ...step, number: e.target.value })} />
        <input className="field" value={step.title} onChange={(e) => onChange({ ...step, title: e.target.value })} />
        <input className="field" value={step.copy} onChange={(e) => onChange({ ...step, copy: e.target.value })} />
      </div>
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
        Bullets fallback (one per line — used if prize cards empty)
        <textarea className={`${input} min-h-20`} value={content.hamper.bullets.join("\n")} onChange={(e) => patch("hamper", { ...content.hamper, bullets: e.target.value.split("\n").filter(Boolean) })} />
      </label>
      <PrizeCardsEditor content={content} patch={patch} />
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
            total={content.winners.items.length}
            onChange={(next) => {
              const items = [...content.winners.items];
              items[i] = next;
              patch("winners", { ...content.winners, items });
            }}
            onRemove={() => patch("winners", { ...content.winners, items: content.winners.items.filter((_, idx) => idx !== i) })}
            onMoveUp={() => patch("winners", { ...content.winners, items: moveListItem(content.winners.items, i, "up") })}
            onMoveDown={() => patch("winners", { ...content.winners, items: moveListItem(content.winners.items, i, "down") })}
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
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onImageUrl,
}: {
  winner: QrWinner;
  index: number;
  total: number;
  onChange: (w: QrWinner) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onImageUrl: (url: string) => void;
}) {
  return (
    <div className="flex gap-2 rounded-xl border border-gold/15 p-3">
      <AdminListItemToolbar index={index} total={total} onMoveUp={onMoveUp} onMoveDown={onMoveDown} onRemove={onRemove} />
      <div className="min-w-0 flex-1">
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
      </div>
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
    <ul className="mt-4 space-y-2">
      {content.rules.items.map((rule, i) => (
        <li key={i} className="flex gap-2">
          <AdminListItemToolbar
            index={i}
            total={content.rules.items.length}
            onMoveUp={() => patch("rules", { ...content.rules, items: moveListItem(content.rules.items, i, "up") })}
            onMoveDown={() => patch("rules", { ...content.rules, items: moveListItem(content.rules.items, i, "down") })}
            onRemove={() => patch("rules", { ...content.rules, items: content.rules.items.filter((_, idx) => idx !== i) })}
          />
          <input className="field min-h-11 flex-1" value={rule} onChange={(e) => {
            const items = [...content.rules.items];
            items[i] = e.target.value;
            patch("rules", { ...content.rules, items });
          }} />
        </li>
      ))}
      <button type="button" className="text-xs text-gold-2 underline" onClick={() => patch("rules", { ...content.rules, items: [...content.rules.items, "New rule"] })}>
        + Add rule
      </button>
    </ul>
  );
}

function PrizeCardsEditor({
  content,
  patch,
}: {
  content: QrPageContent;
  patch: <K extends keyof QrPageContent>(section: K, value: QrPageContent[K]) => void;
}) {
  const cards = content.hamper.prize_cards;
  const updateCard = (i: number, card: QrPrizeCard) => {
    const prize_cards = [...cards];
    prize_cards[i] = card;
    patch("hamper", { ...content.hamper, prize_cards });
  };
  return (
    <div className="md:col-span-2 space-y-3">
      <p className="font-royal text-[10px] uppercase tracking-wider text-gold">Prize cards (optional grid)</p>
      {cards.map((card, i) => (
        <div key={i} className="rounded-xl border border-gold/15 p-3">
          <AdminListItemToolbar index={i} total={cards.length} onMoveUp={() => patch("hamper", { ...content.hamper, prize_cards: moveListItem(cards, i, "up") })} onMoveDown={() => patch("hamper", { ...content.hamper, prize_cards: moveListItem(cards, i, "down") })} onRemove={() => patch("hamper", { ...content.hamper, prize_cards: cards.filter((_, idx) => idx !== i) })} />
          <input className="field mt-2" placeholder="Title" value={card.title} onChange={(e) => updateCard(i, { ...card, title: e.target.value })} />
          <textarea className={`${input} min-h-16`} placeholder="Description" value={card.description} onChange={(e) => updateCard(i, { ...card, description: e.target.value })} />
          <UniversalImageUploader label="Card image" preset="square" slot={`prize_${i}`} uploadEndpoint={QR_IMAGE_API} value={card.image_url} onChange={(url) => updateCard(i, { ...card, image_url: url })} />
        </div>
      ))}
      <button type="button" className="text-xs text-gold-2 underline" onClick={() => patch("hamper", { ...content.hamper, prize_cards: [...cards, { title: "Prize item", description: "", image_url: "", image_alt: "Prize" }] })}>
        + Add prize card
      </button>
    </div>
  );
}

