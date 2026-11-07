"use client";

import { useEffect, useRef, useState } from "react";
import { GhostLink, GoldLink } from "@/components/ui";

export function Hero({ film = false }: { film?: boolean }) {
  const [glow, setGlow] = useState({ x: 50, y: 40 });
  const [sound, setSound] = useState(false);
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      void audio.current?.close();
      audio.current = null;
    };
  }, []);

  function toggleSound() {
    if (sound) {
      void audio.current?.close();
      audio.current = null;
      setSound(false);
      return;
    }

    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0.035;
    master.connect(context.destination);

    [174.61, 220, 261.63].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      const gain = context.createGain();
      gain.gain.value = 0.22 - index * 0.05;
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start();
    });

    const length = context.sampleRate * 2;
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    const noise = context.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 380;
    const noiseGain = context.createGain();
    noiseGain.gain.value = 0.18;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();

    audio.current = context;
    setSound(true);
  }

  return (
    <section
      data-mood="beli"
      className="mood-canvas mood-beli relative min-h-[100svh] overflow-hidden"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setGlow({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <div className="absolute inset-0 bg-deep">
        {film ? (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-85 contrast-[1.05] saturate-90"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero.jpg"
          >
            <source src="/films/hero.mp4" type="video/mp4" />
          </video>
        ) : null}
        <div
          className={`absolute inset-0 bg-cover bg-center brightness-[0.7] contrast-[1.08] saturate-[0.88] ${film ? "opacity-0" : ""}`}
          style={{ backgroundImage: "url(/images/hero.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-emerald/75 to-ink/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(5,8,7,0.2),rgba(5,8,7,0.85))]" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(520px circle at ${glow.x}% ${glow.y}%, rgba(232,204,106,0.2), transparent 62%)`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col justify-end px-5 pb-24 pt-36 sm:px-10 lg:px-16 lg:pb-32">
        <div className="flex items-start justify-between gap-6">
          <p className="type-eyebrow">Bengaluru · Corporate · Weddings</p>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={sound}
            className="glass-royal border-gold/30 px-4 py-2.5 font-royal text-[0.58rem] uppercase tracking-[0.26em] text-champagne transition hover:border-gold/60"
          >
            {sound ? "Room tone on" : "Room tone"}
          </button>
        </div>

        <div className="mt-8 h-px w-16 bg-gradient-to-r from-gold to-transparent" aria-hidden />

        <h1 className="mt-8 max-w-[16ch] leading-[1.02] text-cream">
          <span className="type-display block text-[clamp(2.75rem,6.2vw,6.25rem)] tracking-[0.04em]">
            Prints in the room.
          </span>
          <span className="type-display-italic display-swash mt-2 block text-[clamp(3rem,7.4vw,7.25rem)] leading-[0.95]">
            <span className="gold-shimmer">Objects they keep.</span>
          </span>
        </h1>
        <p className="mt-8 max-w-lg text-[1.05rem] font-light leading-[1.75] tracking-[0.01em] text-champagne/92 sm:text-lg">
          Studio capture and live stations for company floors and celebrations — photo booths, AI
          and merchandise, games, and gifting. Owned inventory. One crew from load-in to the last
          print. You host the room.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <GoldLink href="/#rate-card">Live studio</GoldLink>
          <GoldLink href="/quote">Book now</GoldLink>
          <GoldLink href="/photo-booths#packages">View packages</GoldLink>
          <GhostLink href="/gallery">See the floor</GhostLink>
        </div>

        <div className="mt-16 hidden items-center gap-3 text-mist/70 lg:flex" aria-hidden>
          <span className="h-px w-12 bg-gold/40" />
          <span className="font-royal text-[0.58rem] uppercase tracking-[0.32em]">Scroll</span>
        </div>
      </div>
    </section>
  );
}
