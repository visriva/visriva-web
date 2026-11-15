/** Primary mobile drawer + desktop shortcuts (edit labels here; hero/CTA copy stays in Website CMS). */
export const mobileDrawerNav = [
  { href: "/", label: "Home" },
  { href: "/#experiences", label: "Services" },
  { href: "/qr", label: "Event Photos & QR" },
  { href: "/reviews", label: "Reviews" },
  { href: "/quote", label: "Contact" },
] as const;

export const desktopQuickNav = [
  { href: "/#experiences", label: "Live stations" },
  { href: "/qr", label: "Event photos / QR" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
] as const;