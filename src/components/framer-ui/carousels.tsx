"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRightIcon } from "@/components/ArrowUpRightIcon";
import { VISRIVA_SPRING } from "@/components/framer-ui/motion";

export function DnaCarousel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-none">{children}</div>
  );
}

export function SwipeableCMSSlider({
  items,
}: {
  items: { id: string; title: string; copy: string; image: string; href?: string }[];
}) {
  return (
    <DnaCarousel>
      {items.map((item) => (
        <article key={item.id} className="w-[min(85vw,360px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#C9A227]/25 bg-[#0A3326]/60 backdrop-blur-xl">
          <div className="relative h-44">
            <Image src={item.image} alt="" fill className="object-cover" sizes="360px" />
          </div>
          <div className="p-5">
            <h3 className="font-display text-2xl text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#E6DEC8]">{item.copy}</p>
            {item.href ? (
              <Link href={item.href} className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#E5C158]">
                View
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
        </article>
      ))}
    </DnaCarousel>
  );
}

export function LuxuryCarousel({ images }: { images: { src: string; alt: string; caption?: string }[] }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const item = images[index] ?? images[0];
  if (!item) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#C9A227]/30 bg-[#041A13]">
      <motion.div key={item.src} initial={reduce ? undefined : { opacity: 0.6 }} animate={{ opacity: 1 }} transition={VISRIVA_SPRING} className="relative h-64 sm:h-80">
        <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="(min-width:768px) 800px, 100vw" />
      </motion.div>
      {item.caption ? <p className="px-4 py-3 text-sm text-[#E6DEC8]">{item.caption}</p> : null}
      <div className="flex justify-center gap-2 pb-4">
        {images.map((_, i) => (
          <button key={i} type="button" aria-label={`Slide ${i + 1}`} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}

export function LiquidGlassFlipCard({
  front,
  back,
  flipped,
  onFlip,
  className = "",
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped: boolean;
  onFlip: () => void;
  className?: string;
}) {
  return (
    <button type="button" onClick={onFlip} className={`experience-flip w-full text-left ${flipped ? "is-flipped" : ""} ${className}`}>
      <div className="experience-flip-inner min-h-[420px]">
        <div className="experience-face experience-front">{front}</div>
        <div className="experience-face experience-back">{back}</div>
      </div>
    </button>
  );
}

export function ExpandOnHoverList({
  items,
  activeId,
  onSelect,
}: {
  items: { id: string; label: string; description?: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const open = activeId === item.id;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={`expand-hover-row w-full rounded-2xl border px-4 py-3 text-left transition ${open ? "border-[#C9A227] bg-[#0A3326]/80" : "border-white/10 bg-white/[0.04] hover:border-[#C9A227]/40"}`}
            >
              <span className="text-sm font-semibold text-white">{item.label}</span>
              {item.description ? (
                <p className={`mt-2 text-xs leading-5 text-[#E6DEC8] transition-all ${open ? "opacity-100" : "opacity-0 max-h-0 overflow-hidden"}`}>{item.description}</p>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}