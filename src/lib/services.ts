export type ServiceCategory = "photo-booths" | "ai-merchandise" | "games";

export type Service = {
  id: string;
  name: string;
  category: ServiceCategory;
  priceLabel: string;
  fromPrice: number | null;
  unitPrice?: number;
  unitLabel?: string;
  summary: string;
  includes: string[];
  footprint: string;
  guestMoment: string;
  image: string;
};

export const services: Service[] = [
  {
    id: "starter-ipad",
    name: "Starter Instant iPad",
    category: "photo-booths",
    priceLabel: "Starting ₹15,000",
    fromPrice: 15000,
    summary:
      "A contained instant booth for a shorter gathering. Guests shoot on iPad and leave with a print.",
    includes: ["3 hours", "150 prints", "Attended station"],
    footprint: "8 × 8 ft",
    guestMoment: "Step in, take the frame, walk out with a print.",
    image: "/images/party.jpg",
  },
  {
    id: "unlimited-ipad",
    name: "Unlimited Instant iPad",
    category: "photo-booths",
    priceLabel: "₹25,000",
    fromPrice: 25000,
    summary:
      "The booth stays open. Guests print without counting down a quota.",
    includes: ["4 hours", "Unlimited prints", "Attended station"],
    footprint: "8 × 8 ft",
    guestMoment: "No quota. The queue keeps moving and the prints keep coming.",
    image: "/images/reception.jpg",
  },
  {
    id: "unlimited-dslr",
    name: "Unlimited Instant DSLR",
    category: "photo-booths",
    priceLabel: "₹30,000",
    fromPrice: 30000,
    summary:
      "The same open-ended print run, shot on a DSLR for a sharper frame.",
    includes: ["4 hours", "Unlimited prints", "DSLR capture"],
    footprint: "8 × 8 ft",
    guestMoment: "A proper photograph, printed before they rejoin the room.",
    image: "/images/toast.jpg",
  },
  {
    id: "roaming-booth",
    name: "Roaming Booth",
    category: "photo-booths",
    priceLabel: "₹25,000 – ₹30,000",
    fromPrice: 25000,
    summary:
      "The station comes to the guest. Right for a large room, or a programme that keeps people moving.",
    includes: ["Attended roaming capture", "Prints in the room"],
    footprint: "Moves through the floor",
    guestMoment: "They do not find the booth. The booth finds them.",
    image: "/images/crowd.jpg",
  },
  {
    id: "mobile-capture",
    name: "Mobile Phone Capture",
    category: "photo-booths",
    priceLabel: "₹15,000 – ₹18,000",
    fromPrice: 15000,
    summary:
      "A guided phone capture with a lighter footprint and the same instant souvenir.",
    includes: ["Phone capture flow", "Attended station"],
    footprint: "8 × 8 ft",
    guestMoment: "A phone, a prompt, a print. Nothing else to learn.",
    image: "/images/lights.jpg",
  },
  {
    id: "ai-station",
    name: "AI Experience Station",
    category: "ai-merchandise",
    priceLabel: "₹25,000",
    fromPrice: 25000,
    summary:
      "A hosted AI portrait station. The prompts are written for your brand, not pulled from a generic pack.",
    includes: ["Custom prompts", "Hosted station"],
    footprint: "8 × 8 ft",
    guestMoment: "A portrait they did not know they were going to take home.",
    image: "/images/workshop.jpg",
  },
  {
    id: "tote-100",
    name: "Canvas Tote Stamp · 100 bags",
    category: "ai-merchandise",
    priceLabel: "₹25,000",
    fromPrice: 25000,
    summary:
      "Guests stamp a canvas tote and leave with the brand on something they will actually carry.",
    includes: ["100 canvas bags", "Live stamp station"],
    footprint: "8 × 8 ft",
    guestMoment: "Ink, canvas, and a bag that outlasts the evening.",
    image: "/images/summit.jpg",
  },
  {
    id: "tote-200",
    name: "Canvas Tote Stamp · 200 bags",
    category: "ai-merchandise",
    priceLabel: "₹40,000",
    fromPrice: 40000,
    summary:
      "The same live stamp station, stocked for a larger guest list.",
    includes: ["200 canvas bags", "Live stamp station"],
    footprint: "8 × 8 ft",
    guestMoment: "A longer queue, the same unhurried stamp.",
    image: "/images/reception.jpg",
  },
  {
    id: "fridge-magnets",
    name: "Fridge Magnets & Keychains",
    category: "ai-merchandise",
    priceLabel: "₹25,000",
    fromPrice: 25000,
    summary: "A small object, made on the spot, in a run of 300.",
    includes: ["300 pieces", "Live station"],
    footprint: "8 × 8 ft",
    guestMoment: "Something small enough for a pocket and specific enough to keep.",
    image: "/images/toast.jpg",
  },
  {
    id: "pvc-cards",
    name: "Corporate PVC ID Cards",
    category: "ai-merchandise",
    priceLabel: "₹120 per card",
    fromPrice: null,
    unitPrice: 120,
    unitLabel: "cards",
    summary: "Staff and guest cards, printed as PVC and priced per card.",
    includes: ["₹120 per card", "On-site or pre-printed to the brief"],
    footprint: "Table station",
    guestMoment: "A card that looks like it belongs to the company, not the venue.",
    image: "/images/workshop.jpg",
  },
  {
    id: "dtf-tees",
    name: "Live T-shirt Printing (DTF)",
    category: "ai-merchandise",
    priceLabel: "Custom quote",
    fromPrice: null,
    summary:
      "Shirts printed live on a DTF line. The run, the sizes, and the artwork decide the figure.",
    includes: ["Live DTF printing", "Quoted to the run"],
    footprint: "8 × 8 ft",
    guestMoment: "They watch the shirt come off the press and wear it the same hour.",
    image: "/images/concert.jpg",
  },
  {
    id: "vr-station",
    name: "VR Station",
    category: "games",
    priceLabel: "₹20,000",
    fromPrice: 20000,
    summary:
      "A hosted headset station. One queue, one attendant, a clean reset between guests.",
    includes: ["Hosted VR station", "Attendant"],
    footprint: "8 × 8 ft",
    guestMoment: "A minute out of the room, then back in it, grinning.",
    image: "/images/stage.jpg",
  },
  {
    id: "catch-baton",
    name: "Catch the Baton",
    category: "games",
    priceLabel: "₹6,000 – ₹8,000",
    fromPrice: 6000,
    summary: "A quick competitive station. Easy to explain. Easy to crowd around.",
    includes: ["Hosted game", "One station"],
    footprint: "6 × 4 ft",
    guestMoment: "Two people, one baton, a small audience that forms on its own.",
    image: "/images/crowd2.jpg",
  },
  {
    id: "buzz-wire",
    name: "Buzz the Wire",
    category: "games",
    priceLabel: "₹6,000 – ₹8,000",
    fromPrice: 6000,
    summary: "Steady hands and a loud buzzer. A classic that still stops a corridor.",
    includes: ["Hosted game", "One station"],
    footprint: "6 × 4 ft",
    guestMoment: "Someone misses. The buzzer goes. Nobody walks past.",
    image: "/images/lights.jpg",
  },
];

