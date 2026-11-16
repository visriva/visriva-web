import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const SERVICE_PATHS = [
  "/services/photo-booth",
  "/services/magnet-station",
  "/services/tote-tshirt-station",
  "/services/mug-printing",
  "/services/keychain-station",
] as const;

const paths = [
  "",
  "/photo-booths",
  ...SERVICE_PATHS,
  "/ai-merchandise",
  "/games-vr",
  "/about",
  "/gallery",
  "/client-requirements",
  "/rate-card",
  "/quote",
  "/reserve",
  "/qr",
  "/reviews",
];

const priority: Record<string, number> = {
  "": 1,
  "/quote": 0.95,
  "/rate-card": 0.9,
  "/photo-booths": 0.9,
  "/services/photo-booth": 0.9,
  "/services/magnet-station": 0.9,
  "/services/tote-tshirt-station": 0.9,
  "/services/mug-printing": 0.9,
  "/services/keychain-station": 0.9,
  "/reserve": 0.9,
  "/ai-merchandise": 0.88,
  "/games-vr": 0.88,
  "/qr": 0.85,
  "/reviews": 0.85,
};

const weeklyPaths = new Set<string>(["", ...SERVICE_PATHS, "/photo-booths", "/reserve"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: now,
    changeFrequency: weeklyPaths.has(path) ? "weekly" : "monthly",
    priority: priority[path] ?? 0.7,
  }));
}