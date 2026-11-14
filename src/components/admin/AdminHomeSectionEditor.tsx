"use client";

import { AdminListItemToolbar } from "@/components/admin/AdminListItemToolbar";
import { UniversalImageUploader } from "@/components/admin/UniversalImageUploader";
import type { HomeContent, HomeExperienceTab, HomeListItem, HomeQuotePrompt } from "@/lib/home-content-types";
import type { HomeSectionId } from "@/lib/site-globals-types";
import { moveListItem } from "@/lib/page-section-layout";

const input = "field mt-2";

export function AdminHomeSectionEditor({
  sectionId,
  content,
  onChange,
}: {
  sectionId: HomeSectionId;
  content: HomeContent;
  onChange: (next: HomeContent) => void;
}) {
  switch (sectionId) {
    case "hero":
      return <p className="text-xs text-mist">Hero copy & image: Website CMS → select <strong className="text-champagne">Home</strong> in the page list.</p>;
    case "stats":
      return <p className="text-xs text-mist">Stat counters: edit in <strong className="text-champagne">Footer & social proof</strong> below, then save.</p>;
    case "experience":
      return (
        <>
          <ExperienceEditor value={content.experience} onChange={(experience) => onChange({ ...content, experience })} />
          <p className="mt-4 text-xs text-mist">Service card images & pricing: <strong className="text-champagne">Services</strong> catalog.</p>
        </>
      );
    case "quote":
      return (
        <>
          <QuoteEditor value={content.quote} onChange={(quote) => onChange({ ...content, quote })} />
          <p className="mt-4 text-xs text-mist">Full quote form: <strong className="text-champagne">/quote</strong> (Website CMS).</p>
        </>
      );
    case "brand_story":
      return <BrandStoryEditor value={content.brand_story} onChange={(brand_story) => onChange({ ...content, brand_story })} />;
    case "featured":
      return <FeaturedEditor value={content.featured} onChange={(featured) => onChange({ ...content, featured })} />;
    case "process":
      return <ProcessEditor value={content.process} onChange={(process) => onChange({ ...content, process })} />;
    case "closing":
      return <ClosingEditor value={content.closing} onChange={(closing) => onChange({ ...content, closing })} />;
    default:
      return null;
  }
}

function ExperienceEditor({ value, onChange }: { value: HomeContent["experience"]; onChange: (v: HomeContent["experience"]) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm text-mist">Kicker<input className={input} value={value.kicker} onChange={(e) => onChange({ ...value, kicker: e.target.value })} /></label>
      <label className="text-sm text-mist">Title<input className={input} value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} /></label>
      <label className="text-sm text-mist">Title accent<input className={input} value={value.title_accent} onChange={(e) => onChange({ ...value, title_accent: e.target.value })} /></label>
      <label className="text-sm text-mist md:col-span-2">Sidebar<textarea className={`${input} min-h-20`} value={value.sidebar} onChange={(e) => onChange({ ...value, sidebar: e.target.value })} /></label>
      <label className="text-sm text-mist md:col-span-2">Empty category message<textarea className={`${input} min-h-16`} value={value.empty_state} onChange={(e) => onChange({ ...value, empty_state: e.target.value })} /></label>
      <label className="text-sm text-mist">Footer kicker<input className={input} value={value.footer_kicker} onChange={(e) => onChange({ ...value, footer_kicker: e.target.value })} /></label>
      <label className="text-sm text-mist">Footer title<input className={input} value={value.footer_title} onChange={(e) => onChange({ ...value, footer_title: e.target.value })} /></label>
      <label className="text-sm text-mist">Rate card label<input className={input} value={value.rate_card_label} onChange={(e) => onChange({ ...value, rate_card_label: e.target.value })} /></label>
      <label className="text-sm text-mist">Rate card link<input className={input} value={value.rate_card_href} onChange={(e) => onChange({ ...value, rate_card_href: e.target.value })} /></label>
      <label className="text-sm text-mist">Quote CTA label<input className={input} value={value.quote_cta_label} onChange={(e) => onChange({ ...value, quote_cta_label: e.target.value })} /></label>
      <label className="text-sm text-mist">Quote CTA link<input className={input} value={value.quote_cta_href} onChange={(e) => onChange({ ...value, quote_cta_href: e.target.value })} /></label>
      <ExperienceTabsEditor tabs={value.tabs} onChange={(tabs) => onChange({ ...value, tabs })} />
    </div>
  );
}

