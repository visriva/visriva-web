export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://visriva.com"
).replace(/\/$/, "");

export const gstin = process.env.NEXT_PUBLIC_GSTIN || "";

export const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "";
export const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || "";

/**
 * Confirm these three figures before the site is announced.
 * They drive the animated counters on the homepage.
 */
export const stats = [
  { label: "Events executed", value: 120, suffix: "+" },
  { label: "Companies served", value: 40, suffix: "+" },
  { label: "Stations in inventory", value: 18, suffix: "" },
] as const;

export const policies = [
  {
    kicker: "To hold the date",
    title: "50% advance",
    body: "The advance is non-refundable. It confirms the crew and the inventory for your date.",
  },
  {
    kicker: "B2B invoices",
    title: "18% GST",
    body: "GST is added on business invoices. The figures on this site are starting prices, before tax.",
  },
  {
    kicker: "Inside Bengaluru",
    title: "₹2,000 – ₹4,000",
    body: "A transit charge covers the city run. The exact figure depends on the venue and the call time.",
  },
] as const;

export const requirements = [
  {
    title: "A dedicated power point per station",
    body: "One stable point within reach of each station. Tell us if the venue shares circuits with sound or catering.",
  },
  {
    title: "A flat table per station",
    body: "Level, steady, and clear before we arrive. We will not balance a printer on a cocktail perch.",
  },
  {
    title: "Shade or cover if you are outdoors",
    body: "Sun and rain both ruin prints, headsets, and presses. Outdoor sets need a roof.",
  },
  {
    title: "Vehicle access for load-in",
    body: "A service entrance, ramp, or lift that a loaded vehicle can actually use. Stairs alone are not a plan.",
  },
  {
    title: "Venue rules, in writing",
    body: "Floor protection, noise curfew, branding approvals, and the earliest we can enter. Send them with the brief.",
  },
] as const;

export const processSteps = [
  {
    n: "01",
    title: "One brief",
    body: "Tell us the room, the hours, and the number of guests. A partial brief is enough to begin.",
  },
  {
    n: "02",
    title: "One plan",
    body: "Stations, footprints, power, and a starting figure. You see the floor before you confirm it.",
  },
  {
    n: "03",
    title: "One crew",
    body: "We load in, run every station, and wrap. You stay with your guests.",
  },
] as const;

export type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string; note: string }[];
};

export const navigation: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/#experiences",
    label: "Experiences",
    children: [
      { href: "/photo-booths", label: "Photo Booths", note: "From ₹15,000" },
      { href: "/ai-merchandise", label: "AI & Merchandise", note: "From ₹25,000" },
      { href: "/games-vr", label: "Games & VR", note: "From ₹6,000" },
    ],
  },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/rate-card", label: "Rate Card" },
  { href: "/client-requirements", label: "Client Requirements" },
];

export const galleryItems = [
  {
    src: "/images/hero.jpg",
    alt: "A full corporate reception, the scale of room Visriva builds stations for",
    caption: "Reception scale",
    tag: "Gatherings",
    tall: true,
  },
  {
    src: "/images/party.jpg",
    alt: "Guests close together at an evening event",
    caption: "The print queue",
    tag: "Stations",
    tall: false,
  },
  {
    src: "/images/lights.jpg",
    alt: "Stage light over a crowded floor",
    caption: "Night floor",
    tag: "Night",
    tall: false,
  },
  {
    src: "/images/reception.jpg",
    alt: "Guests in conversation at a formal gathering",
    caption: "Between sessions",
    tag: "Gatherings",
    tall: false,
  },
  {
    src: "/images/stage.jpg",
    alt: "A lit stage at a corporate programme",
    caption: "Programme light",
    tag: "Night",
    tall: true,
  },
  {
    src: "/images/toast.jpg",
    alt: "A toast at a corporate dinner",
    caption: "The long table",
    tag: "Gatherings",
    tall: false,
  },
  {
    src: "/images/workshop.jpg",
    alt: "A working session around a table",
    caption: "Make station",
    tag: "Stations",
    tall: false,
  },
  {
    src: "/images/crowd.jpg",
    alt: "A dense crowd at a live event",
    caption: "Roaming hour",
    tag: "Night",
    tall: false,
  },
  {
    src: "/images/concert.jpg",
    alt: "An audience facing a lit stage",
    caption: "Headset reset",
    tag: "Stations",
    tall: true,
  },
  {
    src: "/images/summit.jpg",
    alt: "Delegates seated at a summit",
    caption: "Company offsite",
    tag: "Gatherings",
    tall: false,
  },
  {
    src: "/images/crowd2.jpg",
    alt: "People moving through a night event",
    caption: "Game corridor",
    tag: "Stations",
    tall: false,
  },
] as const;

export const galleryFilms = [
  {
    title: "Booth loop",
    poster: "/images/party.jpg",
    src: "/films/booth.mp4",
  },
  {
    title: "Merchandise loop",
    poster: "/images/workshop.jpg",
    src: "/films/merchandise.mp4",
  },
  {
    title: "Floor loop",
    poster: "/images/concert.jpg",
    src: "/films/floor.mp4",
  },
] as const;
