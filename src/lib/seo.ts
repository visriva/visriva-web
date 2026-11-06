import type { Metadata } from "next";

export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · Visriva`,
      description,
      url: path,
      images: ["/brand/visriva-green.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Visriva`,
      description,
      images: ["/brand/visriva-green.png"],
    },
  };
}
