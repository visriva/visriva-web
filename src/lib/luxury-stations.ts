import { phoneDisplay, instagramUrl, businessName } from "@/lib/site";
import { whatsAppNumber } from "@/lib/whatsapp";

export type LuxuryCategory = "photo-booths" | "ai-merch" | "games-vr" | "all";

export type LuxuryTier = { label: string; price: number };

export type LuxuryStation = {
  id: string;
  category: Exclude<LuxuryCategory, "all">;
  categoryLabel: string;
  name: string;
  priceDisplay: string;
  basePrice: number;
  duration: string;
  throughput: string;
  hardwareBadge: string;
  footprint: string;
  power: string;
  popular?: boolean;
  description: string;
  deliverables: string[];
  hasTierToggle?: boolean;
  tiers?: LuxuryTier[];
  hasCardSlider?: boolean;
  pricePerUnit?: number;
};

export const SITE_THEME = {
  brand: {
    name: "visriva",
    sublabel: "LIVE STATION",
    tagline: "Bengaluru’s Premier Live Engagement Studio",
    instagram: instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@"),
    domain: "visriva.com",
    whatsappNumber: whatsAppNumber(),
    phone: phoneDisplay,
    city: "Bengaluru, Karnataka",
    legalName: businessName,
  },
  stats: [
    { id: "events", label: "Corporate Events Executed", value: "240+" },
    { id: "brands", label: "Enterprise Brands Served", value: "85+" },
    { id: "fleet", label: "Owned Stations in Fleet", value: "18 Rigs" },
    { id: "speed", label: "Lab-Grade Print Speed", value: "12 Sec" },
  ],
  commercialTerms: {
    advancePercent: 50,
    gstPercent: 18,
    transitMin: 2000,
    transitMax: 4000,
    setupHours: 6,
    footprint: "8ft × 8ft",
    powerSpec: "220–240V AC (15A) within 15ft",
  },
} as const;

