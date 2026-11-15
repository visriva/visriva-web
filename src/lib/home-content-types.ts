import { processSteps } from "@/lib/site";

export type HomeListItem = { n: string; title: string; body: string };

export type HomeBrandStory = {
  image_url: string;
  image_alt: string;
  overlay_kicker: string;
  overlay_title: string;
  kicker: string;
  title: string;
  title_accent: string;
  body: string;
  promises: HomeListItem[];
};

export type HomeFeatured = {
  kicker: string;
  title: string;
  title_accent: string;
  sidebar: string;
  cta_text: string;
  cta_href: string;
  service_ids: string[];
};

export type HomeProcess = {
  kicker: string;
  title: string;
  title_accent: string;
  sidebar: string;
  steps: HomeListItem[];
};

export type HomeClosing = {
  kicker: string;
  title: string;
  title_accent: string;
  body: string;
  button_label: string;
  button_href: string;
};

export type HomeExperienceTab = {
  id: "all" | "photo-booths" | "ai-merchandise" | "games";
  label: string;
  note: string;
};

export type HomeExperience = {
  kicker: string;
  title: string;
  title_accent: string;
  sidebar: string;
  empty_state: string;
  footer_kicker: string;
  footer_title: string;
  rate_card_label: string;
  rate_card_href: string;
  quote_cta_label: string;
  quote_cta_href: string;
  tabs: HomeExperienceTab[];
};

export type HomeQuotePrompt = { eyebrow: string; title: string; copy: string };

export type HomeQuote = {
  prompts: HomeQuotePrompt[];
  primary_cta_label: string;
  primary_cta_href: string;
  next_label: string;
  rotate_ms: number;
};

export type HomeContent = {
  experience: HomeExperience;
  quote: HomeQuote;
  brand_story: HomeBrandStory;
  featured: HomeFeatured;
  process: HomeProcess;
  closing: HomeClosing;
};

const DEFAULT_PROMISES: HomeListItem[] = [
  { n: "01", title: "One creative partner", body: "A single team plans, installs and runs your stations, so every touchpoint feels connected." },
  { n: "02", title: "Experiences people join", body: "Thoughtful hosting and simple interactions invite every guest to take part." },
  { n: "03", title: "Keepsakes worth keeping", body: "Personalised prints and merchandise turn a brilliant event into a memory guests can take home." },
];

const DEFAULT_EXPERIENCE_TABS: HomeExperienceTab[] = [
  { id: "all", label: "Everything", note: "The full collection" },
  { id: "photo-booths", label: "Photo experiences", note: "Capture the moment" },
  { id: "ai-merchandise", label: "AI & live merch", note: "Make it yours" },
  { id: "games", label: "VR & games", note: "Bring on the play" },
];

const DEFAULT_QUOTE_PROMPTS: HomeQuotePrompt[] = [
  { eyebrow: "The atmosphere", title: "Make the room feel alive.", copy: "A hosted photo moment, an interactive game or a live customisation bar gives guests a reason to gather." },
  { eyebrow: "The keepsake", title: "Give the memory a place to live.", copy: "Instant prints and personalised merchandise turn a passing moment into something guests can take home." },
  { eyebrow: "The connection", title: "Bring every guest into the story.", copy: "Choose experiences that invite people to participate, create and share the celebration." },
];

