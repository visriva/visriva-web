"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/site";

function useCount(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 1400);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

function Stat({
  label,
  value,
  suffix,
  active,
}: {
  label: string;
  value: number;
  suffix: string;
  active: boolean;
}) {
  const count = useCount(value, active);
  return (
    <div className="relative px-6 py-8 sm:px-10">
      <p className="type-display-italic text-5xl text-cream sm:text-6xl">
        {count}
        <span className="text-gold-2">{suffix}</span>
      </p>
      <p className="mt-3 font-royal text-[0.65rem] uppercase tracking-[0.3em] text-gold/90">
        {label}
      </p>
    </div>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActive(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Visriva in numbers"
      className="glass-royal relative z-20 mx-auto -mt-20 grid max-w-[1500px] overflow-hidden sm:grid-cols-3"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
      />
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={index > 0 ? "relative sm:border-l sm:border-gold/20" : undefined}
        >
          <Stat {...stat} active={active} />
        </div>
      ))}
    </section>
  );
}
