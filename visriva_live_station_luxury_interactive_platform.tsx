import React, { useState, useEffect, useMemo } from 'react';
import {
  Camera,
  Sparkles,
  Gamepad2,
  Zap,
  ShieldCheck,
  Clock,
  WifiOff,
  Check,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  Building2,
  Phone,
  ArrowRight,
  ChevronRight,
  Layers,
  Maximize2,
  Sun,
  Umbrella,
  Award,
  QrCode,
  Send,
  Copy,
  CheckCircle2,
  Sliders,
  Eye,
  Volume2,
  VolumeX,
  Users,
  Printer,
  Cpu,
  X,
  Info,
  Gift
} from 'lucide-react';

// ============================================================================
// CENTRAL THEME & DATA CONFIGURATION (Zero Hardcoding Architecture)
// ============================================================================
const SITE_THEME = {
  brand: {
    name: 'visriva',
    sublabel: 'LIVE STATION',
    tagline: 'Bengaluru’s Premier Live Engagement Studio',
    instagram: '@visrivalivestation',
    domain: 'visriva.com',
    whatsappNumber: '919880000000', // Configurable via Admin
    city: 'Bengaluru, Karnataka',
  },
  stats: [
    { id: 'events', label: 'Corporate Events Executed', value: '240+' },
    { id: 'brands', label: 'Enterprise Brands Served', value: '85+' },
    { id: 'fleet', label: 'Owned Stations in Fleet', value: '18 Rigs' },
    { id: 'speed', label: 'Lab-Grade Print Speed', value: '12 Sec' },
  ],
  commercialTerms: {
    advancePercent: 50,
    gstPercent: 18,
    transitMin: 2000,
    transitMax: 4000,
    setupHours: 6,
    footprint: '8ft × 8ft',
    powerSpec: '220–240V AC (15A) within 15ft',
  }
};

const INITIAL_STATIONS = [
  // STUDIO PHOTO BOOTHS (5)
  {
    id: 'starter-ipad',
    category: 'photo-booths',
    categoryLabel: 'Studio Photo Booth',
    name: 'Starter Instant iPad Booth',
    priceDisplay: 'Starting ₹15,000',
    basePrice: 15000,
    duration: '3 Hrs · 150 Prints',
    throughput: '50 Prints / Hr',
    hardwareBadge: 'iPad Pro + DNP RX1/DS620A',
    footprint: '8ft × 8ft',
    power: '220V AC (15A)',
    popular: false,
    description:
      'Ultra-crisp iPad Pro capture node with dedicated studio key lighting, custom brand overlay, instant QR digital downloads, and 150 lab-grade physical prints.',
    deliverables: ['150 Physical 4×6" Lab Prints', 'Custom Corporate Frame Overlay', 'Instant QR Digital Gallery', 'Dedicated On-Site Attendant'],
  },
  {
    id: 'unlimited-ipad',
    category: 'photo-booths',
    categoryLabel: 'Studio Photo Booth',
    name: 'Unlimited Instant iPad Booth',
    priceDisplay: '₹25,000',
    basePrice: 25000,
    duration: '4 Hrs · Unlimited Prints',
    throughput: '120+ Prints / Hr',
    hardwareBadge: 'iPad Pro Rig + High-Speed Print Server',
    footprint: '8ft × 8ft',
    power: '220V AC (15A)',
    popular: true,
    description:
      'Built for high-footfall town halls and mixers. Non-stop high-speed physical printing for 4 hours, custom corporate branding, boomerangs, and instant QR sharing.',
    deliverables: ['Unlimited High-Speed Prints (4 Hrs)', 'GIFs, Boomerangs & Digital Sharing', 'Custom Branded UI & Print Strip', 'Local Offline-Resilient Network'],
  },
  {
    id: 'unlimited-dslr',
    category: 'photo-booths',
    categoryLabel: 'Studio Photo Booth',
    name: 'Unlimited Instant DSLR Booth',
    priceDisplay: '₹30,000',
    basePrice: 30000,
    duration: '4 Hrs · Unlimited Prints',
    throughput: '150+ Prints / Hr',
    hardwareBadge: 'Canon DSLR + Studio Strobe + DNP DS620A',
    footprint: '8ft × 8ft',
    power: '220V AC (15A)',
    popular: true,
    description:
      'Our flagship red-carpet rig. Canon DSLR optics, professional studio strobe lighting, commercial high-speed dye-sublimation print server, and on-site operator.',
    deliverables: ['Canon DSLR Prime Optics', 'Professional Beauty-Dish Strobe', 'Unlimited 12-Sec Metallic/Matte Prints', 'Luxury Props & Red Carpet Stanchions'],
  },
  {
    id: 'roaming-booth',
    category: 'photo-booths',
    categoryLabel: 'Studio Photo Booth',
    name: 'Roaming Paparazzi Booth',
    priceDisplay: '₹25,000 – ₹30,000',
    basePrice: 25000,
    duration: '3–4 Hrs · Wireless Routing',
    throughput: 'Untethered Crowd Capture',
    hardwareBadge: 'Wireless Capture + Base Print Hub',
    footprint: '4ft × 4ft Hub',
    power: '220V AC at Print Base',
    popular: false,
    description:
      'We bring the booth to the VIP tables and dancefloor. Untethered crowd capture that routes wirelessly over our local network to our high-speed print station.',
    deliverables: ['Roaming Photographer & Ring-Lit Rig', 'Zero-Latency Local Wi-Fi Print Routing', 'Instant QR Download on Screen', 'Live Print Pickup Counter'],
  },
  {
    id: 'mobile-qr-hub',
    category: 'photo-booths',
    categoryLabel: 'Studio Photo Booth',
    name: 'Mobile Phone Capture (QR Guest Hub)',
    priceDisplay: '₹15,000 – ₹18,000',
    basePrice: 15000,
    duration: 'Full Event · Live AI Moderation',
    throughput: '500+ Concurrent Guests',
    hardwareBadge: 'visriva.com/qr Edge Auto-Moderation',
    footprint: '6ft × 6ft',
    power: '220V AC (15A)',
    popular: false,
    description:
      'Turn 500 guest smartphones into your event camera. Guests scan a table QR, snap photos, and watch them pass through auto-moderation to the print queue.',
    deliverables: ['Zero-App QR Guest Upload Hub', 'AI Content Safety Auto-Moderation', 'Automated Brand Frame Wrapping', 'Spot Physical Printing at Base Station'],
  },

  // AI & LIVE MERCHANDISE (5)
  {
    id: 'ai-station',
    category: 'ai-merch',
    categoryLabel: 'AI & Live Merch',
    name: 'AI Experience Station',
    priceDisplay: 'Starting ₹25,000',
    basePrice: 25000,
    duration: '4 Hrs · Custom Brand Prompts',
    throughput: '90+ AI Portraits / Hr',
    hardwareBadge: 'Neural GPU Pipeline + DNP Printer',
    footprint: '8ft × 8ft',
    power: '220V AC (15A)',
    popular: true,
    description:
      'Guests take a 3-second portrait and transform into bespoke brand themes, futuristic avatars, or royal portraits—printed in high definition within seconds.',
    deliverables: ['3–5 Custom Engineered Brand Prompts', 'Instant High-Res Physical Prints', 'QR Code Digital Avatar Delivery', 'Dedicated AI Experience Host'],
  },
  {
    id: 'tote-bag-station',
    category: 'ai-merch',
    categoryLabel: 'AI & Live Merch',
    name: 'Canvas Tote Bag Stamp Station',
    priceDisplay: '₹25,000 (100) / ₹40,000 (200)',
    basePrice: 25000,
    hasTierToggle: true,
    tiers: [
      { label: '100 Canvas Bags', price: 25000 },
      { label: '200 Canvas Bags', price: 40000 },
    ],
    duration: 'Live Craft Bar',
    throughput: '100–200 Custom Bags',
    hardwareBadge: 'Artisanal Block & Stamp Press Bar',
    footprint: '8ft × 8ft',
    power: '220V AC (15A)',
    popular: true,
    description:
      'Hands-on artisanal block and stamp printing. Guests select custom layouts and craft their own heavy-duty canvas tote bag live at the venue.',
    deliverables: ['Heavy-Duty Eco Canvas Tote Bags', 'Bespoke Carved Brand & Motif Stamps', 'Fade-Proof Fabric Inks & Heat Curing', '2 Guided Craft Specialists'],
  },
  {
    id: 'magnets-keychains',
    category: 'ai-merch',
    categoryLabel: 'AI & Live Merch',
    name: 'Live Fridge Magnets & Keychains',
    priceDisplay: '₹25,000',
    basePrice: 25000,
    duration: '300 Custom Pieces',
    throughput: '90-Sec Turnaround / Guest',
    hardwareBadge: 'Live Die-Cut & Acrylic Press Rig',
    footprint: '8ft × 8ft',
    power: '220V AC (15A)',
    popular: false,
    description:
      'High-speed conversion of live guest portraits into rigid acrylic keychains or glossy fridge magnets—pressed, sealed, and handed over in under 90 seconds.',
    deliverables: ['300 Custom Photo Magnets or Keychains', 'Live Portrait Capture Included', 'Precision Die-Cutting & Sealing', 'Branded Takeaway Sleeves with QR'],
  },
  {
    id: 'pvc-id-cards',
    category: 'ai-merch',
    categoryLabel: 'AI & Live Merch',
    name: 'Corporate PVC ID Cards',
    priceDisplay: '₹120 / card',
    basePrice: 12000,
    hasCardSlider: true,
    pricePerUnit: 120,
    duration: 'Spot Thermal Printing',
    throughput: 'Instant Zero-Queue Output',
    hardwareBadge: 'Dual-Sided Thermal PVC Card Press',
    footprint: '6ft × 6ft',
    power: '220V AC (15A)',
    popular: false,
    description:
      'High-definition thermal PVC badges, personalized VIP passes, or custom event awards printed live on the spot with zero queue.',
    deliverables: ['CR80 Thick Glossy PVC Cards', 'Live Guest Photo + Name Integration', 'Lanyard Slot Punch & Holder Ready', 'Ideal for Offsites & VIP Access'],
  },
  {
    id: 'live-dtf-tshirt',
    category: 'ai-merch',
    categoryLabel: 'AI & Live Merch',
    name: 'Live T-Shirt Printing (DTF)',
    priceDisplay: 'Custom Quote (~₹30k+)',
    basePrice: 30000,
    duration: 'On-Demand Apparel Bar',
    throughput: '45-Sec Heat Press Cycle',
    hardwareBadge: 'Commercial pneumatic Heat Press Rig',
    footprint: '8ft × 8ft',
    power: 'Dedicated 16A Power Line',
    popular: false,
    description:
      'Full-color Direct-to-Film heat press station. Guests pick custom graphics and watch their wearable merch get pressed live in 45 seconds.',
    deliverables: ['Commercial High-Pressure Heat Press', 'Pre-Cured Custom Brand Graphic Transfers', '45-Second Live Customization', 'Premium Cotton Tees (Optional Add-on)'],
  },

  // VR & REFLEX GAMES (2)
  {
    id: 'vr-station',
    category: 'games-vr',
    categoryLabel: 'VR & Reflex Games',
    name: 'VR Experience Arena',
    priceDisplay: '₹20,000',
    basePrice: 20000,
    duration: 'Commercial Headset Rig + Attendant',
    throughput: 'Continuous Crowd Rotation',
    hardwareBadge: 'Commercial VR System + Spectator TV',
    footprint: '8ft × 8ft',
    power: '220V AC (15A)',
    popular: true,
    description:
      'Immersive virtual reality setup with safety boundary grid, sanitized commercial headsets, spectator display feed, and dedicated Game Master.',
    deliverables: ['Commercial Wireless VR Headset Rig', '43"+ External Live Spectator Display', 'Curated High-Adrenaline Corporate Games', 'Hygiene Masks & Dedicated Game Master'],
  },
  {
    id: 'reflex-games',
    category: 'games-vr',
    categoryLabel: 'VR & Reflex Games',
    name: 'Catch the Baton / Buzz the Wire',
    priceDisplay: '₹6,000 – ₹8,000 each',
    basePrice: 7000,
    duration: 'High-Energy Reflex Games',
    throughput: 'Non-Stop Crowd Magnet',
    hardwareBadge: 'Electronic Drop-Rig & Giant Wire Maze',
    footprint: '6ft × 6ft',
    power: '220V AC (15A)',
    popular: false,
    description:
      'Crowd-pulling reflex challenges that spark instant leaderboard competition at offsites, expos, and family days.',
    deliverables: ['Adjustable Speed Electronic Baton Drop', 'Audible & LED Buzz-Wire Challenge', 'Plug-and-Play Breakout Zone Setup', 'Ideal for Booth Footfall & Team Offsites'],
  },
];