export const categoryMeta: Record<
  ServiceCategory,
  { label: string; href: string; kicker: string }
> = {
  "photo-booths": {
    label: "Photo Booths",
    href: "/photo-booths",
    kicker: "Capture",
  },
  "ai-merchandise": {
    label: "AI & Merchandise",
    href: "/ai-merchandise",
    kicker: "Make",
  },
  games: { label: "Games & VR", href: "/games-vr", kicker: "Play" },
};

export function getService(id: string) {
  return services.find((service) => service.id === id);
}

export function servicesIn(category: ServiceCategory) {
  return services.filter((service) => service.category === category);
}

export type EstimateLine = {
  id: string;
  name: string;
  quantity: number;
  priceLabel: string;
  amount: number | null;
  unitLabel?: string;
};

export function estimate(selected: Record<string, number>) {
  const lines: EstimateLine[] = [];
  let total = 0;
  let hasCustom = false;

  for (const [id, quantity] of Object.entries(selected)) {
    const service = getService(id);
    if (!service || quantity <= 0) continue;

    if (service.unitPrice) {
      const amount = service.unitPrice * quantity;
      total += amount;
      lines.push({
        id,
        name: service.name,
        quantity,
        priceLabel: service.priceLabel,
        amount,
        unitLabel: service.unitLabel,
      });
      continue;
    }

    if (service.fromPrice == null) {
      hasCustom = true;
      lines.push({
        id,
        name: service.name,
        quantity,
        priceLabel: service.priceLabel,
        amount: null,
      });
      continue;
    }

    const amount = service.fromPrice * quantity;
    total += amount;
    lines.push({
      id,
      name: service.name,
      quantity,
      priceLabel: service.priceLabel,
      amount,
    });
  }

  return { lines, total, hasCustom };
}

export function countsFromIds(ids: string[]) {
  const map: Record<string, number> = {};
  for (const id of ids) {
    const service = getService(id);
    if (!service) continue;
    if (service.unitPrice) {
      map[id] = map[id] && map[id] > 1 ? map[id] : 100;
      continue;
    }
    map[id] = (map[id] ?? 0) + 1;
  }
  return map;
}
