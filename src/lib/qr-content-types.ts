import { QR_GIVEAWAY_STATIONS, QR_SOFT_COPY_MESSAGE } from "@/lib/qr-constants";
import { ensureLayout, sortSections, visibleSectionIds, type PageLayoutState } from "@/lib/page-section-layout";

export const QR_SECTION_IDS = ["hero", "whatsapp", "steps", "entry", "hamper", "winners", "b2b", "rules"] as const;
export type QrSectionId = (typeof QR_SECTION_IDS)[number];

export const QR_SECTION_LABELS: Record<QrSectionId, string> = {
  hero: "Hero",
  whatsapp: "WhatsApp soft-copy",
  steps: "How it works",
  entry: "Entry form",
  hamper: "Prize hamper showcase",
  winners: "Weekly winners",
  b2b: "B2B quote capture",
  rules: "Rules & terms",
};

export type QrPrizeCard = { title: string; description: string; image_url: string; image_alt: string };

export type QrStep = { number: string; title: string; copy: string };
export type QrWinner = { week: string; name: string; station: string; event: string; image_url: string; image_alt: string };
export type QrFormCopy = {
  section_kicker: string;
  full_name_label: string;
  instagram_label: string;
  instagram_placeholder: string;
  phone_label: string;
  phone_placeholder: string;
  station_legend: string;
  screenshot_label: string;
  screenshot_hint: string;
  upload_button: string;
  upload_change: string;
  submit_button: string;
  submitting: string;
  success_title: string;
  success_body: string;
  success_cta: string;
};
export type QrPageContent = {
  seo: { title: string; description: string };
  hero: {
    logo_url: string;
    logo_alt: string;
    wordmark: string;
    badge: string;
    title: string;
    title_accent: string;
    subtitle: string;
    cta_text: string;
  };
  whatsapp: {
    body: string;
    button_text: string;
    prefilled_message: string;
    phone_digits: string;
    phone_display_hint: string;
  };
  steps: { kicker: string; items: QrStep[] };
  entry: {
    kicker: string;
    external_body: string;
    external_button: string;
    iframe_title: string;
  };
  hamper: {
    kicker: string;
    title: string;
    bullets: string[];
    prize_cards: QrPrizeCard[];
    image_url: string;
    image_alt: string;
    image_fallback_label: string;
  };
  layout: PageLayoutState;
  station_options: string[];
  winners: { kicker: string; title: string; items: QrWinner[] };
  b2b: { title: string; body: string; cta_text: string; cta_href: string };
  rules: { title: string; items: string[] };
  form: QrFormCopy;
};

