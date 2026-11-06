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
    <div className="px-5 py-6 sm:px-8">
      <p className="font-display text-5xl italic text-cream sm:text-6xl">
        {count}
        {suffix}
      </p>
      <p className="mt-2 font-royal text-[0.62rem] uppercase tracking-[0.26em] text-gold">
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
      className="relative z-20 mx-auto -mt-16 grid max-w-[1500px] border border-gold/30 bg-deep/80 backdrop-blur-xl sm:grid-cols-3"
    >
      {stats.map((stat) => (
        <Stat key={stat.label} {...stat} active={active} />
      ))}
    </section>
  );
}
