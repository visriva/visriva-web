import type { Metadata } from "next";
import { InventoryPage } from "@/components/InventoryPage";
import { PhotoBoothFaq } from "@/components/PhotoBoothFaq";
import { PhotoBoothTopicalSeoSection } from "@/components/PhotoBoothTopicalSeoSection";
import { PricingEstimatorSection } from "@/components/PricingEstimatorSection";
import { ServiceSiloLinks } from "@/components/ServiceSiloLinks";
import { PolicyStrip } from "@/components/PolicyStrip";
import { PhotoBoothServiceJsonLd } from "@/components/seo/PhotoBoothServiceJsonLd";
import { pageMeta } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { getPublishedCatalog } from "@/lib/services-catalog";
import { getWebsitePage } from "@/lib/website-pages";

const PHOTO_BOOTH_KEYWORDS = [
  "photo booth bangalore",
  "photo booth rental",
  "photobooth machine rental",
  "ai photo booth rental",
  "corporate photo booth bangalore",
  "instant photo booth bengaluru",
  "wedding photo booth bangalore",
] as const;

const DEFAULT_TITLE = "Best Photo Booth Rental in Bengaluru | 11s Instant Prints | Visriva";
const DEFAULT_DESCRIPTION =
  "Looking for the best photo booth rental in Bengaluru? Visriva Live Station offers instant 2x6 photo strip printing, custom templates, and high-speed DSLR/iPad booths for weddings and corporate events.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWebsitePage("photo-booths");
  const title = page?.seo_title || DEFAULT_TITLE;
  const description = page?.seo_description || DEFAULT_DESCRIPTION;
  const base = pageMeta(title, description, "/photo-booths");

  return {
    ...base,
    keywords: [...PHOTO_BOOTH_KEYWORDS, ...(Array.isArray(base.keywords) ? base.keywords : [])],
    openGraph: {
      ...base.openGraph,
      title: page?.seo_title || "Visriva Live Station | Photo Booth Rental Bengaluru",
      description:
        page?.seo_description ||
        "Instant photo booth activations with 11-second print cycles for weddings and corporate events in Bangalore.",
      url: `${siteUrl}/photo-booths`,
      siteName: "Visriva Live Station",
    },
  };
}

const highlights = [
  { number: "01", title: "Capture", body: "A polished photo moment, from classic instant prints to AI-powered transformations." },
  { number: "02", title: "Personalise", body: "Frames, creative direction and event-led details that make each output feel considered." },
  { number: "03", title: "Take it home", body: "A tangible keepsake guests can carry away long after the event ends." },
];

export default async function PhotoBoothsPage() {
  const [catalog, pageContent] = await Promise.all([getPublishedCatalog(), getWebsitePage("photo-booths")]);
  return (
    <>
      <PhotoBoothServiceJsonLd />
      <InventoryPage
        pageContent={pageContent}
        eyebrow="Photo booths · AI photo experiences"
        title="Premium photo booth rental in"
        accent="Bengaluru."
        description="Elevate weddings, corporate celebrations, and brand activations with high-speed instant photo booths. DNP dye-sub prints in an 11-second cycle—2×6 strips guests love to take home."
        heroImage="/images/party.jpg"
        heroAlt="Guests celebrating together at a lively event"
        introTitle="A photo experience should feel like part of the celebration."
        intro="Visriva's photo booth stations are designed to bring guests together, not pull them away from the event. From classic instant photo booth rentals to AI photo transformations, our team helps shape the capture style, guest flow and keepsake around your occasion."
        highlights={highlights}
        services={catalog.servicesIn("photo-booths")}
        locationLine="Bengaluru based · Events across India"
        closingTitle="Make a moment worth keeping."
        closingCopy="Tell us your event date, venue and guest count. We'll recommend a photo booth experience that fits the room and the kind of memory you want guests to take home."
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