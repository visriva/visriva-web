import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

const brandLogoSrc = "/brand/visriva-mark.png";

const businessKeywords = [
  "event engagement company Bengaluru",
  "corporate event engagement Bengaluru",
  "photo booth rental Bangalore",
  "corporate event photo booth Bangalore",
  "AI photo booth Bangalore",
  "AI photobooth for events Bengaluru",
  "VR engagement for corporate events Bangalore",
  "virtual reality event station Bengaluru",
  "live event merchandise Bangalore",
  "live DTF t-shirt printing Bangalore",
  "custom tote bag live station Bangalore",
  "magnet photo station Bangalore",
  "keychain live station for events",
  "interactive event games Bengaluru",
];

export function pageMeta(title: string, description: string, path: string): Metadata {
  const canonical = path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  return {
    title,
    description,
    keywords: businessKeywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_IN",
      title: `${title} | Visriva`,
      description,
      url: canonical,
      siteName: "Visriva",
      images: [{ url: brandLogoSrc, width: 800, height: 800, alt: "Visriva experiential event stations" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Visriva`,
      description,
      images: [brandLogoSrc],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}
