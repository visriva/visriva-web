import type { MoodId } from "@/lib/moods";

export type StudioNavItem = {
  href: string;
  label: string;
  mood: MoodId;
  /** Match pathname prefix for active state (hash links use `home-rate`) */
  match?: "exact" | "prefix" | "home-rate";
};

/** Shared glass nav — same labels on home and every service page. */
export const studioNav: StudioNavItem[] = [
  { href: "/photo-booths", label: "Photo Booths", mood: "balmonte", match: "prefix" },
  { href: "/ai-merchandise", label: "AI & Live Merch", mood: "epstonik", match: "prefix" },
  { href: "/games-vr", label: "VR & Games", mood: "sansdiego", match: "prefix" },
  { href: "/client-requirements", label: "Venue Specs", mood: "chimela", match: "prefix" },
  { href: "/gallery", label: "Gallery", mood: "beli", match: "prefix" },
  { href: "/#rate-card", label: "Rate card", mood: "aurelia", match: "home-rate" },
];
