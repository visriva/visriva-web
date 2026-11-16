import type { ReactNode } from "react";

/** Clipped dual-layer label — one visible line at rest; second slides in on group-hover. */
export function LiquidButtonLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex h-6 items-center overflow-hidden leading-none">
      <span className="liquid-swipe-letter relative block h-6 overflow-hidden leading-none">
        <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
          {children}
        </span>
        <span className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
          {children}
        </span>
      </span>
    </span>
  );
}