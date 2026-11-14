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
  "/rate-card",
  "/quote",
  "/qr",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${siteUrl}${path || "/"}`,
  }));
}
