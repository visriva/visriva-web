export type ParsedGalleryEmbed = {
  rawInput: string;
  /** URL taken from iframe src= or plain link */
  sourceUrl: string;
  directUrl: string;
  embedUrl: string;
  provider: string;
  likelyEmbeddable: boolean;
  /** Parsed from pasted iframe allow= or null */
  iframeAllow: string | null;
};

export const DEFAULT_GALLERY_IFRAME_ALLOW =
  "web-share; clipboard-write; fullscreen; camera; microphone";

const IFRAME_SRC_RE = /src\s*=\s*["']([^"']+)["']/i;
const IFRAME_ALLOW_RE = /allow\s*=\s*["']([^"']+)["']/i;

/** Accepts raw URL, iframe HTML, or mixed whitespace. */
export function parseGalleryInput(raw: string): ParsedGalleryEmbed {
  const trimmed = raw.trim();
  const empty: ParsedGalleryEmbed = {
    rawInput: trimmed,
    sourceUrl: "",
    directUrl: "",
    embedUrl: "",
    provider: "empty",
    likelyEmbeddable: false,
    iframeAllow: null,
  };
  if (!trimmed) return empty;

  let sourceUrl = trimmed;
  let iframeAllow: string | null = null;

  if (/<iframe[\s>]/i.test(trimmed)) {
    const srcMatch = trimmed.match(IFRAME_SRC_RE);
    const allowMatch = trimmed.match(IFRAME_ALLOW_RE);
    if (srcMatch?.[1]) sourceUrl = srcMatch[1].trim();
    if (allowMatch?.[1]) iframeAllow = allowMatch[1].trim();
  }

  const resolved = resolvePlainGalleryUrl(sourceUrl);

  return {
    rawInput: trimmed,
    sourceUrl,
    directUrl: resolved.directUrl,
    embedUrl: resolved.embedUrl,
    provider: resolved.provider,
    likelyEmbeddable: resolved.likelyEmbeddable,
    iframeAllow,
  };
}

/** Alias for embed-focused call sites */
export const parseGalleryEmbed = parseGalleryInput;

function resolvePlainGalleryUrl(input: string): Omit<ParsedGalleryEmbed, "rawInput" | "sourceUrl" | "iframeAllow"> {
  const trimmed = input.trim();
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

  if (host.includes("fotoshare.co") || host.includes("guest.fotoshare")) {
    const embedUrl = ensureFotoshareEmbedUrl(url);
    return { directUrl, embedUrl, provider: "fotoshare", likelyEmbeddable: true };
  }

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
    const embedUrl = directUrl.replace("?dl=1", "?dl=0");
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

function ensureFotoshareEmbedUrl(url: URL): string {
  const next = new URL(url.toString());
  if (!next.searchParams.has("embed") || next.searchParams.get("embed") !== "1") {
    next.searchParams.set("embed", "1");
  }
  return next.toString();
}

export function pickGalleryFrameUrl(
  parsed: ParsedGalleryEmbed,
  mode: "embed" | "fullscreen",
  useDirect: boolean,
): string {
  if (useDirect) return parsed.directUrl || parsed.embedUrl;
  if (mode === "fullscreen") return parsed.directUrl || parsed.embedUrl;
  return parsed.embedUrl || parsed.directUrl;
}

export function galleryIframeAllow(parsed: ParsedGalleryEmbed): string {
  return parsed.iframeAllow?.trim() || DEFAULT_GALLERY_IFRAME_ALLOW;
}