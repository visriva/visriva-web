/** Shared Framer-style spring physics for Visriva motion UI. */
export const VISRIVA_SPRING = { type: "spring" as const, stiffness: 380, damping: 28 };

/** BouncyNavPill — Ys1t4g elastic glide */
export const BOUNCY_PILL_SPRING = { type: "spring" as const, stiffness: 460, damping: 24, mass: 0.8 };

/** Dynamic Island / mobile drawer expansion */
export const ISLAND_SPRING = { type: "spring" as const, stiffness: 400, damping: 30 };

export const NAVBAR_GLASS_IDLE =
  "backdrop-blur-2xl backdrop-saturate-150 bg-[#07261C]/80 border border-[#C9A227]/35 shadow-[0_10px_35px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.22)]";

export const NAVBAR_GLASS_SCROLLED =
  "backdrop-blur-2xl backdrop-saturate-150 bg-[#041812]/88 border border-[#C9A227]/45 shadow-[0_12px_40px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.18)]";

export const liquidGlassShell =
  "backdrop-blur-2xl backdrop-saturate-150 border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)]";

export const liquidGlassShellScrolled =
  "backdrop-blur-2xl backdrop-saturate-150 bg-[#041812]/80 border-[#C9A227]/40 shadow-[0_12px_40px_rgba(0,0,0,0.35)]";