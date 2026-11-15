import type { PageLayoutState } from "@/lib/page-section-layout";

export type VisualBuilderPageKey = "home" | "services" | "qr" | "reviews";

export type VisualImageSlot = {
  url: string;
  alt?: string;
  preset?: "hero" | "service" | "square" | "story" | "logo";
};

export type VisualBuilderState = {
  texts: Record<string, string>;
  images: Record<string, VisualImageSlot>;
  home_layout?: PageLayoutState | null;
};

export const EMPTY_VISUAL_STATE: VisualBuilderState = {
  texts: {},
  images: {},
  home_layout: null,
};

export const VISUAL_BUILDER_PAGES: { key: VisualBuilderPageKey; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/?edit=1" },
  { key: "services", label: "Services", href: "/photo-booths?edit=1" },
  { key: "qr", label: "QR & Event Photos", href: "/qr?edit=1" },
  { key: "reviews", label: "Reviews", href: "/reviews?edit=1" },
];

export const IMAGE_PRESET_HINTS: Record<NonNullable<VisualImageSlot["preset"]>, string> = {
  hero: "1200 × 675 px (16:9) or 1080 × 1350 (4:5)",
  service: "1200 × 900 px (4:3)",
  square: "1000 × 1000 px (1:1)",
  story: "1080 × 1920 px (9:16)",
  logo: "500 × 500 px (1:1)",
};