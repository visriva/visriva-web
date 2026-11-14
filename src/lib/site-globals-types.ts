export type SiteStat = { label: string; value: number; suffix: string };

export type SiteGlobals = {
  footer_blurb: string;
  footer_tagline: string;
  footer_badge: string;
  footer_location: string;
  footer_gst_note: string;
  footer_copyright: string;
  footer_rights_line: string;
  footer_cta_title: string;
  footer_cta_accent: string;
  footer_cta_copy: string;
  instagram_handle: string;
  instagram_url: string;
  linkedin_url: string;
  phone_display: string;
  email: string;
  stats: SiteStat[];
};

export const DEFAULT_SITE_GLOBALS: SiteGlobals = {
  footer_blurb:
    "Experiential stations that bring people together—and give them something memorable to take home. One creative team, from set-up to the final keepsake.",
  footer_tagline: "Make the moment stay.",
  footer_badge: "Bengaluru event studio",
  footer_location: "Bengaluru, Karnataka, India",
  footer_gst_note: "18% GST on B2B invoices. 50% non-refundable advance to hold a date.",
  footer_copyright: "© 2026 Visriva. All rights reserved.",
  footer_rights_line: "Experiences designed to bring people together.",
  footer_cta_title: "Your next event",
  footer_cta_accent: "starts here.",
  footer_cta_copy: "Tell us what you are planning. We'll help you build the right mix of experiences.",
  instagram_handle: "@visriva.co",
  instagram_url: "",
  linkedin_url: "",
  phone_display: "",
  email: "",
  stats: [
    { label: "Events executed", value: 120, suffix: "+" },
    { label: "Companies served", value: 40, suffix: "+" },
    { label: "Stations in inventory", value: 18, suffix: "" },
  ],
};

export function mergeSiteGlobals(partial: unknown): SiteGlobals {
  if (!partial || typeof partial !== "object") return { ...DEFAULT_SITE_GLOBALS };
  const p = partial as Partial<SiteGlobals>;
  return {
    ...DEFAULT_SITE_GLOBALS,
    ...p,
    stats: Array.isArray(p.stats) && p.stats.length ? p.stats : DEFAULT_SITE_GLOBALS.stats,
  };
}