function ExperienceTabsEditor({ tabs, onChange }: { tabs: HomeExperienceTab[]; onChange: (tabs: HomeExperienceTab[]) => void }) {
  const ids: HomeExperienceTab["id"][] = ["all", "photo-booths", "ai-merchandise", "games"];
  return (
    <div className="md:col-span-2">
      <p className="font-royal text-[10px] uppercase tracking-wider text-gold">Category filter tabs (ids fixed)</p>
      <ul className="mt-2 space-y-2">
        {tabs.map((tab, i) => (
          <li key={tab.id} className="grid gap-2 rounded-xl border border-gold/15 p-3 md:grid-cols-[140px_1fr_1fr]">
            <select className="field" value={tab.id} onChange={(e) => {
              const next = [...tabs];
              next[i] = { ...tab, id: e.target.value as HomeExperienceTab["id"] };
              onChange(next);
            }}>
              {ids.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            <input className="field" placeholder="Tab label" value={tab.label} onChange={(e) => {
              const next = [...tabs];
              next[i] = { ...tab, label: e.target.value };
              onChange(next);
            }} />
            <input className="field" placeholder="Note (optional)" value={tab.note} onChange={(e) => {
              const next = [...tabs];
              next[i] = { ...tab, note: e.target.value };
              onChange(next);
            }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuoteEditor({ value, onChange }: { value: HomeContent["quote"]; onChange: (v: HomeContent["quote"]) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm text-mist">Primary CTA label<input className={input} value={value.primary_cta_label} onChange={(e) => onChange({ ...value, primary_cta_label: e.target.value })} /></label>
      <label className="text-sm text-mist">Primary CTA link<input className={input} value={value.primary_cta_href} onChange={(e) => onChange({ ...value, primary_cta_href: e.target.value })} /></label>
      <label className="text-sm text-mist">Next button label<input className={input} value={value.next_label} onChange={(e) => onChange({ ...value, next_label: e.target.value })} /></label>
      <label className="text-sm text-mist">Auto-rotate (ms)<input type="number" className={input} min={3000} max={60000} step={500} value={value.rotate_ms} onChange={(e) => onChange({ ...value, rotate_ms: Number(e.target.value) || 6500 })} /></label>
      <QuotePromptsEditor prompts={value.prompts} onChange={(prompts) => onChange({ ...value, prompts })} />
    </div>
  );
}

function QuotePromptsEditor({ prompts, onChange }: { prompts: HomeQuotePrompt[]; onChange: (prompts: HomeQuotePrompt[]) => void }) {
  return (
    <div className="md:col-span-2">
      <p className="font-royal text-[10px] uppercase tracking-wider text-gold">Rotating ideas</p>
      <ul className="mt-2 space-y-2">
        {prompts.map((item, i) => (
          <li key={i} className="flex gap-2 rounded-xl border border-gold/15 p-3">
            <AdminListItemToolbar
              index={i}
              total={prompts.length}
              onMoveUp={() => onChange(moveListItem(prompts, i, "up"))}
              onMoveDown={() => onChange(moveListItem(prompts, i, "down"))}
              onRemove={() => onChange(prompts.filter((_, idx) => idx !== i))}
            />
            <div className="grid flex-1 gap-2">
              <input className="field" placeholder="Eyebrow" value={item.eyebrow} onChange={(e) => {
                const next = [...prompts];
                next[i] = { ...item, eyebrow: e.target.value };
                onChange(next);
              }} />
              <input className="field" placeholder="Title" value={item.title} onChange={(e) => {
                const next = [...prompts];
                next[i] = { ...item, title: e.target.value };
                onChange(next);
              }} />
              <textarea className="field min-h-16" placeholder="Copy" value={item.copy} onChange={(e) => {
                const next = [...prompts];
                next[i] = { ...item, copy: e.target.value };
                onChange(next);
              }} />
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="mt-2 text-xs text-gold-2 underline" onClick={() => onChange([...prompts, { eyebrow: "New idea", title: "Headline", copy: "" }])}>
        + Add slide
      </button>
    </div>
  );
}

function BrandStoryEditor({ value, onChange }: { value: HomeContent["brand_story"]; onChange: (v: HomeContent["brand_story"]) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <UniversalImageUploader label="Brand story photo" preset="hero" slot="home_brand_story" value={value.image_url} onChange={(url) => onChange({ ...value, image_url: url })} />
      </div>
      <label className="text-sm text-mist">Image alt<input className={input} value={value.image_alt} onChange={(e) => onChange({ ...value, image_alt: e.target.value })} /></label>
      <label className="text-sm text-mist">Overlay kicker<input className={input} value={value.overlay_kicker} onChange={(e) => onChange({ ...value, overlay_kicker: e.target.value })} /></label>
      <label className="text-sm text-mist md:col-span-2">Overlay title (use line breaks)<textarea className={`${input} min-h-16`} value={value.overlay_title} onChange={(e) => onChange({ ...value, overlay_title: e.target.value })} /></label>
      <label className="text-sm text-mist">Section kicker<input className={input} value={value.kicker} onChange={(e) => onChange({ ...value, kicker: e.target.value })} /></label>
      <label className="text-sm text-mist">Title<input className={input} value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} /></label>
      <label className="text-sm text-mist">Title accent (italic)<input className={input} value={value.title_accent} onChange={(e) => onChange({ ...value, title_accent: e.target.value })} /></label>
      <label className="text-sm text-mist md:col-span-2">Body<textarea className={`${input} min-h-24`} value={value.body} onChange={(e) => onChange({ ...value, body: e.target.value })} /></label>
      <ListItemsEditor label="Promise rows" items={value.promises} onChange={(promises) => onChange({ ...value, promises })} />
    </div>
  );
}

function FeaturedEditor({ value, onChange }: { value: HomeContent["featured"]; onChange: (v: HomeContent["featured"]) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm text-mist">Kicker<input className={input} value={value.kicker} onChange={(e) => onChange({ ...value, kicker: e.target.value })} /></label>
      <label className="text-sm text-mist">Title<input className={input} value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} /></label>
      <label className="text-sm text-mist">Title accent<input className={input} value={value.title_accent} onChange={(e) => onChange({ ...value, title_accent: e.target.value })} /></label>
      <label className="text-sm text-mist md:col-span-2">Sidebar copy<textarea className={`${input} min-h-20`} value={value.sidebar} onChange={(e) => onChange({ ...value, sidebar: e.target.value })} /></label>
      <label className="text-sm text-mist">CTA text<input className={input} value={value.cta_text} onChange={(e) => onChange({ ...value, cta_text: e.target.value })} /></label>
      <label className="text-sm text-mist">CTA link<input className={input} value={value.cta_href} onChange={(e) => onChange({ ...value, cta_href: e.target.value })} /></label>
      <label className="text-sm text-mist md:col-span-2">
        Featured service ids (one per line, must match service id in catalog)
        <textarea className={`${input} min-h-24 font-mono text-xs`} value={value.service_ids.join("\n")} onChange={(e) => onChange({ ...value, service_ids: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
      </label>
    </div>
  );
}

function ProcessEditor({ value, onChange }: { value: HomeContent["process"]; onChange: (v: HomeContent["process"]) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm text-mist">Kicker<input className={input} value={value.kicker} onChange={(e) => onChange({ ...value, kicker: e.target.value })} /></label>
      <label className="text-sm text-mist">Title<input className={input} value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} /></label>
      <label className="text-sm text-mist">Title accent<input className={input} value={value.title_accent} onChange={(e) => onChange({ ...value, title_accent: e.target.value })} /></label>
      <label className="text-sm text-mist md:col-span-2">Sidebar<textarea className={`${input} min-h-20`} value={value.sidebar} onChange={(e) => onChange({ ...value, sidebar: e.target.value })} /></label>
      <div className="md:col-span-2">
        <ListItemsEditor label="Process steps" items={value.steps} onChange={(steps) => onChange({ ...value, steps })} />
      </div>
    </div>
  );
}

function ClosingEditor({ value, onChange }: { value: HomeContent["closing"]; onChange: (v: HomeContent["closing"]) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm text-mist">Kicker<input className={input} value={value.kicker} onChange={(e) => onChange({ ...value, kicker: e.target.value })} /></label>
      <label className="text-sm text-mist">Title<input className={input} value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} /></label>
      <label className="text-sm text-mist">Title accent<input className={input} value={value.title_accent} onChange={(e) => onChange({ ...value, title_accent: e.target.value })} /></label>
      <label className="text-sm text-mist md:col-span-2">Body<textarea className={`${input} min-h-20`} value={value.body} onChange={(e) => onChange({ ...value, body: e.target.value })} /></label>
      <label className="text-sm text-mist">Button label<input className={input} value={value.button_label} onChange={(e) => onChange({ ...value, button_label: e.target.value })} /></label>
      <label className="text-sm text-mist">Button link<input className={input} value={value.button_href} onChange={(e) => onChange({ ...value, button_href: e.target.value })} /></label>
    </div>
  );
}

function ListItemsEditor({ label, items, onChange }: { label: string; items: HomeListItem[]; onChange: (items: HomeListItem[]) => void }) {
  return (
    <div className="md:col-span-2">
      <p className="font-royal text-[10px] uppercase tracking-wider text-gold">{label}</p>
      <ul className="mt-2 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 rounded-xl border border-gold/15 p-3">
            <AdminListItemToolbar
              index={i}
              total={items.length}
              onMoveUp={() => onChange(moveListItem(items, i, "up"))}
              onMoveDown={() => onChange(moveListItem(items, i, "down"))}
              onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
            />
            <div className="grid flex-1 gap-2 md:grid-cols-[64px_1fr]">
              <input className="field" value={item.n} onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, n: e.target.value };
                onChange(next);
              }} />
              <input className="field" placeholder="Title" value={item.title} onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, title: e.target.value };
                onChange(next);
              }} />
              <textarea className="field min-h-16 md:col-span-2" placeholder="Body" value={item.body} onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, body: e.target.value };
                onChange(next);
              }} />
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="mt-2 text-xs text-gold-2 underline" onClick={() => onChange([...items, { n: String(items.length + 1).padStart(2, "0"), title: "New item", body: "" }])}>
        + Add row
      </button>
    </div>
  );
}