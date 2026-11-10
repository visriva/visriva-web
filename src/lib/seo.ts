import type { Metadata } from "next";
const brandLogoSrc = "/brand/visriva-mark.png";

export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    keywords: [
      "AI photo booth Bengaluru",
      "AI photobooth Bangalore",
      "VR engagement events",
      "Corporate event photo booth",
      "Interactive event games",
      "Live event merchandise",
      "DTF T-shirt printing Bangalore",
    ],
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · Visriva`,
      description,
      url: path,
      images: [brandLogoSrc],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Visriva`,
      description,
      images: [brandLogoSrc],
    },
  };
}
