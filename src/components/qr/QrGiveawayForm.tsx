"use client";

import { Upload } from "lucide-react";
import { MotionSubmitButton } from "@/components/framer-ui";
import { useRef, useState } from "react";
import { prepareImageForUpload, readImageMeta, type ImageMeta } from "@/lib/image-process";
import type { QrFormCopy } from "@/lib/qr-content-types";

export function QrGiveawayForm({ copy, stations }: { copy: QrFormCopy; stations: string[] }) {
  const [fullName, setFullName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [phone, setPhone] = useState("");
  const [station, setStation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [shotMeta, setShotMeta] = useState<ImageMeta | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(next: File | null) {
    if (preview) URL.revokeObjectURL(preview);
  if (!next) {
      setFile(null);
      setPreview(null);
      setShotMeta(null);
      return;
    }
    setProcessingImage(true);
    setError("");
    try {
      const meta = await readImageMeta(next);
      const prepared = await prepareImageForUpload(next);
      setFile(prepared);
      setShotMeta({
        ...meta,
        sizeLabel: meta.sizeLabel,
        format: (prepared.type.split("/")[1] || meta.format).toUpperCase(),
      });
      setPreview(URL.createObjectURL(prepared));
    } catch {
      setError("Could not read that photo. Try another image.");
      setFile(null);
      setPreview(null);
      setShotMeta(null);
    } finally {
      setProcessingImage(false);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    setError("");
    setPending(true);

    const form = new FormData();
    form.set("full_name", fullName);
    form.set("instagram_handle", instagram);
    form.set("phone", phone);
    form.set("station", station);
    if (file) form.set("screenshot", file);

    const response = await fetch("/api/qr/entries", { method: "POST", body: form });
    const body = await response.json().catch(() => ({}));
    setPending(false);

    if (!response.ok) {
      setError(typeof body.error === "string" ? body.error : "Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
    setFullName("");
    setInstagram("");
    setPhone("");
    setStation("");
    onPick(null);
  }

  if (success) {
    return (
      <div className="qr-glass-card rounded-3xl p-8 text-center" role="status">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#10B981]/50 bg-[#10B981]/15 text-3xl text-[#10B981]">
          ✓
        </div>
        <h3 className="mt-5 font-display text-3xl text-cream">{copy.success_title}</h3>
        <p className="mt-2 text-sm leading-relaxed qr-body-muted">{copy.success_body}</p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="qr-gold-btn mt-6 min-h-11 rounded-full px-6 py-3 text-[10px] font-bold uppercase tracking-wider"
        >
          {copy.success_cta}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" id="qr-entry">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <label className="block text-sm qr-body-muted">
        {copy.full_name_label} <span className="text-gold-2">*</span>
        <input required className="field mt-2 min-h-11" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
      </label>

      <label className="block text-sm qr-body-muted">
        {copy.instagram_label} <span className="text-gold-2">*</span>
        <input
          required
          className="field mt-2 min-h-11"
          placeholder={copy.instagram_placeholder}
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          autoComplete="username"
        />
      </label>

      <label className="block text-sm qr-body-muted">
        {copy.phone_label} <span className="text-gold-2">*</span>
        <input
          required
          type="tel"
          className="field mt-2 min-h-11"
          placeholder={copy.phone_placeholder}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />
      </label>

      <fieldset>
        <legend className="text-sm qr-body-muted">
          {copy.station_legend} <span className="text-gold-2">*</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {stations.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStation(item)}
              className={`min-h-11 rounded-full border px-4 py-2.5 text-xs font-medium transition ${
                station === item ? "border-gold-2 bg-gold/20 text-cream" : "border-gold/25 bg-white/5 text-champagne hover:border-gold/50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </fieldset>

      <ScreenshotField
        copy={copy}
        preview={preview}
        meta={shotMeta}
        inputRef={inputRef}
        onPick={onPick}
        hasFile={Boolean(file)}
      />

      {error ? (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <MotionSubmitButton
        type="submit"
        pending={pending || processingImage}
        success={success}
        className="qr-gold-btn !w-full"
      >
        {pending ? copy.submitting : copy.submit_button}
      </MotionSubmitButton>
    </form>
  );
}

function ScreenshotField({
  copy,
  preview,
  meta,
  inputRef,
  onPick,
  hasFile,
}: {
  copy: QrFormCopy;
  preview: string | null;
  meta: ImageMeta | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onPick: (file: File | null) => Promise<void>;
  hasFile: boolean;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="text-sm qr-body-muted">
      {copy.screenshot_label} <span className="text-gold-2">*</span>
      <p className="mt-1 rounded-full border border-gold/25 bg-gold/5 px-2.5 py-1 text-[10px] text-gold-2">
        Recommended: story screenshot · any format (JPG, PNG, HEIC…)
      </p>
      <div
        className={`mt-2 rounded-2xl border border-dashed p-4 text-center transition ${
          dragging ? "border-gold-2 bg-gold/10" : "border-gold/35 bg-ink/60"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const next = e.dataTransfer.files?.[0];
          if (next?.type.startsWith("image/") || /\.heic|\.heif/i.test(next.name)) void onPick(next);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.heic,.heif,.avif"
          capture="environment"
          className="sr-only"
          onChange={(e) => void onPick(e.target.files?.[0] ?? null)}
        />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Instagram screenshot preview" className="mx-auto max-h-48 rounded-xl object-contain" />
        ) : (
          <Upload className="mx-auto h-8 w-8 text-gold" aria-hidden />
        )}
        {meta ? (
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-[10px] uppercase tracking-wider qr-body-muted">
            <span className="rounded border border-gold/25 px-2 py-1">
              {meta.width} × {meta.height} px
            </span>
            <span className="rounded border border-gold/25 px-2 py-1">{meta.sizeLabel}</span>
            <span className="rounded border border-gold/25 px-2 py-1 text-gold">{meta.format}</span>
          </div>
        ) : null}
        <p className="mt-3 text-xs leading-relaxed qr-body-muted">{copy.screenshot_hint}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 min-h-11 rounded-full border border-gold/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-champagne"
        >
          {hasFile ? copy.upload_change : copy.upload_button}
        </button>
      </div>
    </div>
  );
}