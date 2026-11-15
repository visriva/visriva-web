import type { HomeContent } from "@/lib/home-content-types";

/** Maps live-builder text keys → site_globals home_content fields on publish. */
export function mergeHomeContentFromTexts(content: HomeContent, texts: Record<string, string>): HomeContent {
  const pick = (key: string, fallback: string) => texts[key]?.trim() || fallback;

  return {
    ...content,
    experience: {
      ...content.experience,
      kicker: pick("experience_kicker", content.experience.kicker),
      title: pick("experience_title", content.experience.title),
      title_accent: pick("experience_title_accent", content.experience.title_accent),
      sidebar: pick("experience_sidebar", content.experience.sidebar),
      empty_state: pick("experience_empty_state", content.experience.empty_state),
      footer_kicker: pick("experience_footer_kicker", content.experience.footer_kicker),
      footer_title: pick("experience_footer_title", content.experience.footer_title),
      rate_card_label: pick("experience_rate_card_label", content.experience.rate_card_label),
      quote_cta_label: pick("experience_quote_cta_label", content.experience.quote_cta_label),
    },
    featured: {
      ...content.featured,
      kicker: pick("featured_kicker", content.featured.kicker),
      title: pick("featured_title", content.featured.title),
      title_accent: pick("featured_title_accent", content.featured.title_accent),
      sidebar: pick("featured_sidebar", content.featured.sidebar),
      cta_text: pick("featured_cta_text", content.featured.cta_text),
      cta_href: pick("featured_cta_href", content.featured.cta_href),
    },
    closing: {
      ...content.closing,
      kicker: pick("closing_kicker", content.closing.kicker),
      title: pick("closing_title", content.closing.title),
      title_accent: pick("closing_title_accent", content.closing.title_accent),
      body: pick("closing_body", content.closing.body),
    },
  };
}

export function serviceTextKey(serviceId: string, field: "name" | "priceLabel" | "summary" | "image") {
  return `service_${serviceId}_${field}`;
}