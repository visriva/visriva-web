"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EventGalleryEmbed } from "@/components/qr/EventGalleryEmbed";
import type { EventGalleryPublic, EventPhotosSettings } from "@/lib/event-galleries-types";

const GATE_KEY = "visriva_event_photos_gate";
const UNLOCK_KEY = "visriva_event_photos_unlock";
const PW_KEY = "visriva_event_photos_pw";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabPhotos = searchParams.get("tab") === "photos";

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

  const whatsappHref = useMemo(() => {
    const digits = settings.whatsapp_number.replace(/\D/g, "") || "918884484828";
    const withCountry = digits.length === 10 ? `91${digits}` : digits;
    return `https://wa.me/${withCountry}?text=${encodeURIComponent(settings.whatsapp_message)}`;
  }, [settings]);

  const phoneDisplay = useMemo(() => settings.whatsapp_number.replace(/\D/g, "") || "8884484828", [settings]);

  const syncTabUrl = useCallback(
    (photos: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      if (photos) params.set("tab", "photos");
      else params.delete("tab");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    const response = await fetch("/api/event-galleries", { cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    setEventsLoading(false);
    if (response.ok) {
      setEvents((body.events ?? []) as EventGalleryPublic[]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(UNLOCK_KEY);
      if (raw) setUnlock(JSON.parse(raw) as UnlockPayload);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!tabPhotos || phase !== "idle") return;
    const passed = typeof window !== "undefined" && sessionStorage.getItem(GATE_KEY) === "1";
    let stored: UnlockPayload | null = null;
    try {
      const raw = sessionStorage.getItem(UNLOCK_KEY);
      if (raw) stored = JSON.parse(raw) as UnlockPayload;
    } catch {
      stored = null;
    }
    if (passed) {
      setPhase(stored ? "gallery" : "vault");
      if (stored) setUnlock(stored);
      void loadEvents();
    } else {
      setPhase("gatekeeper");
    }
  }, [tabPhotos, phase, loadEvents]);

  function openGatekeeper() {
    setPhase("gatekeeper");
  }

  function passGatekeeper() {
    if (typeof window !== "undefined") sessionStorage.setItem(GATE_KEY, "1");
    syncTabUrl(true);
    setPhase("vault");
    void loadEvents();
  }

  function closeFlow() {
    setPhase("idle");
    syncTabUrl(false);
    setUnlockError("");
  }

  function backToVault() {
    setUnlock(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(UNLOCK_KEY);
      sessionStorage.removeItem(PW_KEY);
    }
    setPhase("vault");
    setUseDirectView(false);
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
    setUnlock(payload);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(UNLOCK_KEY, JSON.stringify(payload));
      sessionStorage.setItem(PW_KEY, password);
    }
    setPhase("gallery");
    syncTabUrl(true);
  }

  useEffect(() => {
    if (phase !== "gallery" || !unlock?.eventId) return;

    async function refreshEmbed() {
      const eventId = unlock?.eventId;
      if (!eventId || typeof window === "undefined") return;
      const pw = sessionStorage.getItem(PW_KEY);
      if (!pw) return;
      const response = await fetch("/api/event-galleries/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ eventId, password: pw }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) return;
      const next: UnlockPayload = {
        eventId,
        event_name: String(body.event_name),
        event_date: String(body.event_date),
        embed_mode: body.embed_mode === "fullscreen" ? "fullscreen" : "embed",
        frameUrl: String(body.frameUrl),
        directUrl: String(body.directUrl),
        embedUrl: String(body.embedUrl),
        iframeAllow: typeof body.iframeAllow === "string" ? body.iframeAllow : undefined,
      };
      setUnlock(next);
      sessionStorage.setItem(UNLOCK_KEY, JSON.stringify(next));
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
      <section className="mb-8">
        <div className="qr-glass-card relative overflow-hidden rounded-[1.75rem] border border-gold/45 bg-[linear-gradient(145deg,#0B3D2E_0%,#06241B_55%,#123D30_100%)] p-6 shadow-[0_20px_60px_rgba(0,0,0,.35)]">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/15 blur-3xl" aria-hidden />
          <p className="font-royal text-[0.62rem] uppercase tracking-[0.28em] text-gold">Your event memories</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-cream">Event photo vault</h2>
          <p className="mt-3 text-sm leading-relaxed text-mist">View and download photos from your Visriva station — without leaving this page.</p>
          <button type="button" onClick={openGatekeeper} className="qr-gold-btn mt-6 min-h-12 w-full rounded-full px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] sm:w-auto">
            {settings.hero_button_text}
          </button>
        </div>
      </section>

      <AnimatePresence>
        {phase === "gatekeeper" ? (
          <GatekeeperModal
            settings={settings}
            whatsappHref={whatsappHref}
            phoneDisplay={phoneDisplay}
            onClose={closeFlow}
            onNext={passGatekeeper}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "vault" || phase === "gallery" ? (
          <VaultOverlay onClose={closeFlow}>
            {phase === "vault" ? (
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
            ) : unlock ? (
              <GalleryView
                settings={settings}
                unlock={unlock}
                whatsappHref={whatsappHref}
                phoneDisplay={phoneDisplay}
                gallerySrc={gallerySrc}
                useDirectView={useDirectView}
                onToggleDirect={() => setUseDirectView((v) => !v)}
                onChangeEvent={backToVault}
              />
            ) : null}
          </VaultOverlay>
        ) : null}
      </AnimatePresence>
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

function VaultOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] overflow-y-auto bg-[#041912]/92 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto flex max-w-2xl justify-end">
        <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full border border-gold/35 text-cream" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="mx-auto mt-4 max-w-2xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function GatekeeperModal({
  settings,
  whatsappHref,
  phoneDisplay,
  onClose,
  onNext,
}: {
  settings: EventPhotosSettings;
  whatsappHref: string;
  phoneDisplay: string;
  onClose: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] grid place-items-center bg-[#041912]/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-photos-gate-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="qr-glass-card relative max-h-[90svh] w-full max-w-md overflow-y-auto rounded-[1.75rem] border border-[#C9A227]/45 bg-[#0B3D2E]/95 p-6 shadow-2xl"
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-mist" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
        <p id="event-photos-gate-title" className="pr-10 font-royal text-[0.62rem] uppercase tracking-[0.26em] text-gold">
          Event photos
        </p>
        <h3 className="mt-3 font-display text-2xl text-cream">{settings.instagram_headline}</h3>

        <a
          href={settings.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/40 bg-gradient-to-r from-[#C9A227]/20 to-transparent px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gold-2"
        >
          <span className="text-base" aria-hidden>
            IG
          </span>
          {settings.instagram_button_text}
        </a>

        <p className="mt-6 text-sm font-semibold leading-relaxed text-cream">{settings.customization_message}</p>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="qr-gold-btn mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em]">
          {settings.whatsapp_button_text} ({phoneDisplay})
        </a>

        <button type="button" onClick={onNext} className="qr-gold-btn mt-8 min-h-12 w-full rounded-full px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em]">
          {settings.gate_next_label}
        </button>
      </motion.div>
    </motion.div>
  );
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
    <motion.div animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }} className="qr-glass-card rounded-[1.75rem] border border-gold/35 p-6 sm:p-8">
      <h2 className="font-display text-3xl text-cream">{settings.vault_title}</h2>
      <p className="mt-3 text-sm text-mist">{settings.vault_subtitle}</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-gold-2">
          Select your event
          <select
            className="field mt-2 w-full"
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

        <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-gold-2">
          Event password
          <div className="relative mt-2">
            <input
              className="field w-full pr-12"
              type={showPassword ? "text" : "password"}
              inputMode="numeric"
              autoComplete="off"
              value={password}
              onChange={(e) => onPassword(e.target.value)}
              placeholder="DDMM"
              required
            />
            <button type="button" onClick={onTogglePassword} className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center text-mist" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        <p className="text-xs leading-relaxed text-mist">{settings.password_hint}</p>

        {error ? <p className="rounded-xl border border-red-400/40 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</p> : null}

        <button type="submit" disabled={pending || !selectedId} className="qr-gold-btn flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] disabled:opacity-50">
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
}: {
  settings: EventPhotosSettings;
  unlock: UnlockPayload;
  whatsappHref: string;
  phoneDisplay: string;
  gallerySrc: string;
  useDirectView: boolean;
  onToggleDirect: () => void;
  onChangeEvent: () => void;
}) {
  return (
    <div className="max-w-5xl space-y-4">
      <div className="qr-glass-card flex flex-col gap-3 rounded-2xl border border-gold/30 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">{formatEventDate(unlock.event_date)}</p>
          <h2 className="font-display text-2xl text-cream">{unlock.event_name}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onChangeEvent} className="rounded-full border border-gold/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-champagne">
            {settings.gallery_change_event_label}
          </button>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-gold-2">
            {settings.gallery_whatsapp_label} ({phoneDisplay})
          </a>
          <button type="button" onClick={onToggleDirect} className="rounded-full border border-gold/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-gold-2">
            {useDirectView ? "Use embedded grid" : settings.gallery_fullscreen_label}
          </button>
        </div>
      </div>

      <EventGalleryEmbed src={gallerySrc} eventName={unlock.event_name} allow={unlock.iframeAllow} />

      <p className="text-center text-[10px] text-mist">
        Having trouble loading? Try{" "}
        <Link href="/qr?tab=photos" className="text-gold-2 underline">
          refreshing
        </Link>{" "}
        or message us on WhatsApp for a direct link.
      </p>
    </div>
  );
}