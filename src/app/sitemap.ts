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
  "/reviews",
];

const priority: Record<string, number> = {
  "": 1,
  "/quote": 0.95,
  "/rate-card": 0.9,
  "/photo-booths": 0.88,
  "/ai-merchandise": 0.88,
  "/games-vr": 0.88,
  "/qr": 0.85,
  "/reviews": 0.85,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/qr" ? "weekly" : "monthly",
    priority: priority[path] ?? 0.7,
  }));
}
