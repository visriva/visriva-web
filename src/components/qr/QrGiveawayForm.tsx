"use client";

import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { QR_GIVEAWAY_STATIONS } from "@/lib/qr-constants";

export function QrGiveawayForm() {
  const [fullName, setFullName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [phone, setPhone] = useState("");
  const [station, setStation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onPick(next: File | null) {
    setFile(next);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(next ? URL.createObjectURL(next) : null);
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
      <div className="rounded-3xl border border-[#C9A227]/40 bg-white/5 p-8 text-center backdrop-blur-md" role="status">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#10B981]/50 bg-[#10B981]/15 text-3xl">
          ✓
        </div>
        <h3 className="mt-5 font-display text-3xl text-[#F8F9FA]">You&apos;re In!</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#B8C2B4]">
          Your weekly giveaway entry is logged. Winners are revealed every week — watch{" "}
          <strong className="text-[#E5C158]">@visrivalivestation</strong> for live reaction reels.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 min-h-11 rounded-full border border-[#C9A227]/40 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#E9DFBD]"
        >
          Submit another entry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" id="qr-entry">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <label className="block text-sm text-[#B8C2B4]">
        Full name <span className="text-[#E5C158]">*</span>
        <input required className="field mt-2 min-h-11" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
      </label>

      <label className="block text-sm text-[#B8C2B4]">
        Instagram handle <span className="text-[#E5C158]">*</span>
        <input
          required
          className="field mt-2 min-h-11"
          placeholder="@visriva.co"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          autoComplete="username"
        />
      </label>

      <label className="block text-sm text-[#B8C2B4]">
        Phone / WhatsApp <span className="text-[#E5C158]">*</span>
        <input
          required
          type="tel"
          className="field mt-2 min-h-11"
          placeholder="+91 98XXX XXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />
      </label>

      <fieldset>
        <legend className="text-sm text-[#B8C2B4]">
          Which Visriva station did you visit? <span className="text-[#E5C158]">*</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {QR_GIVEAWAY_STATIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStation(item)}
              className={`min-h-11 rounded-full border px-4 py-2.5 text-xs font-medium transition ${
                station === item
                  ? "border-[#E5C158] bg-[#C9A227]/20 text-[#F8F9FA]"
                  : "border-[#C9A227]/25 bg-white/5 text-[#E9DFBD] hover:border-[#C9A227]/50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </fieldset>

      <ScreenshotField preview={preview} inputRef={inputRef} onPick={onPick} hasFile={Boolean(file)} />

      {error ? (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !station || !file}
        className="liquid-button flex min-h-12 w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.14em] disabled:opacity-50"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Submitting…
          </>
        ) : (
          "Submit giveaway entry →"
        )}
      </button>
    </form>
  );
}

function ScreenshotField({
  preview,
  inputRef,
  onPick,
  hasFile,
}: {
  preview: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onPick: (file: File | null) => void;
  hasFile: boolean;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="text-sm text-[#B8C2B4]">
      Screenshot (tag <strong className="text-[#E5C158]">@visriva.co</strong>) <span className="text-[#E5C158]">*</span>
      <div
        className={`mt-2 rounded-2xl border border-dashed p-4 text-center transition ${
          dragging ? "border-[#E5C158] bg-[#C9A227]/10" : "border-[#C9A227]/35 bg-[#06241B]/60"
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
          if (next?.type.startsWith("image/")) onPick(next);
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Instagram screenshot preview" className="mx-auto max-h-48 rounded-xl object-contain" />
        ) : (
          <Upload className="mx-auto h-8 w-8 text-[#C9A227]" aria-hidden />
        )}
        <p className="mt-3 text-xs leading-relaxed text-[#8FA89B]">Drag &amp; drop or tap to upload your story/post screenshot</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 min-h-11 rounded-full border border-[#C9A227]/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#E9DFBD]"
        >
          {hasFile ? "Change screenshot" : "Choose from gallery"}
        </button>
      </div>
    </div>
  );
}