export const INITIAL_STATIONS: LuxuryStation[] = [
  {
    id: "starter-ipad",
    category: "photo-booths",
    categoryLabel: "Studio Photo Booth",
    name: "Starter Instant iPad Booth",
    priceDisplay: "Starting ₹15,000",
    basePrice: 15000,
    duration: "3 Hrs · 150 Prints",
    throughput: "50 Prints / Hr",
    hardwareBadge: "iPad Pro + DNP RX1/DS620A",
    footprint: "8ft × 8ft",
    power: "220V AC (15A)",
    popular: false,
    description:
      "Ultra-crisp iPad Pro capture with studio key light, custom brand overlay, instant QR downloads, and 150 lab-grade prints.",
    deliverables: [
      '150 Physical 4×6" Lab Prints',
      "Custom Corporate Frame Overlay",
      "Instant QR Digital Gallery",
      "Dedicated On-Site Attendant",
    ],
  },
  {
    id: "unlimited-ipad",
    category: "photo-booths",
    categoryLabel: "Studio Photo Booth",
    name: "Unlimited Instant iPad Booth",
    priceDisplay: "₹25,000",
    basePrice: 25000,
    duration: "4 Hrs · Unlimited Prints",
    throughput: "120+ Prints / Hr",
    hardwareBadge: "iPad Pro Rig + High-Speed Print Server",
    footprint: "8ft × 8ft",
    power: "220V AC (15A)",
    popular: true,
    description:
      "Built for high-footfall town halls. Non-stop printing for 4 hours, custom branding, boomerangs, and instant QR sharing.",
    deliverables: [
      "Unlimited High-Speed Prints (4 Hrs)",
      "GIFs, Boomerangs & Digital Sharing",
      "Custom Branded UI & Print Strip",
      "Local Offline-Resilient Network",
    ],
  },
  {
    id: "unlimited-dslr",
    category: "photo-booths",
    categoryLabel: "Studio Photo Booth",
    name: "Unlimited Instant DSLR Booth",
    priceDisplay: "₹30,000",
    basePrice: 30000,
    duration: "4 Hrs · Unlimited Prints",
    throughput: "150+ Prints / Hr",
    hardwareBadge: "Canon DSLR + Studio Strobe + DNP DS620A",
    footprint: "8ft × 8ft",
    power: "220V AC (15A)",
    popular: true,
    description:
      "Flagship red-carpet rig. DSLR optics, studio strobe, commercial dye-sub print server, and on-site operator.",
    deliverables: [
      "Canon DSLR Prime Optics",
      "Professional Beauty-Dish Strobe",
      "Unlimited 12-Sec Metallic/Matte Prints",
      "Luxury Props & Red Carpet Stanchions",
    ],
  },
  {
    id: "roaming-booth",
    category: "photo-booths",
    categoryLabel: "Studio Photo Booth",
    name: "Roaming Paparazzi Booth",
    priceDisplay: "₹25,000 – ₹30,000",
    basePrice: 25000,
    duration: "3–4 Hrs · Wireless Routing",
    throughput: "Untethered Crowd Capture",
    hardwareBadge: "Wireless Capture + Base Print Hub",
    footprint: "4ft × 4ft Hub",
    power: "220V AC at Print Base",
    popular: false,
    description:
      "The booth comes to VIP tables and the dancefloor. Wireless capture routes to our high-speed print station.",
    deliverables: [
      "Roaming Photographer & Ring-Lit Rig",
      "Zero-Latency Local Wi-Fi Print Routing",
      "Instant QR Download on Screen",
      "Live Print Pickup Counter",
    ],
  },
  {
    id: "mobile-qr-hub",
    category: "photo-booths",
    categoryLabel: "Studio Photo Booth",
    name: "Mobile Phone Capture (QR Guest Hub)",
    priceDisplay: "₹15,000 – ₹18,000",
    basePrice: 15000,
    duration: "Full Event · Live Moderation",
    throughput: "500+ Concurrent Guests",
    hardwareBadge: "visriva.com/qr Guest Upload Hub",
    footprint: "6ft × 6ft",
    power: "220V AC (15A)",
    popular: false,
    description:
      "Guests scan a table QR, snap photos, and watch them queue for branded frames and spot prints.",
    deliverables: [
      "Zero-App QR Guest Upload Hub",
      "Automated Brand Frame Wrapping",
      "Spot Physical Printing at Base Station",
      "Attended queue management",
    ],
  },
  {
    id: "ai-station",
    category: "ai-merch",
    categoryLabel: "AI & Live Merch",
    name: "AI Experience Station",
    priceDisplay: "Starting ₹25,000",
    basePrice: 25000,
    duration: "4 Hrs · Custom Brand Prompts",
    throughput: "90+ AI Portraits / Hr",
    hardwareBadge: "Neural GPU Pipeline + DNP Printer",
    footprint: "8ft × 8ft",
    power: "220V AC (15A)",
    popular: true,
    description:
      "Guests take a portrait and transform into bespoke brand themes — printed in high definition within seconds.",
    deliverables: [
      "3–5 Custom Engineered Brand Prompts",
      "Instant High-Res Physical Prints",
      "QR Code Digital Avatar Delivery",
      "Dedicated AI Experience Host",
    ],
  },
  {
    id: "tote-bag-station",
    category: "ai-merch",
    categoryLabel: "AI & Live Merch",
    name: "Canvas Tote Bag Stamp Station",
    priceDisplay: "₹25,000 (100) / ₹40,000 (200)",
    basePrice: 25000,
    hasTierToggle: true,
    tiers: [
      { label: "100 Canvas Bags", price: 25000 },
      { label: "200 Canvas Bags", price: 40000 },
    ],
    duration: "Live Craft Bar",
    throughput: "100–200 Custom Bags",
    hardwareBadge: "Artisanal Block & Stamp Press Bar",
    footprint: "8ft × 8ft",
    power: "220V AC (15A)",
    popular: true,
    description:
      "Hands-on block and stamp printing. Guests craft their own heavy-duty canvas tote at the venue.",
    deliverables: [
      "Heavy-Duty Eco Canvas Tote Bags",
      "Bespoke Brand & Motif Stamps",
      "Fade-Proof Fabric Inks & Heat Curing",
      "2 Guided Craft Specialists",
    ],
  },
  {
    id: "magnets-keychains",
    category: "ai-merch",
    categoryLabel: "AI & Live Merch",
    name: "Live Fridge Magnets & Keychains",
    priceDisplay: "₹25,000",
    basePrice: 25000,
    duration: "300 Custom Pieces",
    throughput: "90-Sec Turnaround / Guest",
    hardwareBadge: "Live Die-Cut & Acrylic Press Rig",
    footprint: "8ft × 8ft",
    power: "220V AC (15A)",
    popular: false,
    description:
      "Live portraits turned into magnets or keychains — pressed, sealed, and handed over in under 90 seconds.",
    deliverables: [
      "300 Custom Photo Magnets or Keychains",
      "Live Portrait Capture Included",
      "Precision Die-Cutting & Sealing",
      "Branded Takeaway Sleeves with QR",
    ],
  },
  {
    id: "pvc-id-cards",
    category: "ai-merch",
    categoryLabel: "AI & Live Merch",
    name: "Corporate PVC ID Cards",
    priceDisplay: "₹120 / card",
    basePrice: 12000,
    hasCardSlider: true,
    pricePerUnit: 120,
    duration: "Spot Thermal Printing",
    throughput: "Instant Zero-Queue Output",
    hardwareBadge: "Dual-Sided Thermal PVC Card Press",
    footprint: "6ft × 6ft",
    power: "220V AC (15A)",
    popular: false,
    description:
      "Thermal PVC badges, VIP passes, or custom awards printed live on the spot.",
    deliverables: [
      "CR80 Thick Glossy PVC Cards",
      "Live Guest Photo + Name Integration",
      "Lanyard Slot Punch & Holder Ready",
      "Ideal for Offsites & VIP Access",
    ],
  },
  {
    id: "live-dtf-tshirt",
    category: "ai-merch",
    categoryLabel: "AI & Live Merch",
    name: "Live T-Shirt Printing (DTF)",
    priceDisplay: "Custom Quote (~₹30k+)",
    basePrice: 30000,
    duration: "On-Demand Apparel Bar",
    throughput: "45-Sec Heat Press Cycle",
    hardwareBadge: "Commercial pneumatic Heat Press Rig",
    footprint: "8ft × 8ft",
    power: "Dedicated 16A Power Line",
    popular: false,
    description:
      "Full-color DTF heat press. Guests pick graphics and watch their shirt pressed live in 45 seconds.",
    deliverables: [
      "Commercial High-Pressure Heat Press",
      "Pre-Cured Custom Brand Graphic Transfers",
      "45-Second Live Customization",
      "Premium Cotton Tees (Optional Add-on)",
    ],
  },
  {
    id: "vr-station",
    category: "games-vr",
    categoryLabel: "VR & Reflex Games",
    name: "VR Experience Arena",
    priceDisplay: "₹20,000",
    basePrice: 20000,
    duration: "Commercial Headset Rig + Attendant",
    throughput: "Continuous Crowd Rotation",
    hardwareBadge: "Commercial VR System + Spectator TV",
    footprint: "8ft × 8ft",
    power: "220V AC (15A)",
    popular: true,
    description:
      "Hosted VR with safety boundary, sanitized headsets, spectator display, and dedicated Game Master.",
    deliverables: [
      "Commercial Wireless VR Headset Rig",
      '43"+ External Live Spectator Display',
      "Curated High-Adrenaline Corporate Games",
      "Hygiene Masks & Dedicated Game Master",
    ],
  },
  {
    id: "reflex-games",
    category: "games-vr",
    categoryLabel: "VR & Reflex Games",
    name: "Catch the Baton / Buzz the Wire",
    priceDisplay: "₹6,000 – ₹8,000 each",
    basePrice: 7000,
    duration: "High-Energy Reflex Games",
    throughput: "Non-Stop Crowd Magnet",
    hardwareBadge: "Electronic Drop-Rig & Giant Wire Maze",
    footprint: "6ft × 6ft",
    power: "220V AC (15A)",
    popular: false,
    description:
      "Reflex challenges that spark leaderboard competition at offsites, expos, and family days.",
    deliverables: [
      "Adjustable Speed Electronic Baton Drop",
      "Audible & LED Buzz-Wire Challenge",
      "Plug-and-Play Breakout Zone Setup",
      "Ideal for Booth Footfall & Team Offsites",
    ],
  },
];

