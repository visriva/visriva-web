/** Primary mobile drawer + desktop shortcuts (edit labels here; hero/CTA copy stays in Website CMS). */
export const mobileDrawerNav = [
  { href: "/", label: "Home" },
  { href: "/#experiences", label: "Experiential stations & services" },
  { href: "/qr", label: "Event photo vault & weekly giveaway" },
  { href: "/reviews", label: "Client reviews" },
  { href: "/client-requirements", label: "Venue planning guide" },
  { href: "/quote", label: "Contact & instant quote" },
] as const;

export const desktopQuickNav = [
  { href: "/#experiences", label: "Live stations" },
  { href: "/qr", label: "Event photos / QR" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
] as const;