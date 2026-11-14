"use client";

type Props = {
  src: string;
  eventName: string;
  fullscreenPreferred?: boolean;
};

export function EventGalleryEmbed({ src, eventName, fullscreenPreferred }: Props) {
  if (!src) {
    return (
      <div className="grid h-[40vh] place-items-center rounded-2xl border border-dashed border-gold/30 bg-ink/40 p-6 text-center text-sm text-mist">
        Gallery link is not configured yet.
      </div>
    );
  }

  return (
    <iframe
      title={`${eventName} photo gallery`}
      src={src}
      className={`w-full rounded-2xl border border-[#C9A227]/30 bg-[#06241B] ${fullscreenPreferred ? "h-[92svh]" : "h-[80vh]"}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allow="fullscreen"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads"
    />
  );
}