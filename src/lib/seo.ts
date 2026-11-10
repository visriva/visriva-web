import type { Metadata } from "next";

const brandLogoSrc = "/brand/visriva-mark.png";

const businessKeywords = [
  "event engagement Bengaluru",
  "corporate event engagement Bengaluru",
  "corporate event photo booth Bangalore",
  "AI photo booth Bengaluru",
  "AI photobooth Bangalore",
  "VR engagement events India",
  "live event merchandise Bangalore",
  "live DTF t-shirt printing Bangalore",
  "interactive event games Bengaluru",
];

export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    keywords: businessKeywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      title: `${title} · Visriva`,
      description,
      url: path,
      siteName: "Visriva",
      images: [brandLogoSrc],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Visriva`,
      description,
      images: [brandLogoSrc],
    },
    robots: { index: true, follow: true },
  };
}
