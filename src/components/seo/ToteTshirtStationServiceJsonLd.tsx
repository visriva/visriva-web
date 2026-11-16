import { phoneDisplay, siteUrl } from "@/lib/site";

const FAQ = [
  {
    question: "How does the live tote bag printing station work at corporate events?",
    answer:
      "Attendees choose their preferred designs or brand logos, and our live artisans expertly print them onto premium cotton tote bags right in front of them during the event.",
  },
  {
    question: "Can we include custom company logos for corporate gifting?",
    answer:
      "Absolutely! We specialize in custom corporate activations, tailoring our screens, stamps, and designs to match your brand guidelines and event themes.",
  },
  {
    question: "What types of events are best suited for live apparel printing?",
    answer:
      "Our live tote and T-shirt printing stations are ideal for annual tech conferences, product launches, corporate galas, college fests, and experiential marketing pop-ups.",
  },
] as const;

const PAGE_PATH = "/services/tote-tshirt-station";

export function ToteTshirtStationServiceJsonLd() {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const pageUrl = `${siteUrl}${PAGE_PATH}`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "Live Tote Bag and T-Shirt Printing Station",
        url: pageUrl,
        description:
          "Custom experiential live merchandise printing stations featuring tote bags and T-shirts for top corporate brands.",
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

export { FAQ as TOTE_TSHIRT_STATION_FAQ };