import { getPublishedServices } from "@/lib/services-catalog";
import { siteUrl } from "@/lib/site";

export async function JsonLd() {
  const services = await getPublishedServices();
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Visriva",
    alternateName: "Visriva Live Station",
    description:
      "Visriva provides photo booths, AI merchandise, games, VR experiences, and live gifting stations for corporate events and celebrations. Based in Bengaluru, serving events across India.",
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    areaServed: ["Bengaluru", "India"],
    priceRange: "₹₹₹",
    ...(number ? { telephone: `+${number}` } : {}),
    sameAs: [
      process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      process.env.NEXT_PUBLIC_LINKEDIN_URL,
    ].filter(Boolean),
    knowsAbout: [
      "Corporate event photo booths",
      "AI photo experiences",
      "AI photo booths",
      "VR stations",
      "VR engagement experiences",
      "DTF t-shirt printing",
      "Live event merchandise",
      "Wedding photo booths",
      "Live magnet stations",
      "On-site keychain favours",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Visriva Experiences",
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
          }`,
        })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}