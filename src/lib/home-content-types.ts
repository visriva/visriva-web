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

export type HomeContent = {
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

export const DEFAULT_HOME_CONTENT: HomeContent = {
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
    cta_text: "Build your event brief ↗",
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
  const brand = p.brand_story ?? {};
  const featured = p.featured ?? {};
  const process = p.process ?? {};
  const closing = p.closing ?? {};

  return {
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