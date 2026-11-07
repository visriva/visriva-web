export type MoodId =
  | "beli"
  | "balmonte"
  | "suster-selly"
  | "sansdiego"
  | "epstonik"
  | "nogams"
  | "chimela"
  | "aurelia";

export type MoodSpec = {
  id: MoodId;
  sample: string;
  subtitle?: string;
  bg: string;
  fg: string;
  accent?: string;
  blurb: string;
};

/** Reference palettes from the house type study — applied across Visriva sections. */
export const moods: Record<MoodId, MoodSpec> = {
  beli: {
    id: "beli",
    sample: "Beli",
    bg: "#1a1a1a",
    fg: "#f5f2eb",
    blurb: "Elegant contrast serif on charcoal.",
  },
  balmonte: {
    id: "balmonte",
    sample: "BALMONTE",
    bg: "#e0b8b8",
    fg: "#232a35",
    blurb: "Stencil geometry on dusty rose.",
  },
  "suster-selly": {
    id: "suster-selly",
    sample: "Suster Selly",
    subtitle: "SUSTER SELLY",
    bg: "#1a1a1a",
    fg: "#f5f2eb",
    blurb: "Chalk brush for guest-facing warmth.",
  },
  sansdiego: {
    id: "sansdiego",
    sample: "SANSDIEGO",
    bg: "#36454f",
    fg: "#f5f2eb",
    blurb: "Vintage display for play and spectacle.",
  },
  epstonik: {
    id: "epstonik",
    sample: "Epstonik",
    bg: "#ea5514",
    fg: "#f5f2eb",
    blurb: "Bold serif energy for make stations.",
  },
  nogams: {
    id: "nogams",
    sample: "Nogams",
    bg: "#e6e2d6",
    fg: "#cc3333",
    blurb: "Retro script for the final call to act.",
  },
  chimela: {
    id: "chimela",
    sample: "CHIMELA",
    bg: "#1a1a1a",
    fg: "#f5f2eb",
    blurb: "Fashion caps for structure and nav.",
  },
  aurelia: {
    id: "aurelia",
    sample: "Aurelia",
    bg: "#1a1a1a",
    fg: "#f5f2eb",
    blurb: "Flowing serif for composition tools.",
  },
};

export const moodOrder: MoodId[] = [
  "beli",
  "balmonte",
  "suster-selly",
  "sansdiego",
  "epstonik",
  "nogams",
  "chimela",
  "aurelia",
];

export function moodForCategory(category: "photo-booths" | "ai-merchandise" | "games"): MoodId {
  if (category === "photo-booths") return "balmonte";
  if (category === "ai-merchandise") return "epstonik";
  return "sansdiego";
}
