import type { Metadata } from "next";
import { InventoryPage } from "@/components/InventoryPage";
import { PolicyStrip } from "@/components/PolicyStrip";
import { ToteTshirtStationFaq } from "@/components/ToteTshirtStationFaq";
import { ToteTshirtStationTopicalSeoSection } from "@/components/ToteTshirtStationTopicalSeoSection";
import { PricingEstimatorSection } from "@/components/PricingEstimatorSection";
import { ServiceSiloLinks } from "@/components/ServiceSiloLinks";
import { ToteTshirtStationServiceJsonLd } from "@/components/seo/ToteTshirtStationServiceJsonLd";
import { pageMeta } from "@/lib/seo";
import { getPublishedCatalog } from "@/lib/services-catalog";
import { siteUrl } from "@/lib/site";

const TOTE_TSHIRT_KEYWORDS = [
  "live tote bag printing",
  "live t-shirt printing",
  "corporate event gifting station bangalore",
  "live block printing activation",
] as const;

const DEFAULT_TITLE = "Live Tote Bag & T-Shirt Printing Station | Visriva Bengaluru";
const DEFAULT_DESCRIPTION =
  "Engage your audience with live custom tote bag and T-shirt block printing stations for corporate events, tech summits, and brand activations in Bengaluru.";

const TOTE_TSHIRT_SERVICE_IDS = ["tote-100", "tote-200", "dtf-tees"] as const;

const highlights = [
  { number: "01", title: "Choose", body: "Guests pick layouts, logos or brand marks aligned to your guidelines." },
  { number: "02", title: "Print live", body: "Block-stamped totes or DTF apparel produced on-site with hosted artisans and crew." },
  { number: "03", title: "Take it home", body: "Useful merchandise guests carry long after the event ends." },
];

export function generateMetadata(): Metadata {
  const base = pageMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION, "/services/tote-tshirt-station");

  return {
    ...base,
    keywords: [...TOTE_TSHIRT_KEYWORDS, ...(Array.isArray(base.keywords) ? base.keywords : [])],
    openGraph: {
      ...base.openGraph,
      title: "Live Tote Bag & T-Shirt Printing | Visriva Live Station",
      description:
        "Interactive live merchandise printing stations for corporate events and experiential marketing in Bangalore.",
      url: `${siteUrl}/services/tote-tshirt-station`,
      siteName: "Visriva Live Station",
    },
  };
}

export default async function ToteTshirtStationPage() {
  const catalog = await getPublishedCatalog();
  const services = TOTE_TSHIRT_SERVICE_IDS.map((id) => catalog.getService(id)).filter(
    (service): service is NonNullable<typeof service> => Boolean(service),
  );

  return (
    <>
      <ToteTshirtStationServiceJsonLd />
      <InventoryPage
        eyebrow="Corporate gifting · Live apparel"
        title="Live Tote Bag & T-Shirt Printing Stations in"
        accent="Bengaluru."
        description="Turn event giveaways into an engaging experience. Visriva provides live block printing and customized apparel stations for corporate clients like Deloitte, Samsung, and top brand activations across Bengaluru."
        heroImage="/images/workshop.jpg"
        heroAlt="A creative team working together around a merchandise station"
        introTitle="Merchandise is better when guests watch it get made."
        intro="Our live tote and T-shirt stations combine artisan block printing with DTF apparel lines—tailored to tech summits, product launches, campus fests and experiential marketing pop-ups."
        highlights={highlights}
        services={services.length ? services : catalog.servicesIn("ai-merchandise").slice(0, 4)}
        locationLine="Bengaluru based · Events across India"
        closingTitle="Give guests something they helped create."
        closingCopy="Tell us your brand guidelines, run sizes and guest count. We'll recommend a live printing station that fits your floor plan and throughput."
      />
      <ToteTshirtStationTopicalSeoSection />
      <ToteTshirtStationFaq />
      <ServiceSiloLinks omitHref="/services/tote-tshirt-station" />
      <PricingEstimatorSection defaultStation="tote-tshirt" />
      <section className="bg-[#DCE9D8] px-5 pb-16 sm:px-8 lg:px-12">
        <PolicyStrip />
      </section>
    </>
  );
}