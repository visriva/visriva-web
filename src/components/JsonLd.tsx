import { getPublishedServices } from "@/lib/services-catalog";
import { siteUrl } from "@/lib/site";

export async function JsonLd() {
  const services = await getPublishedServices();
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL;
  const businessId = `${siteUrl}/#business`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": businessId,
        name: "Visriva",
        alternateName: "Visriva Live Station",
        url: siteUrl,
        logo: `${siteUrl}/brand/visriva-logo.png`,
        image: `${siteUrl}/brand/visriva-logo.png`,
        description: "Visriva plans and operates photo booth rentals, AI photo booth experiences, live event merchandise, VR engagement and interactive event stations for corporate events, weddings and celebrations in Bengaluru and across India.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bengaluru",
          addressRegion: "Karnataka",
          addressCountry: "IN"
        },
        areaServed: [
          { "@type": "City", name: "Bengaluru" },
          { "@type": "Country", name: "India" }
        ],
        priceRange: "₹₹₹",
        ...(number ? { telephone: `+${number}` } : {}),
        sameAs: [instagram, linkedin].filter(Boolean),
        knowsAbout: [
          "Photo booth rental for events",
          "AI photo booth experiences",
          "Corporate event engagement",
          "Virtual reality event stations",
          "VR gaming for corporate events",
          "Live DTF t-shirt printing",
          "Custom tote bag stations",
          "Live event merchandise",
          "Photo magnet and keychain stations"
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Visriva Event Experiences",
          itemListElement: services
            .filter((service) => service.bookable !== false)
            .map((service) => ({
              "@type": "Offer",
              name: service.name,
              description: service.summary,
              priceCurrency: "INR",
              ...(service.fromPrice != null ? { price: service.fromPrice } : {}),
              ...(service.unitPrice != null ? { price: service.unitPrice } : {}),
              url: `${siteUrl}${
                service.category === "photo-booths"
                  ? "/photo-booths"
                  : service.category === "games"
                    ? "/games-vr"
                    : "/ai-merchandise"
              }`
            }))
        }
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Visriva",
        publisher: { "@id": businessId },
        inLanguage: "en-IN"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
