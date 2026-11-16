import type { Metadata } from "next";
import { InventoryPage } from "@/components/InventoryPage";
import { MagnetStationFaq } from "@/components/MagnetStationFaq";
import { MagnetStationTopicalSeoSection } from "@/components/MagnetStationTopicalSeoSection";
import { PricingEstimatorSection } from "@/components/PricingEstimatorSection";
import { ServiceSiloLinks } from "@/components/ServiceSiloLinks";
import { PolicyStrip } from "@/components/PolicyStrip";
import { MagnetStationServiceJsonLd } from "@/components/seo/MagnetStationServiceJsonLd";
import { pageMeta } from "@/lib/seo";
import { getPublishedCatalog } from "@/lib/services-catalog";
import { siteUrl } from "@/lib/site";

const MAGNET_KEYWORDS = [
  "magnet station",
  "live fridge magnet stall cost",
  "zippy magnet live photo fridge magnet stall",
  "photo magnet booth bangalore",
] as const;

const DEFAULT_TITLE = "Live Fridge Magnet Station Rental Bengaluru | Visriva Live Station";
const DEFAULT_DESCRIPTION =
  "Book Visriva's custom live fridge magnet printing station for weddings and corporate events in Bengaluru. Instant high-quality photo magnets your guests will keep forever.";

const MAGNET_SERVICE_IDS = ["fridge-magnets"] as const;

const highlights = [
  { number: "01", title: "Capture", body: "Candid portraits on arrival or across the celebration—ready for magnet conversion in minutes." },
  { number: "02", title: "Print live", body: "High-grade magnetic sheets, custom frames, and on-ground crew handling every guest." },
  { number: "03", title: "Display", body: "A curated pickup wall so guests collect a keepsake they'll see every day." },
];

export function generateMetadata(): Metadata {
  const base = pageMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION, "/services/magnet-station");

  return {
    ...base,
    keywords: [...MAGNET_KEYWORDS, ...(Array.isArray(base.keywords) ? base.keywords : [])],
    openGraph: {
      ...base.openGraph,
      title: "Live Fridge Magnet Station | Visriva Live Station Bengaluru",
      description:
        "Transform guest memories into instant fridge magnets with our live event station in Bangalore.",
      url: `${siteUrl}/services/magnet-station`,
      siteName: "Visriva Live Station",
    },
  };
}

export default async function MagnetStationPage() {
  const catalog = await getPublishedCatalog();
  const services = MAGNET_SERVICE_IDS.map((id) => catalog.getService(id)).filter(
    (service): service is NonNullable<typeof service> => Boolean(service),
  );

  return (
    <>
      <MagnetStationServiceJsonLd />
      <InventoryPage
        eyebrow="Live keepsakes · Fridge magnets"
        title="Live Fridge Magnet Station in"
        accent="Bengaluru."
        description="Give your guests a takeaway they will display every day. Visriva's live fridge magnet station captures candid moments and instantly converts them into premium custom photo magnets right at your venue."
        heroImage="/images/toast.jpg"
        heroAlt="Guests raising a toast at a celebration"
        introTitle="A magnet guests will actually put on the fridge."
        intro="From weddings to corporate receptions, our live magnet station pairs DSLR capture with high-speed printing, custom branding frames, and a display wall built for smooth guest flow."
        highlights={highlights}
        services={services.length ? services : catalog.servicesIn("ai-merchandise").slice(0, 3)}
        locationLine="Bengaluru based · Events across India"
        closingTitle="Turn moments into magnets."
        closingCopy="Share your event date, venue and guest count. We'll plan a live magnet activation that fits your celebration and delivery timeline."
      />
      <MagnetStationTopicalSeoSection />
      <MagnetStationFaq />
      <ServiceSiloLinks omitHref="/services/magnet-station" />
      <PricingEstimatorSection defaultStation="magnet-station" />
      <section className="bg-[#DCE9D8] px-5 pb-16 sm:px-8 lg:px-12">
        <PolicyStrip />
      </section>
    </>
  );
}