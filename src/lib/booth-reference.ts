/** Section copy and tiers — layout reference: snapstation.in (adapted for Visriva inventory). */

export const boothTiers = [
  {
    id: "starter-ipad",
    name: "Starter",
    price: "₹15,000",
    subtitle: "3 hours · 150 prints",
    highlight: false,
    perks: [
      "3 hours on the floor",
      "Selfies, GIFs, and bursts",
      "Custom digital frame",
      "QR and link sharing",
      "Station attendant",
      "150 instant prints",
    ],
  },
  {
    id: "unlimited-ipad",
    name: "Unlimited iPad",
    price: "₹25,000",
    subtitle: "4 hours · open print run",
    highlight: true,
    perks: [
      "4 hours on the floor",
      "Selfies, GIFs, and bursts",
      "Custom digital frame",
      "QR and link sharing",
      "Station attendant",
      "Unlimited instant prints",
    ],
  },
  {
    id: "unlimited-dslr",
    name: "Unlimited DSLR",
    price: "₹30,000",
    subtitle: "4 hours · sharper capture",
    highlight: false,
    perks: [
      "4 hours on the floor",
      "DSLR capture",
      "Custom digital frame",
      "QR and link sharing",
      "Station attendant",
      "Unlimited instant prints",
    ],
  },
  {
    id: "roaming-booth",
    name: "Roaming",
    price: "from ₹25,000",
    subtitle: "The booth comes to the guest",
    highlight: false,
    perks: [
      "Attended roaming capture",
      "Prints in the room",
      "Custom digital frame",
      "QR and link sharing",
      "Quoted to floor size",
      "Ideal for large halls",
    ],
  },
] as const;

export const bookingInclusions = [
  {
    icon: "🤳",
    title: "Selfies, GIFs, and bursts",
    body: "Still, looping GIF, or burst — whichever fits your crowd.",
  },
  {
    icon: "🖼️",
    title: "Custom digital frame",
    body: "Your date, logo, or theme on every print and share screen.",
  },
  {
    icon: "✨",
    title: "Welcome screen",
    body: "A branded attract screen the moment someone steps up.",
  },
  {
    icon: "🧑‍💼",
    title: "Station attendant",
    body: "We run the queue, the printer, and the guest flow.",
  },
  {
    icon: "📲",
    title: "QR and instant share",
    body: "Guests leave with a link or file — no app to install.",
  },
  {
    icon: "🖨️",
    title: "Instant dye-sub prints",
    body: "2×6 strips or 6×4 postcards, ready in seconds.",
  },
] as const;

export const printFormats = [
  {
    title: '2×6" strip',
    body: "Three or four frames on a keepsake strip. Easy to hand out as favours.",
  },
  {
    title: '6×4" postcard',
    body: "A single hero frame — sized to frame on a desk or mantle.",
  },
] as const;

export const stationSpecs = [
  { icon: "📷", label: "Capture", value: "iPad or DSLR" },
  { icon: "🖨️", label: "Printer", value: "Dye-sub instant" },
  { icon: "📐", label: "Footprint", value: "8 × 8 ft typical" },
  { icon: "📲", label: "Sharing", value: "QR + link" },
] as const;

export const rentPaths = [
  {
    title: "Rent the booth",
    body: "Book for a wedding, birthday, or corporate day. We deliver, set up, and stay with you.",
    href: "/photo-booths#packages",
    cta: "View packages",
  },
  {
    title: "Compose the full floor",
    body: "Add AI merch, games, and gifting on the same crew and the same brief.",
    href: "/quote",
    cta: "Build your quote",
  },
] as const;

export const occasions = [
  { emoji: "💍", label: "Wedding", href: "/quote?services=unlimited-dslr" },
  { emoji: "🏢", label: "Corporate", href: "/quote?services=unlimited-ipad" },
  { emoji: "🎂", label: "Birthday", href: "/quote?services=starter-ipad" },
  { emoji: "🎉", label: "Private party", href: "/quote" },
  { emoji: "🎓", label: "College fest", href: "/quote?services=roaming-booth" },
] as const;

export const whyVisriva = [
  {
    num: "01",
    title: "Owned inventory",
    body: "The booths and merch lines are ours — not a broker juggling third-party gear.",
  },
  {
    num: "02",
    title: "One crew, whole floor",
    body: "Booths, AI, games, and gifting under one call sheet and one load-in.",
  },
  {
    num: "03",
    title: "Bengaluru-first",
    body: "Based in the city. Transit, timing, and venue quirks are part of the brief.",
  },
  {
    num: "04",
    title: "Fully attended",
    body: "Every booking ships with operators who guide guests and protect the run.",
  },
] as const;
