"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, type PanInfo } from "framer-motion";
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
  const x = useMotionValue(0);
  const xSmooth = useSpring(x, { stiffness: 420, damping: 36 });
  const maxDrag = Math.max(0, itemCount * CARD_STEP - 320);

  const syncIndex = useCallback(() => {
    const el = (railRef && "current" in railRef ? railRef.current : null) as HTMLDivElement | null;
    if (!el || !onActiveIndexChange) return;
    const idx = Math.min(itemCount - 1, Math.max(0, Math.round(el.scrollLeft / CARD_STEP)));
    onActiveIndexChange(idx);
  }, [itemCount, onActiveIndexChange, railRef]);

  useEffect(() => {
    const el = (railRef && "current" in railRef ? railRef.current : null) as HTMLDivElement | null;
    if (!el) return;
    const onScroll = () => syncIndex();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [syncIndex, railRef]);

  return (
    <div className="relative mt-8 [perspective:1400px]">
      {!reduce ? (
        <p className="pointer-events-none absolute -top-6 right-0 z-10 text-[9px] font-semibold uppercase tracking-[.2em] text-[#947D34]/80">
          Swipe through the collection →
        </p>
      ) : null}
      <motion.div
        ref={railRef}
        style={reduce ? undefined : { x: xSmooth }}
        drag={reduce ? false : "x"}
        dragConstraints={{ left: -maxDrag, right: 0 }}
        dragElastic={0.12}
        whileTap={reduce ? undefined : { cursor: "grabbing" }}
        className={`flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 scrollbar-none ${reduce ? "" : "cursor-grab"} ${className}`}
        aria-label="Experience carousel"
        onDragEnd={(_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
          const el = (railRef && "current" in railRef ? railRef.current : null) as HTMLDivElement | null;
          if (!el) return;
          el.scrollBy({ left: -info.velocity.x * 0.35, behavior: "smooth" });
          window.setTimeout(syncIndex, 280);
        }}
      >
        {children}
      </motion.div>
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
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#829182]">{totalLabel}</span>
      <div className="flex items-center gap-2" role="tablist" aria-label="Station carousel position">
        {Array.from({ length: dots }, (_, i) => {
          const on = i === activeIndex % dots;
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
                      scale: 1.15,
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
  const wrapRef = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (reduce || flipped) return;
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -10, ry: px * 12 });
  };

  return (
    <motion.button
      ref={wrapRef}
      type="button"
      onClick={onFlip}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={STATION_FILTER_SPRING}
      className={`block w-full text-left [transform-style:preserve-3d] ${className}`}
      style={{ perspective: 1400 }}
    >
      <motion.div
        animate={reduce ? undefined : { rotateX: flipped ? 0 : tilt.rx, rotateY: flipped ? 0 : tilt.ry }}
        transition={STATION_FILTER_SPRING}
        className="relative min-h-[430px] [transform-style:preserve-3d]"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={STATION_FILTER_SPRING}
          className="relative min-h-[430px] [transform-style:preserve-3d]"
        >
          <motion.div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: "translateZ(2px)" }}>
            {front}
          </motion.div>
          <motion.div
            className="absolute inset-0 [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg) translateZ(2px)" }}
          >
            {back}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.button>
  );
}