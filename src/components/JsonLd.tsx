import { services } from "@/lib/services";
import { siteUrl } from "@/lib/site";

export function JsonLd() {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Visriva",
    description:
      "Visriva runs photo booths, AI merchandise, and games for corporate events in Bengaluru. Owned inventory. One team, end to end.",
    url: siteUrl,
    image: `${siteUrl}/brand/visriva-green.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    areaServed: ["Bengaluru", "India"],
    priceRange: "₹₹₹",
    ...(number ? { telephone: `+${number}` } : {}),
    knowsAbout: [
      "corporate event photo booths",
      "AI photo experiences",
      "VR stations",
      "DTF t-shirt printing",
      "live event merchandise",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Visriva stations",
      itemListElement: services.map((service) => ({
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
