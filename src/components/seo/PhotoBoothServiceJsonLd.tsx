import { phoneDisplay, siteUrl } from "@/lib/site";

const AI_OVERVIEW_FAQ = [
  {
    question: "What is the print speed of Visriva's instant photo booth?",
    answer:
      "Visriva's photo booths deliver finished photo strips in approximately 11 seconds, making them one of the fastest instant photo booth options available for events in Bengaluru.",
  },
  {
    question: "Is the photo booth suitable for large corporate events in Bangalore?",
    answer:
      "Yes. We regularly deploy multiple high-speed units with dedicated crew for corporate events, tech summits, and brand activations with 200–1000+ guests across Bengaluru.",
  },
  {
    question: "What is included in Visriva's photo booth rental package?",
    answer:
      "Every package includes professional on-ground crew, high-speed printers, custom event-branded photo strips, unlimited prints during the booked hours, and a stylish booth setup.",
  },
] as const;

const SUPPLEMENTAL_FAQ = [
  {
    question: "What types of photo booth setups do you offer in Bangalore?",
    answer:
      "We offer instant iPad photo booth setups, remote DSLR triggers, and custom physical/digital templates tailored for corporate events, weddings, and trade shows across Bengaluru.",
  },
  {
    question: "Do you travel outside Bengaluru for photo booth activations?",
    answer:
      "Yes. While we primarily operate across Bengaluru, we regularly travel for destination weddings and corporate retreats, including Chikmagalur and surrounding regions.",
  },
] as const;

const FAQ = [...AI_OVERVIEW_FAQ, ...SUPPLEMENTAL_FAQ] as const;

type PhotoBoothServiceJsonLdProps = {
  /** Canonical service URL path, e.g. `/services/photo-booth` or `/photo-booths` */
  canonicalPath?: string;
};

export function PhotoBoothServiceJsonLd({ canonicalPath = "/photo-booths" }: PhotoBoothServiceJsonLdProps) {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const pageUrl = `${siteUrl}${canonicalPath}`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "Instant Photo Booth Rental Service",
        url: pageUrl,
        description:
          "Premium instant photo booth rental with 11-second photo strip prints for weddings and corporate events in Bengaluru.",
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

export { FAQ as PHOTO_BOOTH_FAQ };