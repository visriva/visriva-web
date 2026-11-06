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
      className="relative min-h-[100svh] overflow-hidden"
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
            className="absolute inset-0 h-full w-full object-cover opacity-80 grayscale"
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
          className={`absolute inset-0 bg-cover bg-center grayscale contrast-125 brightness-75 ${film ? "opacity-0" : ""}`}
          style={{ backgroundImage: "url(/images/hero.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-emerald/70 to-ink/35" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(420px circle at ${glow.x}% ${glow.y}%, rgba(201,162,39,0.22), transparent 60%)`,
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-28 pt-32 sm:px-10 lg:px-16">
        <div className="flex items-start justify-between gap-6">
          <p className="font-royal text-[0.68rem] uppercase tracking-[0.34em] text-gold">
            Bengaluru · Corporate · Weddings
          </p>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={sound}
            className="border border-gold/40 px-3 py-2 font-royal text-[0.58rem] uppercase tracking-[0.22em] text-champagne transition hover:border-gold"
          >
            {sound ? "Room tone on" : "Room tone"}
          </button>
        </div>
        <h1 className="mt-6 max-w-5xl font-display text-[clamp(3.4rem,8.4vw,8.4rem)] italic leading-[0.86] text-cream">
          Prints in the room. Objects they keep.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-champagne/90 sm:text-lg">
          Studio capture and live stations for company floors and celebrations — photo booths, AI
          and merchandise, games, and gifting. Owned inventory. One crew from load-in to the last
          print. You host the room.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <GoldLink href="/quote">Request a quote</GoldLink>
          <GhostLink href="/#floor">Compose the floor</GhostLink>
        </div>
      </div>
    </section>
  );
}
