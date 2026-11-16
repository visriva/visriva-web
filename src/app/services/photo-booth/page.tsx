import type { Metadata } from "next";
import { InventoryPage } from "@/components/InventoryPage";
import { PhotoBoothFaq } from "@/components/PhotoBoothFaq";
import { PhotoBoothTopicalSeoSection } from "@/components/PhotoBoothTopicalSeoSection";
import { PricingEstimatorSection } from "@/components/PricingEstimatorSection";
import { PolicyStrip } from "@/components/PolicyStrip";
import { ServiceSiloLinks } from "@/components/ServiceSiloLinks";
import { PhotoBoothServiceJsonLd } from "@/components/seo/PhotoBoothServiceJsonLd";
import { pageMeta } from "@/lib/seo";
import { getPublishedCatalog } from "@/lib/services-catalog";
import { siteUrl } from "@/lib/site";

const PHOTO_BOOTH_GSC_KEYWORDS = [
  "instant photo booth rental bangalore",
  "best instant photo booth bengaluru",
  "11 second photo booth",
  "corporate photo booth bangalore",
  "photo booth rental for events bengaluru",
] as const;

const DEFAULT_TITLE = "Instant Photo Booth Rental Bengaluru | 11-Second Prints | Visriva";
const DEFAULT_DESCRIPTION =
  "Book Visriva's high-speed instant photo booth for weddings and corporate events in Bengaluru. Lightning-fast 11-second photo strips, professional crew, and custom branding.";

const highlights = [
  { number: "01", title: "11-second prints", body: "DNP dye-sub strips dry fast so queues stay short at corporate and wedding guest counts." },
  { number: "02", title: "Hosted crew", body: "Visriva Live Station operators manage flow, templates, and on-ground setup end to end." },
  { number: "03", title: "Custom strips", body: "Event-branded 2×6 layouts tailored for galas, launches, and receptions across Bengaluru." },
];

export function generateMetadata(): Metadata {
  const base = pageMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION, "/services/photo-booth");

  return {
    ...base,
    keywords: [...PHOTO_BOOTH_GSC_KEYWORDS, ...(Array.isArray(base.keywords) ? base.keywords : [])],
    openGraph: {
      ...base.openGraph,
      title: "Instant Photo Booth Rental Bengaluru | Visriva Live Station",
      description:
        "High-speed 11-second photo strip prints for weddings and corporate events in Bangalore.",
      url: `${siteUrl}/services/photo-booth`,
      siteName: "Visriva Live Station",
    },
  };
}

export default async function PhotoBoothServicePage() {
  const catalog = await getPublishedCatalog();

  return (
    <>
      <PhotoBoothServiceJsonLd canonicalPath="/services/photo-booth" />
      <InventoryPage
        eyebrow="Visriva Live Station · Instant prints"
        title="Instant Photo Booth Rental in"
        accent="Bengaluru."
        description="Visriva Live Station delivers high-speed instant photo booth experiences for weddings and corporate events across Bengaluru. Finished photo strips in approximately 11 seconds — fast enough for large celebrations."
        heroImage="/images/party.jpg"
        heroAlt="Guests celebrating together at a lively event"
        introTitle="Built for speed, hosted for your guest list."
        intro="From corporate photo booth Bangalore activations to wedding receptions, Visriva pairs 11-second print cycles with professional crew and custom-branded strips."
        highlights={highlights}
        services={catalog.servicesIn("photo-booths")}
        locationLine="Bengaluru based · Events across India"
        closingTitle="Book the booth guests line up for."
        closingCopy="Share your date, venue, and guest count. We'll recommend an instant photo booth rental package sized for your event."
      />
      <PhotoBoothTopicalSeoSection />
      <PhotoBoothFaq />
      <ServiceSiloLinks omitHref="/services/photo-booth" />
      <PricingEstimatorSection defaultStation="photo-booth" />
      <section className="bg-[#DCE9D8] px-5 pb-16 sm:px-8 lg:px-12">
        <PolicyStrip />
      </section>
    </>
  );
}