export const DEFAULT_QR_PAGE_CONTENT: QrPageContent = {
  seo: {
    title: "Weekly Giveaway | Visriva QR",
    description:
      "Enter Visriva's weekly hamper giveaway after your live station visit. Tag @visriva.co, submit in 30 seconds, or request your soft copy on WhatsApp.",
  },
  hero: {
    logo_url: "/brand/visriva-logo.png",
    logo_alt: "Visriva gold emblem",
    wordmark: "visriva",
    badge: "Guest QR experience",
    title: "Win a Curated",
    title_accent: "Visriva Hamper",
    subtitle:
      "Thank you for visiting our live station! Enter our weekly giveaway in 30 seconds for a chance to win custom keepsakes & luxury goodies.",
    cta_text: "Enter weekly giveaway ↓",
  },
  whatsapp: {
    body: "You can send your physical copy photo on WhatsApp — our team will send you a soft copy!",
    button_text: "Send on WhatsApp",
    prefilled_message: QR_SOFT_COPY_MESSAGE,
    phone_digits: "",
    phone_display_hint: "",
  },
  steps: {
    kicker: "How it works",
    items: [
      { number: "01", title: "Scan at the Station", copy: "You're already here!" },
      { number: "02", title: "Tag Us on Instagram", copy: "Post your station moment & tag @visriva.co — snap a screenshot." },
      { number: "03", title: "Submit Your Entry", copy: "Fill in your details below in under 30 seconds." },
      { number: "04", title: "Weekly Winner Reveal", copy: "Winners announced every week with live reaction reels!" },
    ],
  },
  entry: {
    kicker: "Weekly giveaway entry",
    external_body: "Complete your official giveaway entry on our secure form — takes under a minute.",
    external_button: "Complete your official giveaway entry ↗",
    iframe_title: "Visriva giveaway form",
  },
  hamper: {
    kicker: "This week's hamper",
    title: "Custom keepsakes + curated luxury",
    bullets: [
      "Custom photo magnet or keychain from your event moment",
      "Curated Visriva luxury goodies & studio surprises",
      "Delivered across Bengaluru with a personal note",
    ],
    prize_cards: [],
    image_url: "",
    image_alt: "Visriva weekly hamper",
    image_fallback_label: "Hamper visual — add photo in admin",
  },
  layout: ensureLayout(QR_SECTION_IDS),
  station_options: [...QR_GIVEAWAY_STATIONS],
  winners: {
    kicker: "Weekly winners",
    title: "The Winners Wall",
    items: [
      { week: "Week 42", name: "Ananya R.", station: "Live Photo Booth", event: "Tech town hall", image_url: "", image_alt: "Winner highlight" },
      { week: "Week 41", name: "Rohan K.", station: "DTF T-Shirt Printing", event: "Brand activation", image_url: "", image_alt: "Winner highlight" },
      { week: "Week 40", name: "Priya S.", station: "AI Station", event: "Corporate gala", image_url: "", image_alt: "Winner highlight" },
      { week: "Week 39", name: "Dev M.", station: "VR Gaming", event: "Product launch", image_url: "", image_alt: "Winner highlight" },
    ],
  },
  b2b: {
    title: "Planning a corporate event, wedding, or brand activation?",
    body: "Bring Visriva's live gifting & tech stations to your guests.",
    cta_text: "Get a free station quote ↗",
    cta_href: "/quote",
  },
  rules: {
    title: "Rules & terms",
    items: [
      "Follow & tag @visriva.co on Instagram with your station moment.",
      "One entry per person per week.",
      "Winner selected & announced every week on @visrivalivestation.",
      "Prize: Branded Visriva hamper (custom photo magnet or keychain + curated goodies).",
    ],
  },
  form: {
    section_kicker: "",
    full_name_label: "Full name",
    instagram_label: "Instagram handle",
    instagram_placeholder: "@visriva.co",
    phone_label: "Phone / WhatsApp",
    phone_placeholder: "+91 98XXX XXXXX",
    station_legend: "Which Visriva station did you visit?",
    screenshot_label: "Screenshot (tag @visriva.co)",
    screenshot_hint: "Drag & drop or tap to upload your story/post screenshot",
    upload_button: "Choose from gallery",
    upload_change: "Change screenshot",
    submit_button: "Submit giveaway entry →",
    submitting: "Submitting…",
    success_title: "You're In!",
    success_body:
      "Your weekly giveaway entry is logged. Winners are revealed every week — watch @visrivalivestation for live reaction reels.",
    success_cta: "Submit another entry",
  },
};

function trim(value: unknown, max = 4000) {
  return String(value ?? "").trim().slice(0, max);
}

function mergeStep(raw: unknown, fallback: QrStep): QrStep {
  const row = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    number: trim(row.number, 8) || fallback.number,
    title: trim(row.title, 160) || fallback.title,
    copy: trim(row.copy, 500) || fallback.copy,
  };
}

function mergeWinner(raw: unknown, fallback: QrWinner): QrWinner {
  const row = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    week: trim(row.week, 40) || fallback.week,
    name: trim(row.name, 120) || fallback.name,
    station: trim(row.station, 120) || fallback.station,
    event: trim(row.event, 160) || fallback.event,
    image_url: trim(row.image_url, 2000) || fallback.image_url,
    image_alt: trim(row.image_alt, 200) || fallback.image_alt,
  };
}

function mergePrizeCard(raw: unknown, fallback: QrPrizeCard): QrPrizeCard {
  const row = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    title: trim(row.title, 160) || fallback.title,
    description: trim(row.description, 400) || fallback.description,
    image_url: trim(row.image_url, 2000),
    image_alt: trim(row.image_alt, 200) || fallback.image_alt,
  };
}