export const DEFAULT_HOME_CONTENT: HomeContent = {
  experience: {
    kicker: "The Visriva collection",
    title: "Find the experience.",
    title_accent: "Make it unforgettable.",
    sidebar:
      "Explore the live station inventory. Swipe through the collection, turn a card to see what is included, or compare up to three experiences side by side.",
    empty_state: "No experiences in this category yet. Contact the team for a tailored setup.",
    footer_kicker: "Designed around your event",
    footer_title: "Mix, match and make it yours.",
    rate_card_label: "View rate card",
    rate_card_href: "/rate-card",
    quote_cta_label: "Build your event brief",
    quote_cta_href: "/quote",
    tabs: DEFAULT_EXPERIENCE_TABS,
  },
  quote: {
    prompts: DEFAULT_QUOTE_PROMPTS,
    primary_cta_label: "Build your event brief",
    primary_cta_href: "/quote",
    next_label: "Next idea →",
    rotate_ms: 6500,
  },
  brand_story: {
    image_url: "/images/party.jpg",
    image_alt: "Guests enjoying an event experience",
    overlay_kicker: "The Visriva difference",
    overlay_title: "Beautifully designed.\nThoughtfully delivered.",
    kicker: "More than a station",
    title: "Bring people",
    title_accent: "into the moment.",
    body: "The right event experience gives guests a reason to connect. We combine creative concepts, reliable equipment and on-ground hosting to make that happen.",
    promises: DEFAULT_PROMISES,
  },
  featured: {
    kicker: "Popular starting points",
    title: "Start with a",
    title_accent: "guest favourite.",
    sidebar: "A few popular stations to help you start your brief. We can tailor the final mix to your event.",
    cta_text: "Build your event brief",
    cta_href: "/quote",
    service_ids: ["unlimited-dslr", "ai-station", "vr-station"],
  },
  process: {
    kicker: "Simple from day one",
    title: "From first idea",
    title_accent: "to final encore.",
    sidebar: "A clear process keeps planning easy and lets you focus on your guests.",
    steps: processSteps.map((s) => ({ n: s.n, title: s.title, body: s.body })),
  },
  closing: {
    kicker: "Let's make it memorable",
    title: "Your event deserves",
    title_accent: "a little more wonder.",
    body: "Tell us what you are planning. We will help you find the right experiences for your guests.",
    button_label: "Start your event brief",
    button_href: "/quote",
  },
};

function trim(value: unknown, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
}

const EXPERIENCE_TAB_IDS = new Set<HomeExperienceTab["id"]>(["all", "photo-booths", "ai-merchandise", "games"]);

function mergeTabs(raw: unknown, fallback: HomeExperienceTab[]): HomeExperienceTab[] {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  const byId = new Map(fallback.map((t) => [t.id, t]));
  return raw.slice(0, 6).map((item, i) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const idRaw = trim(row.id, 40);
    const id = EXPERIENCE_TAB_IDS.has(idRaw as HomeExperienceTab["id"]) ? (idRaw as HomeExperienceTab["id"]) : fallback[i]?.id ?? "all";
    const fb = byId.get(id) ?? fallback[i] ?? fallback[0];
    return {
      id,
      label: trim(row.label, 80) || fb.label,
      note: trim(row.note, 200) || fb.note,
    };
  });
}

function mergeQuotePrompts(raw: unknown, fallback: HomeQuotePrompt[], max = 6): HomeQuotePrompt[] {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  return raw.slice(0, max).map((item, i) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const fb = fallback[i] ?? fallback[0];
    return {
      eyebrow: trim(row.eyebrow, 120) || fb.eyebrow,
      title: trim(row.title, 200) || fb.title,
      copy: trim(row.copy, 800) || fb.copy,
    };
  });
}

function mergeItems(raw: unknown, fallback: HomeListItem[], max = 8): HomeListItem[] {
  if (!Array.isArray(raw) || !raw.length) return fallback;
  return raw.slice(0, max).map((item, i) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const fb = fallback[i] ?? fallback[0];
    return {
      n: trim(row.n, 8) || fb.n,
      title: trim(row.title, 200) || fb.title,
      body: trim(row.body, 800) || fb.body,
    };
  });
}

