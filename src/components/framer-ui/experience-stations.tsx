"use client";

import { motion, useReducedMotion } from "framer-motion";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { STATION_FILTER_SPRING } from "@/components/framer-ui/motion";

const CARD_STEP = 410;

export const stationListVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
} as const;

export const stationCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: STATION_FILTER_SPRING,
  },
} as const;

/** Native horizontal scroll + snap (no transform drag — avoids scroll jank). */
export const ExperienceStationRail = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    itemCount: number;
    onActiveIndexChange?: (index: number) => void;
    className?: string;
  }
>(function ExperienceStationRail({ children, itemCount, onActiveIndexChange, className = "" }, railRef) {
  const reduce = useReducedMotion();
  const internalRef = useRef<HTMLDivElement | null>(null);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      internalRef.current = node;
      if (typeof railRef === "function") railRef(node);
      else if (railRef) railRef.current = node;
    },
    [railRef],
  );

  const syncIndex = useCallback(() => {
    const el = internalRef.current;
    if (!el || !onActiveIndexChange) return;
    const idx = Math.min(itemCount - 1, Math.max(0, Math.round(el.scrollLeft / CARD_STEP)));
    onActiveIndexChange(idx);
  }, [itemCount, onActiveIndexChange]);

  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;
    const onScroll = () => syncIndex();
    el.addEventListener("scroll", onScroll, { passive: true });
    syncIndex();
    return () => el.removeEventListener("scroll", onScroll);
  }, [syncIndex, itemCount]);

  return (
    <div className="relative mt-8 [perspective:1400px]">
      {!reduce ? (
        <p className="pointer-events-none absolute -top-6 right-0 z-10 text-[9px] font-semibold uppercase tracking-[.2em] text-[#947D34]/80">
          Swipe through the collection →
        </p>
      ) : null}
      <div
        ref={setRef}
        className={`flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 scrollbar-none overscroll-x-contain touch-pan-x ${className}`}
        aria-label="Experience carousel"
      >
        {children}
      </div>
    </div>
  );
});

export function StationGoldPagination({
  count,
  activeIndex,
  onSelect,
  totalLabel,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  totalLabel: string;
}) {
  const dots = Math.min(count, 14);
  const activeDot = Math.min(Math.max(0, activeIndex), Math.max(0, dots - 1));

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#829182]">{totalLabel}</span>
      <div className="flex items-center gap-2" role="tablist" aria-label="Station carousel position">
        {Array.from({ length: dots }, (_, i) => {
          const on = i === activeDot;
          return (
            <motion.button
              key={i}
              type="button"
              role="tab"
              aria-selected={on}
              aria-label={`Station slide ${i + 1}`}
              onClick={() => onSelect(i)}
              animate={
                on
                  ? {
                      scale: 1.12,
                      boxShadow: "0 0 0 2px rgba(229,193,88,0.35), 0 0 14px rgba(201,162,39,0.65)",
                    }
                  : { scale: 1, boxShadow: "0 0 0 0px transparent" }
              }
              transition={STATION_FILTER_SPRING}
              className={`h-2.5 rounded-full transition-colors ${on ? "w-7 bg-gradient-to-r from-[#C9A227] to-[#E5C158]" : "w-2.5 border border-[#C9A227]/35 bg-[#F8F7EF]/80"}`}
            />
          );
        })}
      </div>
    </div>
  );
}

export function LiquidGlassStationFlipCard({
  flipped,
  onFlip,
  front,
  back,
  className = "",
}: {
  flipped: boolean;
  onFlip: () => void;
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (reduce || flipped) return;
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -8, ry: px * 10 });
  };

  return (
    <div
      ref={wrapRef}
      data-studio-skip
      className={`w-full [perspective:1400px] ${className}`}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
    >
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onFlip();
        }}
        whileTap={reduce ? undefined : { scale: 0.99 }}
        transition={STATION_FILTER_SPRING}
        className="block w-full text-left [transform-style:preserve-3d]"
        aria-pressed={flipped}
      >
        <motion.div
          animate={reduce ? undefined : { rotateX: flipped ? 0 : tilt.rx, rotateY: flipped ? 0 : tilt.ry }}
          transition={STATION_FILTER_SPRING}
          className="relative min-h-[430px] w-full [transform-style:preserve-3d]"
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={STATION_FILTER_SPRING}
            className="relative min-h-[430px] w-full [transform-style:preserve-3d]"
          >
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:translateZ(2px)]">{front}</div>
            <div
              className="absolute inset-0 [backface-visibility:hidden]"
              style={{ transform: "rotateY(180deg) translateZ(2px)" }}
            >
              {back}
            </div>
          </motion.div>
        </motion.div>
      </motion.button>
    </div>
  );
}