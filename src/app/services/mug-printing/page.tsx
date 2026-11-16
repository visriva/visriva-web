import type { Metadata } from "next";
import { InventoryPage } from "@/components/InventoryPage";
import { MugPrintingFaq } from "@/components/MugPrintingFaq";
import { MugPrintingTopicalSeoSection } from "@/components/MugPrintingTopicalSeoSection";
import { PricingEstimatorSection } from "@/components/PricingEstimatorSection";
import { ServiceSiloLinks } from "@/components/ServiceSiloLinks";
import { PolicyStrip } from "@/components/PolicyStrip";
import { MugPrintingServiceJsonLd } from "@/components/seo/MugPrintingServiceJsonLd";
import { pageMeta } from "@/lib/seo";
import { getPublishedCatalog } from "@/lib/services-catalog";
import { siteUrl } from "@/lib/site";

const MUG_KEYWORDS = [
  "live mug printing",
  "mug printing station bangalore",
  "corporate event gifting mug printing",
  "personalized mugs event activation",
] as const;

const DEFAULT_TITLE = "Live Mug Printing Station for Events | Visriva Bengaluru";
const DEFAULT_DESCRIPTION =
  "Book Visriva's live custom mug printing station for corporate events, weddings, and giveaways in Bengaluru. Instant high-quality personalized mugs for your guests.";

const highlights = [
  { number: "01", title: "Design", body: "Guests pick photos, logos, or event artwork aligned to your brand." },
  { number: "02", title: "Press live", body: "Sublimation printers and heat presses on-site—mugs ready in minutes." },
  { number: "03", title: "Gift", body: "A high-value keepsake guests use daily, long after the celebration." },
];

export function generateMetadata(): Metadata {
  const base = pageMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION, "/services/mug-printing");

  return {
    ...base,
    keywords: [...MUG_KEYWORDS, ...(Array.isArray(base.keywords) ? base.keywords : [])],
    openGraph: {
      ...base.openGraph,
      title: "Live Mug Printing Station | Visriva Live Station",
      description:
        "Interactive live mug printing activations for corporate events and weddings in Bangalore.",
      url: `${siteUrl}/services/mug-printing`,
      siteName: "Visriva Live Station",
    },
  };
}

export default async function MugPrintingPage() {
  const catalog = await getPublishedCatalog();
  const services = catalog.servicesIn("ai-merchandise").slice(0, 3);

  return (
    <>
      <MugPrintingServiceJsonLd />
      <InventoryPage
        eyebrow="Live keepsakes · Mug printing"
        title="Live Mug Printing Station in"
        accent="Bengaluru."
        description="Delight your guests with personalized ceramic mugs printed live at your event. A memorable, high-value keepsake ideal for corporate gifting and special celebrations."
        heroImage="/images/concert.jpg"
        heroAlt="Guests at an evening corporate celebration"
        introTitle="A mug they'll reach for every morning."
        intro="Our live sublimation station handles design selection, print, and press on the floor—built for corporate milestones, product launches, VIP wedding favors, and milestone celebrations."
        highlights={highlights}
        services={services}
        locationLine="Bengaluru based · Events across India"
        closingTitle="Put your brand on something they use daily."
        closingCopy="Share your event date, guest count, and artwork needs. We'll scope a live mug activation that fits throughput and venue layout."
      />
      <MugPrintingTopicalSeoSection />
      <MugPrintingFaq />
      <ServiceSiloLinks omitHref="/services/mug-printing" />
      <PricingEstimatorSection defaultStation="mug-printing" />
      <section className="bg-[#DCE9D8] px-5 pb-16 sm:px-8 lg:px-12">
        <PolicyStrip />
      </section>
    </>
  );
}