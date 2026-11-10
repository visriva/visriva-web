import { InventoryPage } from "@/components/InventoryPage";
import { PolicyStrip } from "@/components/PolicyStrip";
import { pageMeta } from "@/lib/seo";
import { getPublishedCatalog } from "@/lib/services-catalog";

export const metadata = pageMeta(
  "Photo Booth Rental and AI Photo Booth in Bangalore",
  "Explore corporate event photo booth rentals in Bangalore, including instant iPad, DSLR, roaming, mobile capture and AI photo booth experiences for conferences, weddings and brand activations.",
  "/photo-booths",
);

const highlights = [
  { number: "01", title: "Capture", body: "A polished photo moment, from classic instant prints to AI-powered transformations." },
  { number: "02", title: "Personalise", body: "Frames, creative direction and event-led details that make each output feel considered." },
  { number: "03", title: "Take it home", body: "A tangible keepsake guests can carry away long after the event ends." },
];

export default async function PhotoBoothsPage() {
  const catalog = await getPublishedCatalog();
  return (
    <>
      <InventoryPage
        eyebrow="Photo booths · AI photo experiences"
        title="Keep the"
        accent="good moments."
        description="Photo booth rentals in Bangalore for corporate events, weddings and celebrations. Choose instant iPad and DSLR prints, roaming photography, mobile capture or an AI Photo Booth that turns guest portraits into personalised keepsakes."
        heroImage="/images/party.jpg"
        heroAlt="Guests celebrating together at a lively event"
        introTitle="A photo experience should feel like part of the celebration."
        intro="Visriva's photo booth stations are designed to bring guests together, not pull them away from the event. From classic instant photo booth rentals to AI photo transformations, our team helps shape the capture style, guest flow and keepsake around your occasion."
        highlights={highlights}
        services={catalog.servicesIn("photo-booths")}
        locationLine="Bengaluru based · Events across India"
        closingTitle="Make a moment worth keeping."
        closingCopy="Tell us your event date, venue and guest count. We'll recommend a photo booth experience that fits the room and the kind of memory you want guests to take home."
      />
      <section className="bg-[#DCE9D8] px-5 pb-16 sm:px-8 lg:px-12"><PolicyStrip /></section>
    </>
  );
}
