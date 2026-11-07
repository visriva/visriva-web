"use client";

import React, { useState, useEffect } from 'react';
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
import Link from 'next/link';
import { StationRateCard } from '@/components/booking/StationRateCard';
import { SITE_THEME } from '@/lib/luxury-stations';

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export function LuxuryInteractivePlatform() {
  const [activeHeroPreview, setActiveHeroPreview] = useState(0);
  const [liveGuestTicker, setLiveGuestTicker] = useState(14820);
  const [ambientSound, setAmbientSound] = useState(false);
  const [showGiveawayModal, setShowGiveawayModal] = useState(false);
  const [giveawaySubmitted, setGiveawaySubmitted] = useState(false);

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

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#040D0A] pt-[4.5rem] text-cream selection:bg-gold selection:text-deep">
      {/* =====================================================================
          TOP LIVE TICKER BAR (Synced with Admin Daily Updates Concept)
      ===================================================================== */}
      <div className="bg-[#072A1F] border-b border-[#C9A227]/20 py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="mood-nav-chimela inline-flex items-center gap-1.5 rounded border border-gold/40 bg-gold/15 px-2 py-0.5 font-medium text-gold-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              LIVE FLEET STATUS
            </span>
            <span className="text-[#F4EBD0]/90 hidden sm:inline">
              100% In-House Hardware Fleet · DNP DS620A/RX1 Print Servers & Dual VR Rigs Ready Across Bengaluru
            </span>
          </div>
          <div className="ml-auto flex items-center gap-4 font-mono text-xs">
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

              <h1 className="type-display text-4xl leading-[1.04] sm:text-6xl lg:text-[66px] text-cream">
                Crowds around every corner.{' '}
                <span className="type-display-italic bg-gradient-to-r from-champagne via-gold-2 to-gold bg-clip-text text-transparent">
                  Zero vendor chaos.
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
                <Link
                  href="/quote"
                  className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#C9A227] via-[#E5C158] to-[#C9A227] text-[#040D0A] font-bold text-sm sm:text-base tracking-wide shadow-[0_0_30px_rgba(201,162,39,0.4)] hover:shadow-[0_0_45px_rgba(229,193,88,0.7)] hover:scale-[1.02] transition-all flex items-center gap-2.5 gold-pulse"
                >
                  <span>Request a quote</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/#rate-card"
                  className="px-6 py-4 rounded-xl bg-[#0B3D2E]/60 hover:bg-[#0B3D2E] text-[#F4EBD0] border border-[#C9A227]/40 font-semibold text-sm sm:text-base transition-all flex items-center gap-2"
                >
                  <Camera className="w-4 h-4 text-[#E5C158]" />
                  <span>Open rate card</span>
                </Link>

                <Link
                  href="/client-requirements"
                  className="px-4 py-4 rounded-xl bg-[#040D0A]/80 hover:border-[#E5C158] text-[#8FA89B] hover:text-[#F4EBD0] border border-[#C9A227]/25 text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <Maximize2 className="w-4 h-4 text-[#C9A227]" />
                  <span>Venue requirements</span>
                </Link>
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

      <StationRateCard />

      {/* =====================================================================
          WHY PLANNERS BOOK VISRIVA IN 60 SECONDS (Comparison Matrix)
      ===================================================================== */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="mood-nav-chimela mb-2 text-gold">
            One self-sufficient partner · zero sub-vendor excuses
          </p>
          <h2 className="mood-logotype mood-logotype-epstonik text-3xl text-cream sm:text-5xl">
            Why corporate planners don’t sweat with us
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
              visriva: 'Public starting rates on photo-booth and merch pages, plus a quote wizard at visriva.com/quote.',
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
            <h3 className="type-display text-3xl text-cream">
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
              <Link
                href="/quote"
                onClick={() => setShowGiveawayModal(false)}
                className="text-[#E5C158] font-bold hover:underline"
              >
                Get a station quote →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}