"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EventGalleryEmbed } from "@/components/qr/EventGalleryEmbed";
import { QrLuxuryModal } from "@/components/qr/QrLuxuryModal";
import type { EventGalleryPublic, EventPhotosSettings } from "@/lib/event-galleries-types";

/** Query keys that must never appear on /qr (anti link-sharing). */
const PHOTO_QUERY_KEYS = new Set(["tab", "event", "eventId", "unlocked", "photos"]);

type UnlockPayload = {
  eventId: string;
  event_name: string;
  event_date: string;
  embed_mode: "embed" | "fullscreen";
  frameUrl: string;
  directUrl: string;
  embedUrl: string;
  iframeAllow?: string;
};

type Phase = "idle" | "gatekeeper" | "vault" | "gallery";

export function QrEventPhotosFlow({ initialSettings }: { initialSettings: EventPhotosSettings }) {
  const router = useRouter();

  const [settings] = useState(initialSettings);
  const [phase, setPhase] = useState<Phase>("idle");
  const [events, setEvents] = useState<EventGalleryPublic[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [shake, setShake] = useState(false);
  const [pending, setPending] = useState(false);
  const [unlock, setUnlock] = useState<UnlockPayload | null>(null);
  const [useDirectView, setUseDirectView] = useState(false);

  /** In-memory only for this page load (cleared on refresh / new tab). Not stored in URL or storage. */
  const unlockedPasswordRef = useRef("");

  const whatsappHref = useMemo(() => {
    const digits = settings.whatsapp_number.replace(/\D/g, "") || "918884484828";
    const withCountry = digits.length === 10 ? `91${digits}` : digits;
    return `https://wa.me/${withCountry}?text=${encodeURIComponent(settings.whatsapp_message)}`;
  }, [settings]);

  const phoneDisplay = useMemo(() => settings.whatsapp_number.replace(/\D/g, "") || "8884484828", [settings]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    let strip = false;
    for (const key of [...url.searchParams.keys()]) {
      if (PHOTO_QUERY_KEYS.has(key.toLowerCase())) {
        url.searchParams.delete(key);
        strip = true;
      }
    }
    if (strip) {
      const qs = url.searchParams.toString();
      router.replace(qs ? `${url.pathname}?${qs}` : "/qr", { scroll: false });
    }
  }, [router]);

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    const response = await fetch("/api/event-galleries", { cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    setEventsLoading(false);
    if (response.ok) {
      setEvents((body.events ?? []) as EventGalleryPublic[]);
    }
  }, []);

  function resetVaultFields() {
    setSelectedId("");
    setPassword("");
    setShowPassword(false);
    setUnlockError("");
    unlockedPasswordRef.current = "";
  }

  function openGatekeeper() {
    resetVaultFields();
    setUnlock(null);
    setUseDirectView(false);
    setPhase("gatekeeper");
  }

  function passGatekeeper() {
    setPhase("vault");
    void loadEvents();
  }

  function closeFlow() {
    setPhase("idle");
    resetVaultFields();
    setUnlock(null);
    setUseDirectView(false);
  }

  function backToVault() {
    setUnlock(null);
    setPassword("");
    setUseDirectView(false);
    unlockedPasswordRef.current = "";
    setPhase("vault");
    void loadEvents();
  }

  async function tryUnlock(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setUnlockError("");
    const response = await fetch("/api/event-galleries/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
      cache: "no-store",
      body: JSON.stringify({ eventId: selectedId, password }),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);

    if (!response.ok) {
      setUnlockError(typeof body.error === "string" ? body.error : settings.password_error);
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return;
    }

    const payload: UnlockPayload = {
      eventId: selectedId,
      event_name: String(body.event_name),
      event_date: String(body.event_date),
      embed_mode: body.embed_mode === "fullscreen" ? "fullscreen" : "embed",
      frameUrl: String(body.frameUrl),
      directUrl: String(body.directUrl),
      embedUrl: String(body.embedUrl),
      iframeAllow: typeof body.iframeAllow === "string" ? body.iframeAllow : undefined,
    };
    unlockedPasswordRef.current = password;
    setUnlock(payload);
    setPhase("gallery");
  }

  useEffect(() => {
    if (phase !== "gallery" || !unlock?.eventId) return;

    async function refreshEmbed() {
      const eventId = unlock?.eventId;
      const pw = unlockedPasswordRef.current;
      if (!eventId || !pw) return;
      const response = await fetch("/api/event-galleries/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ eventId, password: pw }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) return;
      setUnlock({
        eventId,
        event_name: String(body.event_name),
        event_date: String(body.event_date),
        embed_mode: body.embed_mode === "fullscreen" ? "fullscreen" : "embed",
        frameUrl: String(body.frameUrl),
        directUrl: String(body.directUrl),
        embedUrl: String(body.embedUrl),
        iframeAllow: typeof body.iframeAllow === "string" ? body.iframeAllow : undefined,
      });
    }

    const onVisible = () => {
      if (document.visibilityState === "visible") void refreshEmbed();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [phase, unlock?.eventId]);

  const gallerySrc = useMemo(() => {
    if (!unlock) return "";
    if (useDirectView) return unlock.directUrl || unlock.frameUrl;
    if (unlock.embed_mode === "fullscreen") return unlock.directUrl || unlock.embedUrl || unlock.frameUrl;
    return unlock.frameUrl || unlock.embedUrl || unlock.directUrl;
  }, [unlock, useDirectView]);

  const eventOptions = events.map((ev) => ({
    id: ev.id,
    label: `${ev.event_name} — ${formatEventDate(ev.event_date)}`,
  }));

  return (
    <>
      <section className="mb-10">
        <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-[#C9A227] bg-[#07291E] p-7 shadow-[0_20px_60px_rgba(0,0,0,.45)] sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C9A227]/20" aria-hidden />
          <p className="font-royal text-[0.65rem] uppercase tracking-[0.3em] text-[#E8D48A]">Your event memories</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-white sm:text-4xl">Event photo vault</h2>
          <p className="mt-4 text-base leading-relaxed text-white/88">
            View and download photos from your Visriva station — without leaving this page. For your privacy, you’ll verify on this device each time you open the vault.
          </p>
          <button
            type="button"
            onClick={openGatekeeper}
            className="qr-gold-btn mt-7 min-h-12 w-full rounded-full px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] sm:w-auto"
          >
            {settings.hero_button_text}
          </button>
        </div>
      </section>

      <QrLuxuryModal open={phase === "gatekeeper"} onClose={closeFlow} ariaLabelledBy="event-photos-gate-title">
        <p id="event-photos-gate-title" className="pr-12 font-royal text-[0.65rem] uppercase tracking-[0.28em] text-[#E8D48A]">
          Step 1 · Before you view
        </p>
        <h3 className="mt-4 font-display text-2xl leading-snug text-white sm:text-3xl">{settings.instagram_headline}</h3>

        <a
          href={settings.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[#C9A227] bg-[#0B3D2E] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#F5E6B8]"
        >
          <span className="text-base" aria-hidden>
            IG
          </span>
          {settings.instagram_button_text}
        </a>

        <p className="mt-7 text-[15px] font-medium leading-relaxed text-white">{settings.customization_message}</p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="qr-gold-btn mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em]"
        >
          {settings.whatsapp_button_text} ({phoneDisplay})
        </a>

        <button type="button" onClick={passGatekeeper} className="qr-gold-btn mt-8 min-h-12 w-full rounded-full px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em]">
          {settings.gate_next_label}
        </button>
      </QrLuxuryModal>

      <QrLuxuryModal open={phase === "vault"} onClose={closeFlow} layout="scroll" maxWidthClass="max-w-xl" ariaLabelledBy="event-vault-title">
        <VaultForm
          settings={settings}
          eventsLoading={eventsLoading}
          eventOptions={eventOptions}
          selectedId={selectedId}
          onSelect={setSelectedId}
          password={password}
          onPassword={setPassword}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((v) => !v)}
          shake={shake}
          error={unlockError}
          pending={pending}
          onSubmit={tryUnlock}
        />
      </QrLuxuryModal>

      <QrLuxuryModal open={phase === "gallery" && Boolean(unlock)} onClose={closeFlow} layout="scroll" maxWidthClass="max-w-5xl" ariaLabelledBy="event-gallery-title">
        {unlock ? (
          <GalleryView
            settings={settings}
            unlock={unlock}
            whatsappHref={whatsappHref}
            phoneDisplay={phoneDisplay}
            gallerySrc={gallerySrc}
            useDirectView={useDirectView}
            onToggleDirect={() => setUseDirectView((v) => !v)}
            onChangeEvent={backToVault}
            onHardRefresh={() => window.location.assign("/qr")}
          />
        ) : null}
      </QrLuxuryModal>
    </>
  );
}

function formatEventDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(`${iso}T12:00:00`));
  } catch {
    return iso;
  }
}

function VaultForm({
  settings,
  eventsLoading,
  eventOptions,
  selectedId,
  onSelect,
  password,
  onPassword,
  showPassword,
  onTogglePassword,
  shake,
  error,
  pending,
  onSubmit,
}: {
  settings: EventPhotosSettings;
  eventsLoading: boolean;
  eventOptions: { id: string; label: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
  password: string;
  onPassword: (v: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  shake: boolean;
  error: string;
  pending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <motion.div animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}>
      <h2 id="event-vault-title" className="pr-10 font-display text-3xl text-white">
        {settings.vault_title}
      </h2>
      <p className="mt-3 text-base text-white/85">{settings.vault_subtitle}</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#E8D48A]">
          Select your event
          <select
            className="qr-field-light mt-2 w-full"
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
            required
            disabled={eventsLoading}
          >
            <option value="">{eventsLoading ? "Loading events…" : "Choose an event"}</option>
            {eventOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#E8D48A]">
          Event password
          <div className="relative mt-2">
            <input
              className="qr-field-light w-full pr-12"
              type={showPassword ? "text" : "password"}
              inputMode="numeric"
              autoComplete="off"
              value={password}
              onChange={(e) => onPassword(e.target.value)}
              placeholder="DDMM"
              required
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center text-white/70"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        <p className="rounded-xl border border-[#C9A227]/35 bg-[#041912] px-4 py-3 text-sm leading-relaxed text-[#F5E6B8]">{settings.password_hint}</p>

        {error ? (
          <p className="rounded-xl border-2 border-red-400/50 bg-red-950/50 px-4 py-3 text-sm font-medium text-red-100">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending || !selectedId}
          className="qr-gold-btn flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {settings.unlock_button_text}
        </button>
      </form>
    </motion.div>
  );
}

function GalleryView({
  settings,
  unlock,
  whatsappHref,
  phoneDisplay,
  gallerySrc,
  useDirectView,
  onToggleDirect,
  onChangeEvent,
  onHardRefresh,
}: {
  settings: EventPhotosSettings;
  unlock: UnlockPayload;
  whatsappHref: string;
  phoneDisplay: string;
  gallerySrc: string;
  useDirectView: boolean;
  onToggleDirect: () => void;
  onChangeEvent: () => void;
  onHardRefresh: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-[#C9A227]/25 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p id="event-gallery-title" className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8D48A]">
            {formatEventDate(unlock.event_date)}
          </p>
          <h2 className="mt-1 font-display text-2xl text-white sm:text-3xl">{unlock.event_name}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onChangeEvent}
            className="rounded-full border-2 border-white/25 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
          >
            {settings.gallery_change_event_label}
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-[#C9A227] bg-[#C9A227]/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#F5E6B8]"
          >
            {settings.gallery_whatsapp_label} ({phoneDisplay})
          </a>
          <button
            type="button"
            onClick={onToggleDirect}
            className="rounded-full border-2 border-white/25 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/90"
          >
            {useDirectView ? "Use embedded grid" : settings.gallery_fullscreen_label}
          </button>
        </div>
      </div>

      <EventGalleryEmbed src={gallerySrc} eventName={unlock.event_name} allow={unlock.iframeAllow} />

      <p className="text-center text-sm text-white/75">
        Having trouble loading?{" "}
        <button type="button" onClick={onHardRefresh} className="font-semibold text-[#E8D48A] underline">
          Reload this page
        </button>{" "}
        (you’ll verify again) or WhatsApp us for help.
      </p>
    </div>
  );
}