// ============================================================================
// CUSTOM SVG GOLDEN LOTUS LOGO COMPONENT
// ============================================================================
const VisrivaLogo = ({ size = 'md' }) => {
  const dims = size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  return (
    <div className="flex items-center gap-3.5 group cursor-pointer select-none">
      <div
        className={`${dims} relative rounded-xl bg-gradient-to-br from-[#0B3D2E] to-[#040D0A] border border-[#C9A227]/50 flex items-center justify-center shadow-[0_0_25px_rgba(201,162,39,0.2)] group-hover:border-[#E5C158] transition-all duration-300`}
      >
        {/* Subtle inner gold ring */}
        <div className="absolute inset-1 rounded-lg border border-[#C9A227]/20 pointer-events-none" />
        {/* Golden Lotus / Leaf SVG Emblem */}
        <svg
          viewBox="0 0 64 64"
          className="w-7 h-7 text-[#C9A227] group-hover:scale-105 transition-transform duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F4EBD0" />
              <stop offset="45%" stopColor="#C9A227" />
              <stop offset="100%" stopColor="#8F6B10" />
            </linearGradient>
          </defs>
          {/* Center Lotus Petal */}
          <path
            d="M32 8C26 18 23 28 32 44C41 28 38 18 32 8Z"
            fill="url(#goldGrad)"
          />
          {/* Left Inner Petal */}
          <path
            d="M29 43C18 36 14 25 18 15C23 21 26 30 29 43Z"
            fill="url(#goldGrad)"
            opacity="0.88"
          />
          {/* Right Inner Petal */}
          <path
            d="M35 43C46 36 50 25 46 15C41 21 38 30 35 43Z"
            fill="url(#goldGrad)"
            opacity="0.88"
          />
          {/* Left Outer Leaf */}
          <path
            d="M26 45C13 43 7 34 8 24C15 28 21 35 26 45Z"
            fill="url(#goldGrad)"
            opacity="0.65"
          />
          {/* Right Outer Leaf */}
          <path
            d="M38 45C51 43 57 34 56 24C49 28 43 35 38 45Z"
            fill="url(#goldGrad)"
            opacity="0.65"
          />
          {/* Base Royal Cradle */}
          <path
            d="M16 49C24 53 40 53 48 49"
            stroke="url(#goldGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="32" cy="55" r="2" fill="#E5C158" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
          className="text-2xl sm:text-3xl font-bold tracking-[0.14em] uppercase bg-gradient-to-r from-[#F4EBD0] via-[#E5C158] to-[#C9A227] bg-clip-text text-transparent leading-none"
        >
          visriva
        </span>
        <span
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
          className="text-[9px] tracking-[0.32em] text-[#8FA89B] uppercase mt-1"
        >
          LIVE STATION · BLR
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Pre-select 2 signature stations so the visitor immediately experiences the Instant Block flow
  const [selectedIds, setSelectedIds] = useState(['unlimited-dslr', 'tote-bag-station']);
  const [activeCategory, setActiveCategory] = useState('all');
  const [toteBagTierIndex, setToteBagTierIndex] = useState(0); // 0 = 100 bags (25k), 1 = 200 bags (40k)
  const [pvcCardCount, setPvcCardCount] = useState(100); // Default 100 cards * 120 = 12,000

  // Floor Plan & Environment State
  const [isOutdoorVenue, setIsOutdoorVenue] = useState(false);
  const [activeHeroPreview, setActiveHeroPreview] = useState(0);
  const [liveGuestTicker, setLiveGuestTicker] = useState(14820);
  const [ambientSound, setAmbientSound] = useState(false);

  // Instant Block Form State
  const [eventDate, setEventDate] = useState('2026-12-18');
  const [venueName, setVenueName] = useState('JW Marriott / Manyata Tech Park');
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [headcount, setHeadcount] = useState('250');
  const [requirementsChecked, setRequirementsChecked] = useState(true);

  // Modals & Interactive Overlays
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showArModal, setShowArModal] = useState(false);
  const [showGiveawayModal, setShowGiveawayModal] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [giveawaySubmitted, setGiveawaySubmitted] = useState(false);
  const [drawerExpanded, setDrawerExpanded] = useState(false);

  // Increment live guest counter subtly for social proof
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveGuestTicker((prev) => prev + Math.floor(Math.random() * 2));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Rotate Hero showcase preview automatically
  const heroShowcases = [
    {
      title: 'Unlimited Instant DSLR Red-Carpet Rig',
      client: 'Corporate 10th Anniversary · Bengaluru',
      metric: '412 Lab Prints in 3.5 Hours',
      hardware: 'Canon DSLR + DNP DS620A Print Server',
      badge: '12-SEC PRINT SPEED',
      accent: '#C9A227',
    },
    {
      title: 'Live Artisanal Tote Bag Block Printing',
      client: 'Global Tech Summit · Whitefield',
      metric: '200 Custom Canvas Bags Crafted Live',
      hardware: 'Dual Craft Bar + Heat Curing Rig',
      badge: 'ZERO LEFTOVER SWAG',
      accent: '#E5C158',
    },
    {
      title: 'Commercial Dual VR Experience Arena',
      client: 'Annual Family Day & Offsite · Devanahalli',
      metric: '98% Crowd Participation Rate',
      hardware: 'Dual Wireless VR Headsets + 50" Spectator Feed',
      badge: 'GAME MASTER INCLUDED',
      accent: '#10B981',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroPreview((prev) => (prev + 1) % heroShowcases.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Calculate dynamic price for a station
  const getStationPrice = (station) => {
    if (station.id === 'tote-bag-station') {
      return station.tiers[toteBagTierIndex].price;
    }
    if (station.id === 'pvc-id-cards') {
      return pvcCardCount * station.pricePerUnit;
    }
    return station.basePrice;
  };

  // Toggle station selection
  const toggleStation = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Selected stations full objects
  const selectedStations = useMemo(() => {
    return INITIAL_STATIONS.filter((s) => selectedIds.includes(s.id));
  }, [selectedIds, toteBagTierIndex, pvcCardCount]);

  // Financial & Technical Calculations
  const financials = useMemo(() => {
    const subtotal = selectedStations.reduce(
      (sum, s) => sum + getStationPrice(s),
      0
    );
    const transitEstimate = selectedStations.length > 0 ? 3000 : 0; // Midpoint of ₹2,000–4,000 BLR transit
    const taxableAmount = subtotal + transitEstimate;
    const gstAmount = Math.round(taxableAmount * 0.18);
    const grandTotal = taxableAmount + gstAmount;
    const advanceDeposit = Math.round(grandTotal * 0.5);
    const totalSqFt = selectedStations.length * 64; // 8ft x 8ft = 64 sq ft per station
    const totalPlugPoints = selectedStations.length;

    return {
      subtotal,
      transitEstimate,
      gstAmount,
      grandTotal,
      advanceDeposit,
      totalSqFt,
      totalPlugPoints,
    };
  }, [selectedStations, toteBagTierIndex, pvcCardCount]);

  // Filtered stations for the Bento Rate Card
  const filteredStations = useMemo(() => {
    if (activeCategory === 'all') return INITIAL_STATIONS;
    return INITIAL_STATIONS.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  // Format INR currency
  const formatINR = (num) => {
    return '₹' + Number(num).toLocaleString('en-IN');
  };

  // Build formatted WhatsApp payload
  const whatsappMessage = useMemo(() => {
    const stationLines = selectedStations
      .map((s, i) => {
        let extra = '';
        if (s.id === 'tote-bag-station') {
          extra = ` (${s.tiers[toteBagTierIndex].label})`;
        } else if (s.id === 'pvc-id-cards') {
          extra = ` (${pvcCardCount} Cards @ ₹120/card)`;
        }
        return `${i + 1}. ${s.name}${extra} — ${formatINR(getStationPrice(s))}`;
      })
      .join('\n');

    return (
      `*VISRIVA LIVE STATION — DATE BLOCK REQUEST*\n` +
      `----------------------------------------\n` +
      `*Selected Stations (${selectedStations.length}):*\n` +
      `${stationLines || 'None selected yet'}\n\n` +
      `*Commercial Estimate:*\n` +
      `• Stations Subtotal: ${formatINR(financials.subtotal)}\n` +
      `• Bengaluru Fleet Transit: ₹2,000 – ₹4,000\n` +
      `• 18% B2B GST Applicable\n` +
      `• *50% Date-Lock Advance:* ~${formatINR(financials.advanceDeposit)}\n\n` +
      `*Event Logistics:*\n` +
      `• Date: ${eventDate || 'TBD'}\n` +
      `• Venue/Area: ${venueName || 'Bengaluru'}\n` +
      `• Setting: ${isOutdoorVenue ? 'Outdoor (Canopy Required)' : 'Indoor Ballroom/Hall'}\n` +
      `• Expected Crowd: ~${headcount || '200'} Guests\n` +
      `• Space & Power: ${financials.totalSqFt} sq.ft (${selectedStations.length} × 8x8ft) | ${financials.totalPlugPoints} × 220V 15A Points\n` +
      `• 6-Hr Advance Load-In Acknowledged: ${requirementsChecked ? 'YES' : 'Pending'}\n\n` +
      `*Client Contact:*\n` +
      `• Name: ${clientName || 'Corporate Planner'}\n` +
      `• Company: ${companyName || 'Direct Inquiry'}\n` +
      `• Phone: ${clientPhone || 'Provided on WhatsApp'}`
    );
  }, [
    selectedStations,
    financials,
    eventDate,
    venueName,
    isOutdoorVenue,
    headcount,
    requirementsChecked,
    clientName,
    companyName,
    clientPhone,
    toteBagTierIndex,
    pvcCardCount,
  ]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen bg-[#040D0A] text-[#FAF8F5] selection:bg-[#C9A227] selection:text-[#040D0A] pb-36 relative overflow-x-hidden"
    >
      {/* Google Fonts Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(201, 162, 39, 0); }
        }
        .gold-pulse {
          animation: pulseGold 2.5s infinite;
        }
        .luxury-grid-bg {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(201, 162, 39, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(201, 162, 39, 0.05) 1px, transparent 1px);
        }
      `}</style>

      {/* =====================================================================
          TOP LIVE TICKER BAR (Synced with Admin Daily Updates Concept)
      ===================================================================== */}
      <div className="bg-[#072A1F] border-b border-[#C9A227]/20 py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#E5C158] font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              LIVE FLEET STATUS
            </span>
            <span className="text-[#F4EBD0]/90 hidden sm:inline">
              100% In-House Hardware Fleet · DNP DS620A/RX1 Print Servers & Dual VR Rigs Ready Across Bengaluru
            </span>
          </div>
          <div className="flex items-center gap-4 ml-auto" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="text-[#8FA89B]">
              GUESTS SERVED: <strong className="text-[#E5C158]">{liveGuestTicker.toLocaleString()}</strong>
            </span>
            <button
              onClick={() => setShowGiveawayModal(true)}
              className="text-[#C9A227] hover:text-[#F4EBD0] underline underline-offset-4 flex items-center gap-1 transition-colors"
            >
              <Gift className="w-3.5 h-3.5" /> Guest QR Giveaway (/giveaway)
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          STICKY LUXURY HEADER
      ===================================================================== */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#040D0A]/85 border-b border-[#C9A227]/20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <VisrivaLogo />
          </div>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#FAF8F5]/80">
            <button
              onClick={() => {
                setActiveCategory('photo-booths');
                scrollToSection('rate-card');
              }}
              className="hover:text-[#E5C158] transition-colors"
            >
              Photo Booths
            </button>
            <button
              onClick={() => {
                setActiveCategory('ai-merch');
                scrollToSection('rate-card');
              }}
              className="hover:text-[#E5C158] transition-colors"
            >
              AI & Live Merch
            </button>
            <button
              onClick={() => {
                setActiveCategory('games-vr');
                scrollToSection('rate-card');
              }}
              className="hover:text-[#E5C158] transition-colors"
            >
              VR & Games
            </button>
            <button
              onClick={() => scrollToSection('floor-simulator')}
              className="hover:text-[#E5C158] transition-colors flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5 text-[#C9A227]" /> Floor Simulator
            </button>
            <button
              onClick={() => scrollToSection('venue-specs')}
              className="hover:text-[#E5C158] transition-colors"
            >
              Venue Specs
            </button>
            <button
              onClick={() => setShowGiveawayModal(true)}
              className="text-[#F4EBD0] hover:text-[#E5C158] transition-colors flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5 text-[#C9A227]" /> Giveaway
            </button>
          </nav>

          {/* Right Status + Primary Gold CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B3D2E]/80 border border-[#C9A227]/30 text-xs text-[#F4EBD0]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Booking Now: Corporate Season</span>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] via-[#E5C158] to-[#C9A227] text-[#040D0A] font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(201,162,39,0.35)] hover:shadow-[0_0_35px_rgba(229,193,88,0.6)] hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center gap-2"
            >
              <span>Lock Your Event Date</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          HERO SECTION (3-Second High-Conviction Hook)
      ===================================================================== */}
      <section className="relative pt-10 pb-16 lg:py-20 border-b border-[#C9A227]/20 overflow-hidden luxury-grid-bg">
        {/* Ambient Emerald & Gold Glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0B3D2E] rounded-full blur-[140px] opacity-70 pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#C9A227]/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: High-Impact Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B3D2E]/90 border border-[#C9A227]/40 text-[#F4EBD0] text-xs tracking-[0.18em] uppercase font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" />
                BENGALURU’S PREMIER LIVE ENGAGEMENT STUDIO
              </div>

              <h1
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-4xl sm:text-6xl lg:text-[66px] font-bold leading-[1.04] tracking-tight text-[#FAF8F5]"
              >
                Crowds Around Every Corner.{' '}
                <span className="italic font-semibold bg-gradient-to-r from-[#F4EBD0] via-[#E5C158] to-[#C9A227] bg-clip-text text-transparent">
                  Zero Vendor Chaos.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#FAF8F5]/80 max-w-2xl leading-relaxed font-normal">
                We deploy owned, studio-grade Photo Booths, AI Transformation Rigs, Live Merch Presses, and VR Arenas for Bengaluru’s biggest corporate events.{' '}
                <span className="text-[#F4EBD0] font-semibold">
                  Transparent starting rates. End-to-end execution.
                </span>
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollToSection('rate-card')}
                  className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A227] via-[#E5C158] to-[#C9A227] text-[#040D0A] font-bold text-sm sm:text-base tracking-wide shadow-[0_0_30px_rgba(201,162,39,0.4)] hover:shadow-[0_0_45px_rgba(229,193,88,0.7)] hover:scale-[1.02] transition-all flex items-center gap-2.5 gold-pulse"
                >
                  <span>Build Your Package & Lock Date</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => scrollToSection('floor-simulator')}
                  className="px-6 py-4 rounded-xl bg-[#0B3D2E]/60 hover:bg-[#0B3D2E] text-[#F4EBD0] border border-[#C9A227]/40 font-semibold text-sm sm:text-base transition-all flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-[#E5C158]" />
                  <span>Interactive Floor Simulator</span>
                </button>

                <button
                  onClick={() => setShowArModal(true)}
                  className="px-4 py-4 rounded-xl bg-[#040D0A]/80 hover:border-[#E5C158] text-[#8FA89B] hover:text-[#F4EBD0] border border-[#C9A227]/25 text-xs sm:text-sm transition-all flex items-center gap-2"
                  title="Preview 8x8ft station footprint at your venue"
                >
                  <Maximize2 className="w-4 h-4 text-[#C9A227]" />
                  <span>8×8ft AR Venue Check</span>
                </button>
              </div>

              {/* Technical Proof Strip */}
              <div
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs"
              >
                {[
                  { icon: ShieldCheck, text: '100% Owned Fleet' },
                  { icon: Printer, text: '12-Sec Lab Prints' },
                  { icon: Clock, text: '6-Hr Advance Setup' },
                  { icon: WifiOff, text: 'Private Offline Net' },
                ].map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#072A1F]/70 border border-[#C9A227]/20 text-[#F4EBD0]"
                    >
                      <IconComp className="w-4 h-4 text-[#C9A227] shrink-0" />
                      <span className="truncate">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Interactive Live Rig & Hardware Telemetry Frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-b from-[#0B3D2E]/90 to-[#040D0A] border border-[#C9A227]/40 p-5 sm:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.75)]">
                {/* Top Frame Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#C9A227]/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                    <span
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="text-xs uppercase tracking-wider text-[#F4EBD0]"
                    >
                      VISRIVA PRODUCTION RIG // TELEMETRY
                    </span>
                  </div>
                  <button
                    onClick={() => setAmbientSound(!ambientSound)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#040D0A]/70 border border-[#C9A227]/30 text-[11px] text-[#E5C158] hover:border-[#E5C158]"
                  >
                    {ambientSound ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                        <span>Event Audio: ON</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-[#8FA89B]" />
                        <span className="text-[#8FA89B]">Audio Muted</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Visual Stage Simulation */}
                <div className="relative rounded-xl bg-[#040D0A] border border-[#C9A227]/30 p-5 overflow-hidden min-h-[250px] flex flex-col justify-between">
                  {/* Decorative studio light beams */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-44 bg-[#C9A227]/20 blur-2xl rounded-full pointer-events-none" />

                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <span
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="px-2.5 py-1 rounded bg-[#C9A227] text-[#040D0A] font-bold text-[11px]"
                    >
                      {heroShowcases[activeHeroPreview].badge}
                    </span>
                    <span
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="text-[11px] text-[#8FA89B] bg-[#072A1F] px-2.5 py-1 rounded border border-[#C9A227]/20"
                    >
                      8ft × 8ft · 220V AC
                    </span>
                  </div>

                  {/* Center Animated Hardware Graphic */}
                  <div className="my-6 relative z-10">
                    <div className="text-xs uppercase tracking-widest text-[#E5C158] mb-1 font-semibold">
                      {heroShowcases[activeHeroPreview].client}
                    </div>
                    <h3
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      className="text-2xl sm:text-3xl font-bold text-[#FAF8F5]"
                    >
                      {heroShowcases[activeHeroPreview].title}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#F4EBD0]/90">
                      <span className="px-2.5 py-1 rounded bg-[#0B3D2E] border border-[#C9A227]/30 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#E5C158]" />
                        {heroShowcases[activeHeroPreview].hardware}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-[#072A1F] border border-[#10B981]/30 text-[#10B981] font-medium">
                        ✓ {heroShowcases[activeHeroPreview].metric}
                      </span>
                    </div>
                  </div>

                  {/* Hardware Node Status Strip */}
                  <div
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="relative z-10 grid grid-cols-3 gap-2 pt-3 border-t border-[#C9A227]/20 text-[10px]"
                  >
                    <div className="bg-[#072A1F]/80 p-2 rounded border border-[#C9A227]/15">
                      <div className="text-[#8FA89B]">CAPTURE NODE</div>
                      <div className="text-[#FAF8F5] font-semibold mt-0.5">visriva/webbooth</div>
                    </div>
                    <div className="bg-[#072A1F]/80 p-2 rounded border border-[#C9A227]/15">
                      <div className="text-[#8FA89B]">PRINT SERVER</div>
                      <div className="text-[#10B981] font-semibold mt-0.5">USB 0ms READY</div>
                    </div>
                    <div className="bg-[#072A1F]/80 p-2 rounded border border-[#C9A227]/15">
                      <div className="text-[#8FA89B]">GUEST QR HUB</div>
                      <div className="text-[#E5C158] font-semibold mt-0.5">AI MODERATED</div>
                    </div>
                  </div>
                </div>

                {/* Showcase Selector Tabs */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {['DSLR Booth', 'Tote Stamp Bar', 'Dual VR Arena'].map((label, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveHeroPreview(i)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                        activeHeroPreview === i
                          ? 'bg-[#C9A227]/20 border-[#C9A227] text-[#F4EBD0]'
                          : 'bg-[#040D0A]/60 border-[#C9A227]/15 text-[#8FA89B] hover:text-[#FAF8F5]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Stats Bar */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SITE_THEME.stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-xl bg-[#072A1F]/60 border border-[#C9A227]/25 p-5 flex flex-col justify-between hover:border-[#C9A227]/60 transition-all"
              >
                <span
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#F4EBD0] to-[#C9A227] bg-clip-text text-transparent"
                >
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-[#8FA89B] mt-1 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          INTERACTIVE 12-STATION RATE CARD (Click to Add & Block Immediately)
      ===================================================================== */}
      <section id="rate-card" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              className="text-xs uppercase tracking-[0.2em] text-[#C9A227] mb-2"
            >
              TRANSPARENT STARTING RATES · NO CALL REQUIRED TO SEE PRICING
            </div>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-3xl sm:text-5xl font-bold text-[#FAF8F5]"
            >
              Select Your Stations. Lock Your Package.
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Stations (12)', icon: Sparkles },
              { id: 'photo-booths', label: 'Studio Photo Booths (5)', icon: Camera },
              { id: 'ai-merch', label: 'AI & Live Merch (5)', icon: Award },
              { id: 'games-vr', label: 'VR & Reflex Games (2)', icon: Gamepad2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#C9A227] text-[#040D0A] border-[#E5C158] shadow-[0_0_20px_rgba(201,162,39,0.3)]'
                      : 'bg-[#072A1F]/70 text-[#F4EBD0] border-[#C9A227]/25 hover:border-[#C9A227]/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 12-Station Luxury Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => {
            const isSelected = selectedIds.includes(station.id);
            const effectivePrice = getStationPrice(station);

            return (
              <div
                key={station.id}
                className={`group relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 border ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#0B3D2E] to-[#072A1F] border-[#E5C158] shadow-[0_0_35px_rgba(201,162,39,0.22)]'
                    : 'bg-[#072A1F]/45 hover:bg-[#072A1F]/80 border-[#C9A227]/25 hover:border-[#C9A227]/60'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#040D0A]/70 text-[#F4EBD0] border border-[#C9A227]/25">
                      {station.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {station.popular && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A227]/20 text-[#E5C158] border border-[#C9A227]/40">
                          MOST BOOKED
                        </span>
                      )}
                      <span
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        className="text-[11px] text-[#8FA89B] bg-[#040D0A]/60 px-2 py-0.5 rounded"
                      >
                        {station.footprint}
                      </span>
                    </div>
                  </div>

                  {/* Station Name & Price */}
                  <h3
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    className="text-2xl font-bold text-[#FAF8F5] group-hover:text-[#F4EBD0] transition-colors"
                  >
                    {station.name}
                  </h3>

                  <div className="mt-2 flex items-baseline justify-between gap-2 pb-4 border-b border-[#C9A227]/15">
                    <div>
                      <span
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        className="text-xl sm:text-2xl font-bold text-[#E5C158]"
                      >
                        {station.id === 'tote-bag-station'
                          ? `${formatINR(effectivePrice)} (${station.tiers[toteBagTierIndex].label})`
                          : station.id === 'pvc-id-cards'
                          ? `${formatINR(effectivePrice)} (${pvcCardCount} cards)`
                          : station.priceDisplay}
                      </span>
                    </div>
                    <span
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="text-xs text-[#F4EBD0]/80"
                    >
                      {station.duration}
                    </span>
                  </div>

                  {/* Interactive Tier Toggle for Tote Bags */}
                  {station.hasTierToggle && (
                    <div className="my-3 p-2 rounded-xl bg-[#040D0A]/70 border border-[#C9A227]/25 flex items-center justify-between gap-2">
                      {station.tiers.map((tier, idx) => (
                        <button
                          key={tier.label}
                          onClick={() => setToteBagTierIndex(idx)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                            toteBagTierIndex === idx
                              ? 'bg-[#C9A227] text-[#040D0A]'
                              : 'text-[#8FA89B] hover:text-[#FAF8F5]'
                          }`}
                        >
                          {tier.label} · {formatINR(tier.price)}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Interactive Card Quantity Slider for PVC ID Cards */}
                  {station.hasCardSlider && (
                    <div className="my-3 p-3 rounded-xl bg-[#040D0A]/70 border border-[#C9A227]/25">
                      <div className="flex justify-between text-xs mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <span className="text-[#8FA89B]">Spot Card Quantity:</span>
                        <span className="text-[#E5C158] font-bold">{pvcCardCount} Cards (@ ₹120)</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="25"
                        value={pvcCardCount}
                        onChange={(e) => setPvcCardCount(Number(e.target.value))}
                        className="w-full accent-[#C9A227] cursor-pointer h-1.5 bg-[#0B3D2E] rounded-lg"
                      />
                    </div>
                  )}

                  {/* Pitch Copy */}
                  <p className="mt-3 text-sm text-[#FAF8F5]/80 leading-relaxed">
                    {station.description}
                  </p>

                  {/* Deliverables List */}
                  <ul className="mt-4 space-y-1.5 text-xs text-[#F4EBD0]/90">
                    {station.deliverables.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Hardware Badge & Instant Select Button */}
                <div className="mt-6 pt-4 border-t border-[#C9A227]/20 space-y-3">
                  <div
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="flex items-center justify-between text-[11px] text-[#8FA89B]"
                  >
                    <span>RIG: {station.hardwareBadge}</span>
                    <span>{station.power}</span>
                  </div>

                  <button
                    onClick={() => toggleStation(station.id)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#C9A227] via-[#E5C158] to-[#C9A227] text-[#040D0A] shadow-[0_0_20px_rgba(201,162,39,0.4)]'
                        : 'bg-[#040D0A] hover:bg-[#0B3D2E] text-[#F4EBD0] border border-[#C9A227]/40 hover:border-[#E5C158]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Selected in Event Package ({formatINR(effectivePrice)})</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add Station to Event</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          INTERACTIVE "BUILD YOUR EVENT" FLOOR PLAN SIMULATOR
      ===================================================================== */}
      <section
        id="floor-simulator"
        className="py-16 lg:py-24 bg-[#072A1F]/40 border-y border-[#C9A227]/25 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                className="text-xs uppercase tracking-[0.2em] text-[#E5C158] mb-2 flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                INTERACTIVE VENUE SPACE & POWER PLANNER
              </div>
              <h2
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-3xl sm:text-5xl font-bold text-[#FAF8F5]"
              >
                Build Your Event Floor Plan Live
              </h2>
              <p className="text-sm sm:text-base text-[#8FA89B] mt-2 max-w-2xl">
                Every Visriva station requires an <strong className="text-[#F4EBD0]">8ft × 8ft dry, level footprint</strong> and a dedicated <strong className="text-[#F4EBD0]">220–240V AC power point within 15ft</strong>. Toggle stations below to visualize your venue layout.
              </p>
            </div>

            {/* Indoor vs Outdoor Venue Switch */}
            <div className="flex items-center gap-3 bg-[#040D0A] p-2 rounded-xl border border-[#C9A227]/30 self-start">
              <button
                onClick={() => setIsOutdoorVenue(false)}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  !isOutdoorVenue
                    ? 'bg-[#C9A227] text-[#040D0A]'
                    : 'text-[#8FA89B] hover:text-[#FAF8F5]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Indoor Ballroom
              </button>
              <button
                onClick={() => setIsOutdoorVenue(true)}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  isOutdoorVenue
                    ? 'bg-[#C9A227] text-[#040D0A]'
                    : 'text-[#8FA89B] hover:text-[#FAF8F5]'
                }`}
              >
                <Umbrella className="w-4 h-4" />
                Outdoor Lawn / Terrace
              </button>
            </div>
          </div>

          {/* Outdoor Warning Banner */}
          {isOutdoorVenue && (
            <div className="mb-6 p-4 rounded-xl bg-[#C9A227]/15 border border-[#E5C158] flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Umbrella className="w-5 h-5 text-[#E5C158] shrink-0" />
                <span className="text-xs sm:text-sm text-[#F4EBD0]">
                  <strong>Outdoor Installation Rule Activated:</strong> Client must provide a protective waterproof overhead canopy for each 8ft × 8ft station to shield cameras, DNP printers, and VR optics from direct sun/rain.
                </span>
              </div>
              <span
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                className="text-xs px-2.5 py-1 rounded bg-[#040D0A] text-[#E5C158] border border-[#C9A227]/40"
              >
                CANOPY REQUIRED
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Quick-Toggle Palette */}
            <div className="lg:col-span-4 bg-[#040D0A] border border-[#C9A227]/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#C9A227]/20 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F4EBD0]">
                  Tap to Place / Remove on Grid
                </span>
                <span
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className="text-xs text-[#E5C158]"
                >
                  {selectedStations.length} Active
                </span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {INITIAL_STATIONS.map((s) => {
                  const active = selectedIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleStation(s.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                        active
                          ? 'bg-[#0B3D2E] border-[#C9A227] text-[#FAF8F5]'
                          : 'bg-[#072A1F]/30 border-[#C9A227]/15 text-[#8FA89B] hover:border-[#C9A227]/40 hover:text-[#FAF8F5]'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold truncate">{s.name}</div>
                        <div
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          className="text-[11px] text-[#E5C158] mt-0.5"
                        >
                          {formatINR(getStationPrice(s))} · {s.footprint}
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          active ? 'bg-[#C9A227] text-[#040D0A]' : 'bg-[#040D0A] text-[#8FA89B]'
                        }`}
                      >
                        {active ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Center/Right Architectural Floor Grid */}
            <div className="lg:col-span-8 bg-[#040D0A] border border-[#C9A227]/40 rounded-2xl p-6 luxury-grid-bg relative">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#C9A227]/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" />
                  <span
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="text-xs text-[#F4EBD0] uppercase"
                  >
                    BALLROOM CAD SCHEMATIC (SCALE: 8FT × 8FT PER MODULE)
                  </span>
                </div>
                <button
                  onClick={() => setShowArModal(true)}
                  className="text-xs text-[#E5C158] hover:underline flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview 8×8ft Camera Overlay
                </button>
              </div>

              {/* Visual Grid Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[280px]">
                {selectedStations.map((station, index) => (
                  <div
                    key={station.id}
                    className="relative rounded-xl bg-gradient-to-br from-[#0B3D2E] to-[#072A1F] border-2 border-[#C9A227] p-4 flex flex-col justify-between shadow-[0_0_25px_rgba(201,162,39,0.2)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#C9A227] text-[#040D0A] font-bold"
                      >
                        ZONE 0{index + 1} · {station.footprint}
                      </span>
                      <button
                        onClick={() => toggleStation(station.id)}
                        className="text-[#8FA89B] hover:text-red-400 transition-colors"
                        title="Remove station"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="my-3">
                      <div className="text-sm font-bold text-[#FAF8F5] leading-snug">
                        {station.name}
                      </div>
                      <div
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        className="text-xs text-[#E5C158] mt-1"
                      >
                        {formatINR(getStationPrice(station))}
                      </div>
                    </div>

                    <div
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="pt-2 border-t border-[#C9A227]/25 flex items-center justify-between text-[10px] text-[#F4EBD0]/80"
                    >
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#E5C158]" /> 220V ≤15ft
                      </span>
                      <span>{isOutdoorVenue ? '⛺ Canopy' : '🏢 Indoor'}</span>
                    </div>
                  </div>
                ))}

                {/* Empty Add Slot Placeholder */}
                <button
                  onClick={() => scrollToSection('rate-card')}
                  className="rounded-xl border-2 border-dashed border-[#C9A227]/30 hover:border-[#E5C158] bg-[#072A1F]/20 hover:bg-[#072A1F]/40 p-4 flex flex-col items-center justify-center text-center min-h-[140px] transition-all group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#0B3D2E] border border-[#C9A227]/40 flex items-center justify-center text-[#E5C158] group-hover:scale-110 transition-transform mb-2">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#F4EBD0]">
                    + Add Another 8×8ft Station
                  </span>
                  <span className="text-[11px] text-[#8FA89B] mt-0.5">
                    Click any station on the left
                  </span>
                </button>
              </div>

              {/* Bottom Telemetry Readout */}
              <div
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                className="mt-6 pt-4 border-t border-[#C9A227]/25 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs"
              >
                <div className="bg-[#072A1F]/70 p-3 rounded-lg border border-[#C9A227]/20">
                  <div className="text-[#8FA89B] text-[10px]">TOTAL FLOOR FOOTPRINT</div>
                  <div className="text-sm font-bold text-[#FAF8F5] mt-0.5">
                    {financials.totalSqFt} sq.ft ({selectedStations.length}×8x8)
                  </div>
                </div>
                <div className="bg-[#072A1F]/70 p-3 rounded-lg border border-[#C9A227]/20">
                  <div className="text-[#8FA89B] text-[10px]">220V 15A PLUG POINTS</div>
                  <div className="text-sm font-bold text-[#E5C158] mt-0.5">
                    {financials.totalPlugPoints} Dedicated Outlets
                  </div>
                </div>
                <div className="bg-[#072A1F]/70 p-3 rounded-lg border border-[#C9A227]/20">
                  <div className="text-[#8FA89B] text-[10px]">FABRICATION ACCESS</div>
                  <div className="text-sm font-bold text-[#FAF8F5] mt-0.5">
                    T-Minus 6 Hours
                  </div>
                </div>
                <div className="bg-[#0B3D2E] p-3 rounded-lg border border-[#C9A227]">
                  <div className="text-[#F4EBD0] text-[10px]">PACKAGE SUBTOTAL</div>
                  <div className="text-sm font-bold text-[#E5C158] mt-0.5">
                    {formatINR(financials.subtotal)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          WHY PLANNERS BOOK VISRIVA IN 60 SECONDS (Comparison Matrix)
      ===================================================================== */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            className="text-xs uppercase tracking-[0.2em] text-[#C9A227] mb-2"
          >
            ONE SELF-SUFFICIENT PARTNER · ZERO SUB-VENDOR EXCUSES
          </div>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-3xl sm:text-5xl font-bold text-[#FAF8F5]"
          >
            Why Corporate Event Planners Don’t Sweat With Us
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#C9A227]/35 bg-[#072A1F]/40">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#C9A227]/25 bg-[#040D0A] text-xs font-bold uppercase tracking-wider">
            <div className="md:col-span-4 p-4 sm:p-5 text-[#8FA89B]">Operational Pillar</div>
            <div className="md:col-span-4 p-4 sm:p-5 text-[#8FA89B] border-t md:border-t-0 md:border-l border-[#C9A227]/15">
              Typical Aggregator / Broker Vendors
            </div>
            <div className="md:col-span-4 p-4 sm:p-5 text-[#E5C158] bg-[#0B3D2E]/60 border-t md:border-t-0 md:border-l border-[#C9A227]/30 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> The Visriva Live Station Standard
            </div>
          </div>

          {[
            {
              pillar: 'Hardware Ownership & Reliability',
              typical: 'Sub-rented printers and dim webcams sourced from freelancers on event morning.',
              visriva: '100% owned commercial DNP DS620A/RX1 dye-sub printers, Canon DSLR rigs, iPad Pro nodes & dual VR systems.',
            },
            {
              pillar: 'Ballroom Wi-Fi & Network Failure',
              typical: 'Stalls completely when hotel ballroom Wi-Fi drops or gets congested by 500 guests.',
              visriva: 'Private local-network architecture (iPad capture node routes over dedicated local Wi-Fi to USB print server).',
            },
            {
              pillar: 'Arrival & Setup Window',
              typical: 'Technicians arrive 60 minutes before doors open, hammering backdrops in front of early VIPs.',
              visriva: 'Mandatory 6-hour advance venue access for clean backdrop fabrication and stress-testing.',
            },
            {
              pillar: 'Pricing Transparency',
              typical: 'Opaque "DM or call for quote" walls that waste 3 days of agency procurement time.',
              visriva: 'Public starting rate card on visriva.com. Configure your stations and lock your date in 60 seconds.',
            },
          ].map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 border-b last:border-b-0 border-[#C9A227]/15 text-sm"
            >
              <div className="md:col-span-4 p-4 sm:p-5 font-semibold text-[#FAF8F5] bg-[#040D0A]/40">
                {row.pillar}
              </div>
              <div className="md:col-span-4 p-4 sm:p-5 text-[#8FA89B] border-t md:border-t-0 md:border-l border-[#C9A227]/15">
                ✕ {row.typical}
              </div>
              <div className="md:col-span-4 p-4 sm:p-5 text-[#F4EBD0] bg-[#0B3D2E]/35 border-t md:border-t-0 md:border-l border-[#C9A227]/30 font-medium">
                ✓ {row.visriva}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          PRE-BOOKING VENUE SPECS & COMMERCIAL TERMS (Clear 2-Column Checklist)
      ===================================================================== */}
      <section
        id="venue-specs"
        className="py-16 lg:py-20 bg-[#072A1F]/30 border-t border-[#C9A227]/25"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Column 1: 5-Point Venue Checklist */}
            <div className="rounded-2xl bg-[#040D0A] border border-[#C9A227]/35 p-6 sm:p-8">
              <div
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                className="text-xs uppercase tracking-widest text-[#C9A227] mb-2"
              >
                CLIENT REQUIREMENTS CHECKLIST
              </div>
              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-3xl font-bold text-[#FAF8F5] mb-6"
              >
                5 Things Your Venue Must Arrange
              </h3>

              <div className="space-y-4">
                {[
                  {
                    code: '01 / SPACE',
                    title: '8ft × 8ft Dry, Level Footprint Per Station',
                    desc: 'Flat floor clearance required for backdrop frame, lighting stand, and guest queue.',
                  },
                  {
                    code: '02 / POWER',
                    title: 'Dedicated 220–240V AC Outlet Within 15 Feet',
                    desc: 'Standard 15A three-pin socket per station to power commercial thermal printers and strobes.',
                  },
                  {
                    code: '03 / ACCESS',
                    title: 'Minimum 6-Hour Advance Venue Load-In',
                    desc: 'Required prior to event doors opening for backdrop fabrication and local-network calibration.',
                  },
                  {
                    code: '04 / OUTDOOR',
                    title: 'Protective Canopy for Outdoor / Lawn Setups',
                    desc: 'Mandatory waterproof overhead cover to protect lenses, thermal media, and VR sensors.',
                  },
                  {
                    code: '05 / FURNITURE',
                    title: '1 Sturdy Flat Table Per Station & Bay Access',
                    desc: 'One standard banquet table per station plus clear trolley movement from vehicle bay.',
                  },
                ].map((item) => (
                  <div
                    key={item.code}
                    className="p-4 rounded-xl bg-[#072A1F]/50 border border-[#C9A227]/20 flex items-start gap-4"
                  >
                    <span
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="text-[11px] font-bold px-2.5 py-1 rounded bg-[#C9A227]/20 text-[#E5C158] border border-[#C9A227]/30 shrink-0"
                    >
                      {item.code}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#FAF8F5]">{item.title}</div>
                      <div className="text-xs text-[#8FA89B] mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Commercial Terms & Instant Block Form */}
            <div className="rounded-2xl bg-gradient-to-b from-[#0B3D2E] to-[#040D0A] border border-[#C9A227]/50 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className="text-xs uppercase tracking-widest text-[#E5C158] mb-2"
                >
                  COMMERCIAL TERMS & INSTANT DATE BLOCKER
                </div>
                <h3
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  className="text-3xl font-bold text-[#FAF8F5] mb-6"
                >
                  Lock Your Hardware & Date Now
                </h3>

                {/* Commercial Policy Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="p-3.5 rounded-xl bg-[#040D0A]/80 border border-[#C9A227]/30">
                    <div
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="text-lg font-bold text-[#E5C158]"
                    >
                      50% Advance
                    </div>
                    <div className="text-xs text-[#8FA89B] mt-0.5">
                      Non-refundable deposit locks dates & fleet
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#040D0A]/80 border border-[#C9A227]/30">
                    <div
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="text-lg font-bold text-[#E5C158]"
                    >
                      18% GST
                    </div>
                    <div className="text-xs text-[#8FA89B] mt-0.5">
                      Standard B2B corporate tax invoice
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#040D0A]/80 border border-[#C9A227]/30">
                    <div
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      className="text-lg font-bold text-[#E5C158]"
                    >
                      ₹2k – ₹4k
                    </div>
                    <div className="text-xs text-[#8FA89B] mt-0.5">
                      Bengaluru fleet transit & logistics
                    </div>
                  </div>
                </div>

                {/* Quick Embedded Date Block Form */}
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#F4EBD0] mb-1 font-medium">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#040D0A] border border-[#C9A227]/35 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#E5C158]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#F4EBD0] mb-1 font-medium">
                        Venue / Bengaluru Area
                      </label>
                      <input
                        type="text"
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        placeholder="e.g. Whitefield / Manyata / Hotel"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#040D0A] border border-[#C9A227]/35 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#E5C158]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-[#F4EBD0] mb-1 font-medium">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Optional"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#040D0A] border border-[#C9A227]/35 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#E5C158]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#F4EBD0] mb-1 font-medium">
                        Company / Brand
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company Name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#040D0A] border border-[#C9A227]/35 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#E5C158]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#F4EBD0] mb-1 font-medium">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+91 98..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#040D0A] border border-[#C9A227]/35 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#E5C158]"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 pt-2 cursor-pointer text-xs text-[#F4EBD0]/90">
                    <input
                      type="checkbox"
                      checked={requirementsChecked}
                      onChange={(e) => setRequirementsChecked(e.target.checked)}
                      className="mt-0.5 accent-[#C9A227]"
                    />
                    <span>
                      We acknowledge the 8ft × 8ft space requirement, 220V power within 15ft, 6-hour advance venue access, and 50% non-refundable deposit policy.
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#C9A227]/30">
                <div className="flex items-center justify-between text-xs mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span className="text-[#F4EBD0]">
                    {selectedStations.length} STATIONS SELECTED ({financials.totalSqFt} SQ.FT)
                  </span>
                  <span className="text-base font-bold text-[#E5C158]">
                    Subtotal: {formatINR(financials.subtotal)}
                  </span>
                </div>

                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#C9A227] via-[#E5C158] to-[#C9A227] text-[#040D0A] font-bold text-sm sm:text-base tracking-wide shadow-[0_0_30px_rgba(201,162,39,0.4)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Generate Instant Quote & Block Date on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FOOTER
      ===================================================================== */}
      <footer className="bg-[#040D0A] border-t border-[#C9A227]/25 py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#8FA89B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <VisrivaLogo size="md" />
            <p className="mt-3 max-w-md text-[#8FA89B]">
              End-to-end corporate live engagement stations, high-speed instant photo booths, live tote & apparel printing, and commercial VR setups across Bengaluru and South India.
            </p>
          </div>
          <div className="space-y-1.5 text-left sm:text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <div className="text-[#F4EBD0] font-semibold">VISRIVA LIVE STATION · BENGALURU</div>
            <div>Instagram: @visrivalivestation · Domain: visriva.com</div>
            <div>18% GST B2B Corporate Billing · 50% Advance Date Lock</div>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          PERSISTENT STICKY "INSTANT BLOCK" BOTTOM DRAWER
      ===================================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#072A1F]/95 backdrop-blur-2xl border-t-2 border-[#C9A227] shadow-[0_-15px_50px_rgba(0,0,0,0.85)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          {/* Expandable Selected Station Pills Row */}
          {drawerExpanded && (
            <div className="pb-3 mb-3 border-b border-[#C9A227]/25 flex flex-wrap items-center gap-2">
              {selectedStations.map((s) => (
                <div
                  key={s.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#040D0A] border border-[#C9A227]/40 text-xs text-[#FAF8F5]"
                >
                  <span className="font-medium">{s.name}</span>
                  <span
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="text-[#E5C158]"
                  >
                    {formatINR(getStationPrice(s))}
                  </span>
                  <button
                    onClick={() => toggleStation(s.id)}
                    className="text-[#8FA89B] hover:text-red-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left Package Summary */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
              <button
                onClick={() => setDrawerExpanded(!drawerExpanded)}
                className="flex items-center gap-2.5 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C9A227] text-[#040D0A] font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(201,162,39,0.4)]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {selectedStations.length}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#F4EBD0] flex items-center gap-1">
                    <span>Stations in Package</span>
                    <span className="text-[#E5C158] underline ml-1 text-[11px]">
                      {drawerExpanded ? 'Hide' : 'View List'}
                    </span>
                  </div>
                  <div
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="text-[11px] text-[#8FA89B]"
                  >
                    {financials.totalSqFt} sq.ft · {financials.totalPlugPoints}× 220V Outlets · 6-Hr Setup
                  </div>
                </div>
              </button>

              <div className="h-8 w-px bg-[#C9A227]/25 hidden sm:block" />

              <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <div className="text-[10px] uppercase text-[#8FA89B]">
                  EST. STARTING TOTAL (+GST & BLR TRANSIT)
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg sm:text-xl font-bold text-[#E5C158]">
                    {formatINR(financials.subtotal)}
                  </span>
                  <span className="text-[11px] text-[#F4EBD0]/80 hidden sm:inline">
                    (50% Lock: ~{formatINR(financials.advanceDeposit)})
                  </span>
                </div>
              </div>
            </div>

            {/* Right Quick Inputs + Instant Block CTA */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="hidden lg:block px-3 py-2.5 rounded-xl bg-[#040D0A] border border-[#C9A227]/40 text-xs text-[#FAF8F5]"
              />
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="Bengaluru Venue / Area"
                className="hidden xl:block px-3 py-2.5 rounded-xl bg-[#040D0A] border border-[#C9A227]/40 text-xs text-[#FAF8F5] w-48"
              />
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex-1 md:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] via-[#E5C158] to-[#C9A227] text-[#040D0A] font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(201,162,39,0.45)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <span>Block This Date Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: INSTANT WHATSAPP QUOTE & SUPABASE LEAD CONFIRMATION
      ===================================================================== */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#072A1F] border-2 border-[#C9A227] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-[0_0_70px_rgba(201,162,39,0.35)] relative my-8">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-5 right-5 text-[#8FA89B] hover:text-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#E5C158] text-xs font-bold mb-3">
              <CheckCircle2 className="w-4 h-4" />
              PACKAGE READY TO LOCK
            </div>

            <h3
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-3xl font-bold text-[#FAF8F5]"
            >
              Instant WhatsApp Dispatch & Lead Lock
            </h3>
            <p className="text-xs sm:text-sm text-[#F4EBD0]/80 mt-1">
              In production, this simultaneously saves your lead to Supabase (<code className="text-[#E5C158]">quote_leads</code>) and opens WhatsApp with your itemized station breakdown pre-filled.
            </p>

            {/* Pre-filled WhatsApp Payload Preview */}
            <div className="mt-4 p-4 rounded-xl bg-[#040D0A] border border-[#C9A227]/35 font-mono text-xs text-[#F4EBD0] whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
              {whatsappMessage}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(whatsappMessage);
                  setCopiedWhatsApp(true);
                  setTimeout(() => setCopiedWhatsApp(false), 2500);
                }}
                className="px-4 py-3 rounded-xl bg-[#040D0A] hover:bg-[#0B3D2E] text-[#F4EBD0] border border-[#C9A227]/40 text-xs font-semibold flex items-center gap-2"
              >
                <Copy className="w-4 h-4 text-[#E5C158]" />
                <span>{copiedWhatsApp ? 'Copied Quote Summary!' : 'Copy Summary Text'}</span>
              </button>

              <a
                href={`https://wa.me/${SITE_THEME.brand.whatsappNumber}?text=${encodeURIComponent(
                  whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] via-[#E5C158] to-[#C9A227] text-[#040D0A] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(201,162,39,0.4)]"
              >
                <Send className="w-4 h-4" />
                <span>Launch WhatsApp with Pre-Filled Quote →</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: 8x8 FT AR VENUE FOOTPRINT VISUALIZER
      ===================================================================== */}
      {showArModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#040D0A] border-2 border-[#C9A227] rounded-2xl max-w-xl w-full p-6 relative">
            <button
              onClick={() => setShowArModal(false)}
              className="absolute top-4 right-4 text-[#8FA89B] hover:text-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              className="text-xs text-[#E5C158] uppercase tracking-wider mb-1"
            >
              AR VENUE RECCE TOOL // 8FT × 8FT CLEARANCE
            </div>
            <h3
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-2xl sm:text-3xl font-bold text-[#FAF8F5] mb-4"
            >
              Visualize Station Footprint at Your Venue
            </h3>

            {/* Simulated Camera Wireframe Viewfinder */}
            <div className="relative h-64 rounded-xl bg-gradient-to-b from-[#072A1F] to-[#040D0A] border border-[#C9A227]/40 overflow-hidden flex items-center justify-center luxury-grid-bg">
              {/* 3D Perspective Bounding Box */}
              <div className="w-56 h-40 border-2 border-dashed border-[#E5C158] bg-[#C9A227]/10 rounded-lg flex flex-col items-center justify-center p-4 text-center relative shadow-[0_0_30px_rgba(201,162,39,0.25)]">
                <span
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className="text-xs font-bold text-[#040D0A] bg-[#E5C158] px-2 py-0.5 rounded"
                >
                  8ft Width × 8ft Depth × 8ft Height
                </span>
                <p className="text-xs text-[#F4EBD0] mt-2">
                  Dry, level surface + 1 Banquet Table + 220V 15A Plug within 15ft
                </p>
                <div className="absolute -bottom-3 px-2 py-0.5 rounded bg-[#040D0A] border border-[#C9A227] text-[10px] text-[#E5C158]">
                  ▲ FRONT QUEUE LINE
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowArModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#C9A227] text-[#040D0A] font-bold text-xs"
              >
                Got It — Close Viewfinder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: /GIVEAWAY GUEST QR FUNNEL PREVIEW
      ===================================================================== */}
      {showGiveawayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#072A1F] border-2 border-[#C9A227] rounded-2xl max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setShowGiveawayModal(false)}
              className="absolute top-4 right-4 text-[#8FA89B] hover:text-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#E5C158] text-xs font-bold mb-2">
              <Gift className="w-3.5 h-3.5" />
              VISRIVA.COM/GIVEAWAY PREVIEW
            </div>
            <h3
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-3xl font-bold text-[#FAF8F5]"
            >
              Win a Custom Photo Magnet & Keychain Hamper
            </h3>
            <p className="text-xs text-[#F4EBD0]/80 mt-1">
              Scanned a QR code at a Visriva booth today? Tag <strong className="text-[#E5C158]">@visrivalivestation</strong> on Instagram and upload your screenshot below. Dual-syncs to Google Sheets & Supabase.
            </p>

            {giveawaySubmitted ? (
              <div className="my-6 p-5 rounded-xl bg-[#040D0A] border border-[#10B981] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
                <div className="font-bold text-[#FAF8F5]">Entry Logged to Supabase & Google Sheets!</div>
                <p className="text-xs text-[#8FA89B]">
                  Weekly winners are crowned every Friday from the Visriva Admin Dashboard.
                </p>
              </div>
            ) : (
              <div className="space-y-3 my-4">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040D0A] border border-[#C9A227]/35 text-xs text-[#FAF8F5]"
                />
                <input
                  type="text"
                  placeholder="Your Instagram Handle (@username)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040D0A] border border-[#C9A227]/35 text-xs text-[#FAF8F5]"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Number (for hamper delivery)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040D0A] border border-[#C9A227]/35 text-xs text-[#FAF8F5]"
                />
                <div className="p-3 rounded-xl border border-dashed border-[#C9A227]/50 bg-[#040D0A]/60 text-center text-xs text-[#8FA89B]">
                  📸 Tap to upload screenshot tagging <strong className="text-[#E5C158]">@visrivalivestation</strong>
                </div>
                <button
                  onClick={() => setGiveawaySubmitted(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E5C158] text-[#040D0A] font-bold text-xs"
                >
                  Submit Giveaway Entry →
                </button>
              </div>
            )}

            <div className="pt-3 border-t border-[#C9A227]/25 flex items-center justify-between text-xs">
              <span className="text-[#8FA89B]">Planning a corporate event?</span>
              <button
                onClick={() => {
                  setShowGiveawayModal(false);
                  scrollToSection('rate-card');
                }}
                className="text-[#E5C158] font-bold hover:underline"
              >
                Get a Free Station Quote →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}