import { phoneDisplay, siteUrl } from "@/lib/site";

const FAQ = [
  {
    question: "How does live mug printing work at events?",
    answer:
      "Guests can choose their favorite designs, photos, or corporate logos, and our live sublimation station prints and presses the mugs on-site within minutes.",
  },
  {
    question: "Are the printed mugs microwave and dishwasher safe?",
    answer:
      "Yes! We use high-grade sublimation coatings and professional heat presses to ensure permanent, vibrant, and durable prints.",
  },
  {
    question: "What events are best for live mug printing stations?",
    answer:
      "Live mug printing is popular for corporate milestones, product launches, VIP wedding favors, and milestone celebrations across Bengaluru.",
  },
] as const;

const PAGE_PATH = "/services/mug-printing";

export function MugPrintingServiceJsonLd() {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const pageUrl = `${siteUrl}${PAGE_PATH}`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "Live Mug Printing Station",
        url: pageUrl,
        description:
          "Custom live mug printing service delivering personalized ceramic mugs instantly at events.",
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

export { FAQ as MUG_PRINTING_FAQ };