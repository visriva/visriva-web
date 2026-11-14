export const DEFAULT_GOOGLE_REVIEW_URL = "https://g.page/r/CS9tV1ZCiyjLEAI/review";

export type GoogleReviewCard = {
  id: string;
  author: string;
  rating: number;
  quote: string;
  event_label: string;
  date_label: string;
};

export type GoogleReviewSettings = {
  enabled: boolean;
  review_url: string;
  kicker: string;
  headline: string;
  headline_accent: string;
  subtitle: string;
  rating_value: string;
  rating_label: string;
  cta_primary: string;
  cta_secondary: string;
  wall_title: string;
  prompt_chips: string[];
  show_on_home: boolean;
  show_on_qr: boolean;
  cards: GoogleReviewCard[];
};

const DEFAULT_CARDS: GoogleReviewCard[] = [
  {
    id: "1",
    author: "Priya M.",
    rating: 5,
    quote: "Guests queued for the AI keepsakes — Visriva handled everything calmly and the prints looked premium.",
    event_label: "Corporate gala",
    date_label: "Oct 2025",
  },
  {
    id: "2",
    author: "Rahul K.",
    rating: 5,
    quote: "Setup was fast, the crew was professional, and the VR station became the highlight of our brand activation.",
    event_label: "Brand launch",
    date_label: "Aug 2025",
  },
  {
    id: "3",
    author: "Ananya S.",
    rating: 5,
    quote: "Our wedding guests still talk about the photo booth. Soft copies were shared the same night.",
    event_label: "Wedding reception",
    date_label: "Dec 2025",
  },
];

export const DEFAULT_GOOGLE_REVIEW_SETTINGS: GoogleReviewSettings = {
  enabled: true,
  review_url: DEFAULT_GOOGLE_REVIEW_URL,
  kicker: "Google reviews",
  headline: "Share your",
  headline_accent: "Visriva moment.",
  subtitle:
    "A quick Google review helps other planners discover us. It takes less than a minute and means the world to our on-ground team.",
  rating_value: "5.0",
  rating_label: "Loved by event hosts in Bengaluru",
  cta_primary: "Leave a Google review ↗",
  cta_secondary: "See how it works",
  wall_title: "What hosts are saying",
  prompt_chips: ["Host & crew", "Photo quality", "Guest experience", "On-time setup"],
  show_on_home: true,
  show_on_qr: true,
  cards: DEFAULT_CARDS,
};

function trim(value: unknown, max = 2000) {
  return String(value ?? "").trim().slice(0, max);
}

function clampRating(n: number) {
  if (!Number.isFinite(n)) return 5;
  return Math.min(5, Math.max(1, Math.round(n)));
}

export function mergeGoogleReviewSettings(partial: unknown): GoogleReviewSettings {
  const d = DEFAULT_GOOGLE_REVIEW_SETTINGS;
  if (!partial || typeof partial !== "object") return structuredClone(d);
  const p = partial as Partial<GoogleReviewSettings>;

  const cards = Array.isArray(p.cards) && p.cards.length
    ? p.cards.slice(0, 24).map((c, i) => {
        const row = c && typeof c === "object" ? (c as Partial<GoogleReviewCard>) : {};
        const fb = d.cards[i] ?? d.cards[0];
        return {
          id: trim(row.id, 40) || `card-${i + 1}`,
          author: trim(row.author, 80) || fb.author,
          rating: clampRating(Number(row.rating)),
          quote: trim(row.quote, 800) || fb.quote,
          event_label: trim(row.event_label, 120) || fb.event_label,
          date_label: trim(row.date_label, 40) || fb.date_label,
        };
      })
    : d.cards;

  const chips = Array.isArray(p.prompt_chips) && p.prompt_chips.length
    ? p.prompt_chips.map((s) => trim(s, 60)).filter(Boolean).slice(0, 8)
    : d.prompt_chips;

  return {
    enabled: p.enabled !== false,
    review_url: trim(p.review_url, 500) || d.review_url,
    kicker: trim(p.kicker, 120) || d.kicker,
    headline: trim(p.headline, 200) || d.headline,
    headline_accent: trim(p.headline_accent, 200) || d.headline_accent,
    subtitle: trim(p.subtitle, 800) || d.subtitle,
    rating_value: trim(p.rating_value, 20) || d.rating_value,
    rating_label: trim(p.rating_label, 200) || d.rating_label,
    cta_primary: trim(p.cta_primary, 120) || d.cta_primary,
    cta_secondary: trim(p.cta_secondary, 120) || d.cta_secondary,
    wall_title: trim(p.wall_title, 200) || d.wall_title,
    prompt_chips: chips,
    show_on_home: p.show_on_home !== false,
    show_on_qr: p.show_on_qr !== false,
    cards,
  };
}

export const GOOGLE_REVIEW_DRAFT_KEY = "google_review_settings";