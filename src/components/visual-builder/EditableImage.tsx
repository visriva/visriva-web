"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { IMAGE_PRESET_HINTS, type VisualImageSlot } from "@/lib/visual-builder-types";
import { useVisualBuilderOptional } from "@/components/visual-builder/VisualBuilderProvider";

type Props = {
  fieldKey: string;
  src: string;
  alt: string;
  preset?: VisualImageSlot["preset"];
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export function EditableImage({
  fieldKey,
  src,
  alt,
  preset = "hero",
  className = "",
  fill,
  sizes,
  priority,
  width,
  height,
}: Props) {
  const vb = useVisualBuilderOptional();
  const inputRef = useRef<HTMLInputElement>(null);
  const [meta, setMeta] = useState<{ w: number; h: number } | null>(null);
  const liveSrc = vb?.image(fieldKey, src) ?? src;
  const liveAlt = vb?.imageAlt(fieldKey, alt) ?? alt;
  const edit = vb?.isEditMode;

  async function onPick(file: File) {
    if (!vb) return;
    const form = new FormData();
    form.append("file", file);
    form.append("slot", fieldKey);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: form });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.url) return;
    const bitmap = await createImageBitmap(file).catch(() => null);
    if (bitmap) setMeta({ w: bitmap.width, h: bitmap.height });
    vb.setImage(fieldKey, { url: body.url as string, alt: liveAlt, preset });
  }

  const shell = (
    <>
      {fill ? (
        <Image src={liveSrc} alt={liveAlt} fill className={className} sizes={sizes} priority={priority} />
      ) : (
        <Image src={liveSrc} alt={liveAlt} width={width ?? 800} height={height ?? 600} className={className} priority={priority} sizes={sizes} />
      )}
      {edit ? (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] ring-2 ring-inset ring-[#C9A227]/60"
            aria-label="Replace image"
          />
          <div className="pointer-events-none absolute left-2 top-2 z-20 max-w-[min(100%,220px)] rounded-lg border border-[#C9A227]/50 bg-[#04150F]/95 px-2 py-1 text-[9px] leading-snug text-[#F5E6B8] shadow-lg">
            <span className="block font-bold text-[#E5C158]">Target: {IMAGE_PRESET_HINTS[preset ?? "hero"]}</span>
            {meta ? (
              <span className="text-white/80">
                Current: {meta.w} × {meta.h} px
              </span>
            ) : (
              <span className="text-white/70">Click to replace</span>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.heic,.heif,.avif,.svg"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onPick(file);
            }}
          />
        </>
      ) : null}
    </>
  );

  return <div className={`relative ${fill ? "h-full w-full" : ""}`}>{shell}</div>;
}