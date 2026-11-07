import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const paths = [
  "",
  "/photo-booths",
  "/ai-merchandise",
  "/games-vr",
  "/about",
  "/gallery",
  "/client-requirements",
  "/quote",
  "/classic",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