export function mergeQrPageContent(raw: unknown): QrPageContent {
  const d = DEFAULT_QR_PAGE_CONTENT;
  if (!raw || typeof raw !== "object") return structuredClone(d);
  const r = raw as Record<string, unknown>;

  const hero = (r.hero && typeof r.hero === "object" ? r.hero : {}) as Record<string, unknown>;
  const whatsapp = (r.whatsapp && typeof r.whatsapp === "object" ? r.whatsapp : {}) as Record<string, unknown>;
  const steps = (r.steps && typeof r.steps === "object" ? r.steps : {}) as Record<string, unknown>;
  const entry = (r.entry && typeof r.entry === "object" ? r.entry : {}) as Record<string, unknown>;
  const hamper = (r.hamper && typeof r.hamper === "object" ? r.hamper : {}) as Record<string, unknown>;
  const winners = (r.winners && typeof r.winners === "object" ? r.winners : {}) as Record<string, unknown>;
  const b2b = (r.b2b && typeof r.b2b === "object" ? r.b2b : {}) as Record<string, unknown>;
  const rules = (r.rules && typeof r.rules === "object" ? r.rules : {}) as Record<string, unknown>;
  const seo = (r.seo && typeof r.seo === "object" ? r.seo : {}) as Record<string, unknown>;
  const form = (r.form && typeof r.form === "object" ? r.form : {}) as Record<string, unknown>;

  const stepItems = Array.isArray(steps.items) ? steps.items : [];
  const winnerItems = Array.isArray(winners.items) ? winners.items : [];
  const prizeCards = Array.isArray(hamper.prize_cards) ? hamper.prize_cards : [];
  const stationOptions = Array.isArray(r.station_options) ? r.station_options : [];
  const layoutRaw = r.layout && typeof r.layout === "object" ? (r.layout as PageLayoutState) : undefined;

  return {
    seo: {
      title: trim(seo.title, 120) || d.seo.title,
      description: trim(seo.description, 320) || d.seo.description,
    },
    hero: {
      logo_url: trim(hero.logo_url, 2000) || d.hero.logo_url,
      logo_alt: trim(hero.logo_alt, 200) || d.hero.logo_alt,
      wordmark: trim(hero.wordmark, 80) || d.hero.wordmark,
      badge: trim(hero.badge, 120) || d.hero.badge,
      title: trim(hero.title, 200) || d.hero.title,
      title_accent: trim(hero.title_accent, 200) || d.hero.title_accent,
      subtitle: trim(hero.subtitle, 800) || d.hero.subtitle,
      cta_text: trim(hero.cta_text, 120) || d.hero.cta_text,
    },
    whatsapp: {
      body: trim(whatsapp.body, 800) || d.whatsapp.body,
      button_text: trim(whatsapp.button_text, 120) || d.whatsapp.button_text,
      prefilled_message: trim(whatsapp.prefilled_message, 1000) || d.whatsapp.prefilled_message,
      phone_digits: trim(whatsapp.phone_digits, 30) || d.whatsapp.phone_digits,
      phone_display_hint: trim(whatsapp.phone_display_hint, 80) || d.whatsapp.phone_display_hint,
    },
    steps: {
      kicker: trim(steps.kicker, 120) || d.steps.kicker,
      items: (stepItems.length ? stepItems : d.steps.items)
        .map((item, i) => mergeStep(item, d.steps.items[i] ?? d.steps.items[0]))
        .slice(0, 8),
    },
    entry: {
      kicker: trim(entry.kicker, 120) || d.entry.kicker,
      external_body: trim(entry.external_body, 800) || d.entry.external_body,
      external_button: trim(entry.external_button, 160) || d.entry.external_button,
      iframe_title: trim(entry.iframe_title, 120) || d.entry.iframe_title,
    },
    hamper: {
      kicker: trim(hamper.kicker, 120) || d.hamper.kicker,
      title: trim(hamper.title, 200) || d.hamper.title,
      bullets: (Array.isArray(hamper.bullets) ? hamper.bullets : d.hamper.bullets)
        .map((line) => trim(line, 300))
        .filter(Boolean)
        .slice(0, 8),
      prize_cards: (prizeCards.length ? prizeCards : d.hamper.prize_cards)
        .map((item, i) => mergePrizeCard(item, d.hamper.prize_cards[i] ?? { title: "Prize", description: "", image_url: "", image_alt: "Prize" }))
        .slice(0, 12),
      image_url: trim(hamper.image_url, 2000),
      image_alt: trim(hamper.image_alt, 200) || d.hamper.image_alt,
      image_fallback_label: trim(hamper.image_fallback_label, 160) || d.hamper.image_fallback_label,
    },
    winners: {
      kicker: trim(winners.kicker, 120) || d.winners.kicker,
      title: trim(winners.title, 200) || d.winners.title,
      items: (winnerItems.length ? winnerItems : d.winners.items)
        .map((item, i) => mergeWinner(item, d.winners.items[i] ?? d.winners.items[0]))
        .slice(0, 12),
    },
    b2b: {
      title: trim(b2b.title, 300) || d.b2b.title,
      body: trim(b2b.body, 500) || d.b2b.body,
      cta_text: trim(b2b.cta_text, 120) || d.b2b.cta_text,
      cta_href: trim(b2b.cta_href, 500) || d.b2b.cta_href,
    },
    rules: {
      title: trim(rules.title, 120) || d.rules.title,
      items: (Array.isArray(rules.items) ? rules.items : d.rules.items)
        .map((line) => trim(line, 500))
        .filter(Boolean)
        .slice(0, 12),
    },
    form: {
      section_kicker: trim(form.section_kicker, 120) || d.entry.kicker,
      full_name_label: trim(form.full_name_label, 80) || d.form.full_name_label,
      instagram_label: trim(form.instagram_label, 80) || d.form.instagram_label,
      instagram_placeholder: trim(form.instagram_placeholder, 80) || d.form.instagram_placeholder,
      phone_label: trim(form.phone_label, 80) || d.form.phone_label,
      phone_placeholder: trim(form.phone_placeholder, 80) || d.form.phone_placeholder,
      station_legend: trim(form.station_legend, 160) || d.form.station_legend,
      screenshot_label: trim(form.screenshot_label, 160) || d.form.screenshot_label,
      screenshot_hint: trim(form.screenshot_hint, 300) || d.form.screenshot_hint,
      upload_button: trim(form.upload_button, 80) || d.form.upload_button,
      upload_change: trim(form.upload_change, 80) || d.form.upload_change,
      submit_button: trim(form.submit_button, 120) || d.form.submit_button,
      submitting: trim(form.submitting, 80) || d.form.submitting,
      success_title: trim(form.success_title, 120) || d.form.success_title,
      success_body: trim(form.success_body, 800) || d.form.success_body,
      success_cta: trim(form.success_cta, 120) || d.form.success_cta,
    },
    layout: ensureLayout(QR_SECTION_IDS, layoutRaw),
    station_options: (stationOptions.length ? stationOptions : d.station_options)
      .map((line) => trim(line, 120))
      .filter(Boolean)
      .slice(0, 24),
  };
}

export function visibleQrSectionIds(content: QrPageContent): QrSectionId[] {
  const ids = visibleSectionIds(content.layout);
  return ids.filter((id): id is QrSectionId => (QR_SECTION_IDS as readonly string[]).includes(id));
}

export function adminOrderedQrSections(content: QrPageContent) {
  return sortSections(content.layout.sections).filter((s) => (QR_SECTION_IDS as readonly string[]).includes(s.id));
}

export function resolveQrWhatsAppFromContent(content: QrPageContent, envDigits: string) {
  const fromContent = content.whatsapp.phone_digits.replace(/\D/g, "");
  return fromContent || envDigits;
}

export function formatPhoneDisplay(digits: string, hint: string) {
  if (hint.trim()) return hint.trim();
  if (!digits) return "";
  return digits.startsWith("91") ? `+${digits.slice(0, 2)} ${digits.slice(2)}` : `+${digits}`;
}