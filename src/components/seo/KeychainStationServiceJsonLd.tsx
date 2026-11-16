import { phoneDisplay, siteUrl } from "@/lib/site";

const FAQ = [
  {
    question: "How does the live keychain station work?",
    answer:
      "Guests get their photo taken or choose a design. We instantly print and assemble premium acrylic or metal keychains right at the station so they can take them home the same day.",
  },
  {
    question: "What materials and finishes are available?",
    answer:
      "We offer clear acrylic, metallic, and double-sided options with custom event branding frames and multiple attachment styles (split rings, chains, carabiners).",
  },
  {
    question: "Is the keychain station suitable for large corporate events?",
    answer:
      "Yes. We regularly run keychain stations for 200–1000+ guest corporate events and weddings across Bengaluru with dedicated crew and high-speed printers.",
  },
] as const;

const PAGE_PATH = "/services/keychain-station";

export function KeychainStationServiceJsonLd() {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const pageUrl = `${siteUrl}${PAGE_PATH}`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "Live Keychain Printing Station",
        url: pageUrl,
        description:
          "Interactive live keychain printing station that turns guest photos into premium custom keychains on the spot.",
        provider: {
          "@type": "LocalBusiness",
          name: "Visriva Live Station",
          url: siteUrl,
          image: `${siteUrl}/brand/visriva-logo.png`,
          ...(number ? { telephone: `+${number}` } : { telephone: phoneDisplay.replace(/\s/g, "") }),
          ...(email ? { email } : {}),
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bengaluru",
            addressRegion: "Karnataka",
            addressCountry: "IN",
          },
        },
        areaServed: { "@type": "City", name: "Bengaluru" },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export { FAQ as KEYCHAIN_STATION_FAQ };