export function mergeHomeContent(partial: unknown): HomeContent {
  const d = DEFAULT_HOME_CONTENT;
  if (!partial || typeof partial !== "object") return structuredClone(d);
  const p = partial as Partial<HomeContent>;
  const experience = p.experience ?? {};
  const quote = p.quote ?? {};
  const brand = p.brand_story ?? {};
  const featured = p.featured ?? {};
  const process = p.process ?? {};
  const closing = p.closing ?? {};

  const rotateMs = Number((quote as HomeQuote).rotate_ms);
  const safeRotate = Number.isFinite(rotateMs) ? Math.min(60_000, Math.max(3000, Math.round(rotateMs))) : d.quote.rotate_ms;

  return {
    experience: {
      kicker: trim((experience as HomeExperience).kicker, 120) || d.experience.kicker,
      title: trim((experience as HomeExperience).title, 200) || d.experience.title,
      title_accent: trim((experience as HomeExperience).title_accent, 200) || d.experience.title_accent,
      sidebar: trim((experience as HomeExperience).sidebar, 800) || d.experience.sidebar,
      empty_state: trim((experience as HomeExperience).empty_state, 400) || d.experience.empty_state,
      footer_kicker: trim((experience as HomeExperience).footer_kicker, 120) || d.experience.footer_kicker,
      footer_title: trim((experience as HomeExperience).footer_title, 200) || d.experience.footer_title,
      rate_card_label: trim((experience as HomeExperience).rate_card_label, 120) || d.experience.rate_card_label,
      rate_card_href: trim((experience as HomeExperience).rate_card_href, 500) || d.experience.rate_card_href,
      quote_cta_label: trim((experience as HomeExperience).quote_cta_label, 120) || d.experience.quote_cta_label,
      quote_cta_href: trim((experience as HomeExperience).quote_cta_href, 500) || d.experience.quote_cta_href,
      tabs: mergeTabs((experience as HomeExperience).tabs, d.experience.tabs),
    },
    quote: {
      prompts: mergeQuotePrompts((quote as HomeQuote).prompts, d.quote.prompts),
      primary_cta_label: trim((quote as HomeQuote).primary_cta_label, 120) || d.quote.primary_cta_label,
      primary_cta_href: trim((quote as HomeQuote).primary_cta_href, 500) || d.quote.primary_cta_href,
      next_label: trim((quote as HomeQuote).next_label, 120) || d.quote.next_label,
      rotate_ms: safeRotate,
    },
    brand_story: {
      image_url: trim((brand as HomeBrandStory).image_url, 2000) || d.brand_story.image_url,
      image_alt: trim((brand as HomeBrandStory).image_alt, 200) || d.brand_story.image_alt,
      overlay_kicker: trim((brand as HomeBrandStory).overlay_kicker, 120) || d.brand_story.overlay_kicker,
      overlay_title: trim((brand as HomeBrandStory).overlay_title, 300) || d.brand_story.overlay_title,
      kicker: trim((brand as HomeBrandStory).kicker, 120) || d.brand_story.kicker,
      title: trim((brand as HomeBrandStory).title, 200) || d.brand_story.title,
      title_accent: trim((brand as HomeBrandStory).title_accent, 200) || d.brand_story.title_accent,
      body: trim((brand as HomeBrandStory).body, 1200) || d.brand_story.body,
      promises: mergeItems((brand as HomeBrandStory).promises, d.brand_story.promises),
    },
    featured: {
      kicker: trim((featured as HomeFeatured).kicker, 120) || d.featured.kicker,
      title: trim((featured as HomeFeatured).title, 200) || d.featured.title,
      title_accent: trim((featured as HomeFeatured).title_accent, 200) || d.featured.title_accent,
      sidebar: trim((featured as HomeFeatured).sidebar, 600) || d.featured.sidebar,
      cta_text: trim((featured as HomeFeatured).cta_text, 120) || d.featured.cta_text,
      cta_href: trim((featured as HomeFeatured).cta_href, 500) || d.featured.cta_href,
      service_ids: Array.isArray((featured as HomeFeatured).service_ids)
        ? (featured as HomeFeatured).service_ids.map((id) => trim(id, 80)).filter(Boolean).slice(0, 12)
        : d.featured.service_ids,
    },
    process: {
      kicker: trim((process as HomeProcess).kicker, 120) || d.process.kicker,
      title: trim((process as HomeProcess).title, 200) || d.process.title,
      title_accent: trim((process as HomeProcess).title_accent, 200) || d.process.title_accent,
      sidebar: trim((process as HomeProcess).sidebar, 600) || d.process.sidebar,
      steps: mergeItems((process as HomeProcess).steps, d.process.steps),
    },
    closing: {
      kicker: trim((closing as HomeClosing).kicker, 120) || d.closing.kicker,
      title: trim((closing as HomeClosing).title, 200) || d.closing.title,
      title_accent: trim((closing as HomeClosing).title_accent, 200) || d.closing.title_accent,
      body: trim((closing as HomeClosing).body, 800) || d.closing.body,
      button_label: trim((closing as HomeClosing).button_label, 120) || d.closing.button_label,
      button_href: trim((closing as HomeClosing).button_href, 500) || d.closing.button_href,
    },
  };
}