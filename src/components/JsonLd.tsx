import { getPublishedServices } from "@/lib/services-catalog";
import { brandLogoSrc, businessName, contactEmail, phoneTel, siteUrl } from "@/lib/site";

export async function JsonLd() {
  const services = await getPublishedServices();
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    alternateName: "Visriva",
    description:
      "Visriva Live Station runs photo booths, AI merchandise, games, and live gifting for corporate events and celebrations. Based in Bengaluru, travelling across India. Owned inventory. One team, end to end.",
    url: siteUrl,
    image: `${siteUrl}${brandLogoSrc}`,
    email: contactEmail,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    areaServed: ["Bengaluru", "India"],
    priceRange: "₹₹₹",
    telephone: phoneTel,
    knowsAbout: [
      "corporate event photo booths",
      "AI photo experiences",
      "VR stations",
      "DTF t-shirt printing",
      "live event merchandise",
      "wedding photo booth Bengaluru",
      "live magnet station",
      "on-site keychain favours",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Visriva stations",
      itemListElement: services
        .filter((service) => service.bookable !== false)
        .map((service) => ({
          "@type": "Offer",
          name: service.name,
          description: service.summary,
          priceCurrency: "INR",
          ...(service.fromPrice != null ? { price: service.fromPrice } : {}),
          ...(service.unitPrice ? { price: service.unitPrice } : {}),
          url: `${siteUrl}${service.category === "photo-booths" ? "/photo-booths" : service.category === "games" ? "/games-vr" : "/ai-merchandise"}`,
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
