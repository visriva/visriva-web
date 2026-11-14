import {
  galleryIframeAllow,
  parseGalleryInput,
  pickGalleryFrameUrl,
  type ParsedGalleryEmbed,
} from "@/lib/parseGalleryEmbed";

export type GalleryEmbedResolution = ParsedGalleryEmbed;

export function resolveGalleryEmbed(raw: string): GalleryEmbedResolution {
  return parseGalleryInput(raw);
}

export { parseGalleryInput, pickGalleryFrameUrl, galleryIframeAllow };
export { parseGalleryInput as parseGalleryEmbed } from "@/lib/parseGalleryEmbed";