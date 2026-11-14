export type GalleryEmbedResolution = {
  directUrl: string;
  embedUrl: string;
  provider: string;
  likelyEmbeddable: boolean;
};

export function resolveGalleryEmbed(raw: string): GalleryEmbedResolution {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { directUrl: "", embedUrl: "", provider: "empty", likelyEmbeddable: false };
  }

  let url: URL;
  try {
    url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return { directUrl: trimmed, embedUrl: trimmed, provider: "unknown", likelyEmbeddable: false };
  }

  const host = url.hostname.toLowerCase();
  const directUrl = url.toString();

  const folderMatch = url.pathname.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (host.includes("drive.google.com") && folderMatch) {
    const id = folderMatch[1];
    return {
      directUrl,
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${id}#grid`,
      provider: "google_drive",
      likelyEmbeddable: true,
    };
  }

  const fileId = url.searchParams.get("id");
  if (host.includes("drive.google.com") && fileId) {
    return {
      directUrl,
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${fileId}#grid`,
      provider: "google_drive",
      likelyEmbeddable: true,
    };
  }

  if (host.includes("pixieset.com")) {
    const base = directUrl.replace(/\/$/, "");
    const embedUrl = base.includes("/embed") ? base : `${base}/embed`;
    return { directUrl, embedUrl, provider: "pixieset", likelyEmbeddable: true };
  }

  if (host.includes("smugmug.com")) {
    return { directUrl, embedUrl: directUrl, provider: "smugmug", likelyEmbeddable: true };
  }

  if (host.includes("dropbox.com")) {
    const embedUrl = directUrl.replace("?dl=0", "").replace("?dl=1", "");
    return { directUrl, embedUrl, provider: "dropbox", likelyEmbeddable: true };
  }

  if (host.includes("onedrive.live.com") || host.includes("1drv.ms") || host.includes("sharepoint.com")) {
    return { directUrl, embedUrl: directUrl, provider: "onedrive", likelyEmbeddable: false };
  }

  if (host.includes("lumabooth.com") || host.includes("guest.lumabooth")) {
    return { directUrl, embedUrl: directUrl, provider: "lumabooth", likelyEmbeddable: true };
  }

  return { directUrl, embedUrl: directUrl, provider: "custom", likelyEmbeddable: true };
}

export function pickGalleryFrameUrl(
  resolution: GalleryEmbedResolution,
  mode: "embed" | "fullscreen",
  useDirect: boolean,
): string {
  if (useDirect) return resolution.directUrl || resolution.embedUrl;
  if (mode === "fullscreen") return resolution.directUrl || resolution.embedUrl;
  return resolution.embedUrl || resolution.directUrl;
}