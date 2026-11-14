"use client";

import { DEFAULT_GALLERY_IFRAME_ALLOW } from "@/lib/parseGalleryEmbed";

type Props = {
  src: string;
  eventName: string;
  allow?: string | null;
};

export function EventGalleryEmbed({ src, eventName, allow }: Props) {
  if (!src) {
    return (
      <div className="grid h-[40vh] min-h-[320px] place-items-center rounded-2xl border border-dashed border-gold/30 bg-ink/40 p-6 text-center text-sm text-mist">
        Gallery link is not configured yet.
      </div>
    );
  }

  const allowAttr = (allow?.trim() || DEFAULT_GALLERY_IFRAME_ALLOW).replace(/\s+/g, " ");

  return (
    <div className="relative h-[82vh] min-h-[600px] w-full overflow-hidden rounded-2xl border border-[#C9A227]/30 bg-[#06241B] shadow-2xl">
      <iframe
        title={`${eventName} photo gallery`}
        src={src}
        allow={allowAttr}
        allowFullScreen
        className="h-full w-full border-0"
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}