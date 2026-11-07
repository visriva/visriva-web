import type { Metadata } from "next";
import { brandLogoSrc } from "@/lib/site";

export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
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
