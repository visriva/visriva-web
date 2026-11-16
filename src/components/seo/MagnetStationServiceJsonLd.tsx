import { phoneDisplay, siteUrl } from "@/lib/site";

const FAQ = [
  {
    question: "How does the live fridge magnet station work at events?",
    answer:
      "Our professional photographers capture guests as they arrive or enjoy the celebration. Photos are instantly printed onto high-grade magnetic sheets, cut, and displayed on our live pickup wall.",
  },
  {
    question: "What is included in Visriva's magnet station package?",
    answer:
      "The setup includes dedicated on-ground crew, professional DSLR capture, high-speed magnet printers, custom event branding frames, and a beautifully arranged display wall.",
  },
  {
    question: "Do you travel out of station for live magnet activations?",
    answer:
      "Yes, we frequently handle destination weddings and luxury corporate retreats across Karnataka and surrounding regions (such as Chikmagalur and Mysore).",
  },
] as const;

const PAGE_PATH = "/services/magnet-station";

export function MagnetStationServiceJsonLd() {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const pageUrl = `${siteUrl}${PAGE_PATH}`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "Live Fridge Magnet Printing Station",
        url: pageUrl,
        description:
          "Interactive live fridge magnet printing stations for weddings, receptions, and corporate celebrations.",
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

export { FAQ as MAGNET_STATION_FAQ };