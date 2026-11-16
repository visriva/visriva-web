import type { Metadata } from "next";
import { InventoryPage } from "@/components/InventoryPage";
import { KeychainStationFaq } from "@/components/KeychainStationFaq";
import { KeychainStationTopicalSeoSection } from "@/components/KeychainStationTopicalSeoSection";
import { PricingEstimatorSection } from "@/components/PricingEstimatorSection";
import { ServiceSiloLinks } from "@/components/ServiceSiloLinks";
import { PolicyStrip } from "@/components/PolicyStrip";
import { KeychainStationServiceJsonLd } from "@/components/seo/KeychainStationServiceJsonLd";
import { pageMeta } from "@/lib/seo";
import { getPublishedCatalog } from "@/lib/services-catalog";
import { siteUrl } from "@/lib/site";

const KEYCHAIN_KEYWORDS = [
  "live keychain station",
  "photo keychain booth bangalore",
  "custom keychain printing event",
  "live keychain stall cost bengaluru",
] as const;

const DEFAULT_TITLE = "Live Keychain Station Rental Bengaluru | Visriva Live Station";
const DEFAULT_DESCRIPTION =
  "Book Visriva's live photo keychain printing station for weddings and corporate events in Bengaluru. Instant custom acrylic or metal keychains your guests will actually keep.";

const KEYCHAIN_SERVICE_IDS = ["fridge-magnets"] as const;

const highlights = [
  { number: "01", title: "Capture", body: "Guest portraits or brand artwork—ready for acrylic or metal assembly in minutes." },
  { number: "02", title: "Assemble live", body: "High-speed print, cut, and seal with custom frames and attachment options." },
  { number: "03", title: "Carry home", body: "A pocket-sized keepsake guests attach to keys and bags the same evening." },
];

export function generateMetadata(): Metadata {
  const base = pageMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION, "/services/keychain-station");

  return {
    ...base,
    keywords: [...KEYCHAIN_KEYWORDS, ...(Array.isArray(base.keywords) ? base.keywords : [])],
    openGraph: {
      ...base.openGraph,
      title: "Live Keychain Station | Visriva Live Station Bengaluru",
      description: "Instant custom photo keychains printed live at your venue in Bangalore.",
      url: `${siteUrl}/services/keychain-station`,
      siteName: "Visriva Live Station",
    },
  };
}

export default async function KeychainStationPage() {
  const catalog = await getPublishedCatalog();
  const services = KEYCHAIN_SERVICE_IDS.map((id) => catalog.getService(id)).filter(
    (service): service is NonNullable<typeof service> => Boolean(service),
  );

  return (
    <>
      <KeychainStationServiceJsonLd />
      <InventoryPage
        eyebrow="Live keepsakes · Keychains"
        title="Live Keychain Station in"
        accent="Bengaluru."
        description="Turn every guest moment into a premium keychain they will actually use. Visriva's live keychain station delivers instant, high-quality custom keychains at weddings, corporate events, and brand activations."
        heroImage="/images/reception.jpg"
        heroAlt="Guests mingling at a wedding reception"
        introTitle="Small enough for a pocket. Specific enough to keep."
        intro="From acrylic to metallic finishes, our crew runs high-throughput keychain stations for corporate events and weddings across Bengaluru—with split rings, chains, and carabiner options built into your brief."
        highlights={highlights}
        services={services.length ? services : catalog.servicesIn("ai-merchandise").slice(0, 3)}
        locationLine="Bengaluru based · Events across India"
        closingTitle="Give guests something they'll clip on tonight."
        closingCopy="Tell us your guest count, event format, and finish preferences. We'll plan a live keychain station sized for your floor plan."
      />
      <KeychainStationTopicalSeoSection />
      <KeychainStationFaq />
      <ServiceSiloLinks omitHref="/services/keychain-station" />
      <PricingEstimatorSection defaultStation="keychain-station" />
      <section className="bg-[#DCE9D8] px-5 pb-16 sm:px-8 lg:px-12">
        <PolicyStrip />
      </section>
    </>
  );
}