const LUXURY_TO_SERVICE: Record<string, string> = {
  "mobile-qr-hub": "mobile-capture",
  "tote-bag-station": "tote-100",
  "magnets-keychains": "fridge-magnets",
  "pvc-id-cards": "pvc-cards",
  "live-dtf-tshirt": "dtf-tees",
  "reflex-games": "catch-baton",
};

export function getLuxuryStationPrice(
  station: LuxuryStation,
  toteBagTierIndex: number,
  pvcCardCount: number,
) {
  if (station.id === "tote-bag-station" && station.tiers) {
    return station.tiers[toteBagTierIndex]?.price ?? station.basePrice;
  }
  if (station.id === "pvc-id-cards" && station.pricePerUnit) {
    return pvcCardCount * station.pricePerUnit;
  }
  return station.basePrice;
}

/** Map luxury UI ids to site quote / Supabase service ids */
export function buildQuoteSelection(
  selectedIds: string[],
  toteBagTierIndex: number,
  pvcCardCount: number,
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const id of selectedIds) {
    if (id === "tote-bag-station") {
      const serviceId = toteBagTierIndex === 0 ? "tote-100" : "tote-200";
      map[serviceId] = 1;
      continue;
    }
    if (id === "pvc-id-cards") {
      map["pvc-cards"] = pvcCardCount;
      continue;
    }
    const serviceId = LUXURY_TO_SERVICE[id] ?? id;
    map[serviceId] = (map[serviceId] ?? 0) + 1;
  }
  return map;
}
