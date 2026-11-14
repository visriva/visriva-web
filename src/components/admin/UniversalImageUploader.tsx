"use client";

import { ImagePlus, Link2, RotateCcw } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { formatBytes, prepareImageForUpload, readImageMeta, readUrlImageMeta } from "@/lib/image-process";

export type ImagePreset = "hero" | "service" | "square" | "story" | "logo";

const PRESETS: Record<ImagePreset, string> = {
  hero: "Recommended: 1920 × 1080 px (16:9) or 1080 × 1350 px (4:5 mobile) • Any format",
  service: "Recommended: 1200 × 900 px (4:3) • Any format",
  square: "Recommended: 1000 × 1000 px (1:1) • Any format",
  story: "Recommended: 1080 × 1920 px (9:16 vertical) • Any format",
  logo: "Recommended: 800 × 800 px (square emblem) • PNG or SVG",
};

type Meta = { width: number; height: number; sizeLabel: string; format: string } | null;

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  preset: ImagePreset;
  slot: string;
  uploadEndpoint?: string;
};

export function UniversalImageUploader({
  label,
  value,
  onChange,
  preset,
  slot,
  uploadEndpoint = "/api/admin/upload-image",
}: Props) {
  const inputId = useId();
  const [urlMode, setUrlMode] = useState(false);
  const [urlDraft, setUrlDraft] = useState(value);
  const [meta, setMeta] = useState<Meta>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setUrlDraft(value);
    if (!value) {
      setMeta(null);
      return;
    }
    readUrlImageMeta(value)
      .then((dims) => setMeta({ ...dims, sizeLabel: "Remote", format: value.split(".").pop()?.toUpperCase() ?? "URL" }))
      .catch(() => setMeta(null));
  }, [value]);

  async function onPick(file: File) {
    setError("");
    setPending(true);
    try {
      const nextMeta = await readImageMeta(file);
      setMeta(nextMeta);
      const uploadFile = await prepareImageForUpload(file);
      const form = new FormData();
      form.set("image", uploadFile);
      form.set("slot", slot);
      const response = await fetch(uploadEndpoint, { method: "POST", body: form });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(typeof body.error === "string" ? body.error : "Upload failed.");
        return;
      }
      const url = String(body.url ?? body.image_path ?? "");
      onChange(url);
      setUrlDraft(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process image.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-xl border border-gold/25 bg-[#0D2117]/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-medium text-champagne">{label}</p>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[10px] leading-snug text-gold-2">
          {PRESETS[preset]}
        </span>
      </div>

      {value ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-gold/20 bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="max-h-40 w-full object-cover" />
        </div>
      ) : (
        <div className="mt-3 grid h-28 place-items-center rounded-lg border border-dashed border-gold/30 text-xs text-mist">No image yet</div>
      )}

      {meta ? (
        <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
          <span className="rounded border border-gold/25 px-2 py-1 text-mist">
            {meta.width} × {meta.height} px
          </span>
          <span className="rounded border border-gold/25 px-2 py-1 text-mist">{meta.sizeLabel}</span>
          <span className="rounded border border-gold/25 px-2 py-1 text-gold">{meta.format}</span>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <label
          htmlFor={inputId}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-champagne"
        >
          <ImagePlus className="h-3.5 w-3.5" aria-hidden />
          {pending ? "Uploading…" : "Change / upload"}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*,.heic,.heif,.avif,.svg"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPick(file);
          }}
        />
        <button
          type="button"
          onClick={() => {
            onChange("");
            setUrlDraft("");
            setMeta(null);
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/25 px-4 py-2 text-[10px] uppercase tracking-wider text-mist"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset
        </button>
        <button
          type="button"
          onClick={() => setUrlMode((v) => !v)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/25 px-4 py-2 text-[10px] uppercase tracking-wider text-mist"
        >
          <Link2 className="h-3.5 w-3.5" aria-hidden />
          {urlMode ? "Hide URL" : "Paste URL"}
        </button>
      </div>

      {urlMode ? (
        <div className="mt-3 flex gap-2">
          <input className="field min-h-11 flex-1" value={urlDraft} onChange={(e) => setUrlDraft(e.target.value)} placeholder="https://..." />
          <button
            type="button"
            className="liquid-button rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider"
            onClick={() => onChange(urlDraft.trim())}
          >
            Use URL
          </button>
        </div>
      ) : null}

      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}