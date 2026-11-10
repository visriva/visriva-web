import { InventoryPage } from "@/components/InventoryPage";
import { PolicyStrip } from "@/components/PolicyStrip";
import { pageMeta } from "@/lib/seo";
import { getPublishedCatalog } from "@/lib/services-catalog";

export const metadata = pageMeta(
  "VR Engagement and Gaming for Corporate Events in Bangalore",
  "Book hosted VR engagement stations, virtual reality gaming and interactive event games in Bangalore and across India. Immersive experiences for conferences, brand activations and company celebrations.",
  "/games-vr",
);

const highlights = [
  { number: "01", title: "Step inside", body: "Immersive headset experiences that give guests a genuine change of scene." },
  { number: "02", title: "Bring a crowd", body: "Quick-play challenges and hosted games that invite people to gather and take part." },
  { number: "03", title: "Crew included", body: "A managed station with guest guidance, resets and event-floor support." },
];

export default async function GamesPage() {
  const catalog = await getPublishedCatalog();
  return (
    <>
      <InventoryPage
        eyebrow="VR engagement · Interactive games"
        title="Make room"
        accent="for play."
        description="Bring virtual reality and live interactive games to your corporate event. Visriva creates hosted VR engagement stations and quick-play challenges for conferences, exhibitions, brand activations and celebrations in Bangalore and across India."
        heroImage="/images/concert.jpg"
        heroAlt="A live event floor with lights and an engaged audience"
        introTitle="A little friendly competition changes the energy of a room."
        intro="From virtual reality headsets to hands-on challenges, our games and VR stations give guests a reason to pause, participate and connect. We plan the setup around your venue and event flow, then host the station so your team can stay focused on the programme."
        highlights={highlights}
        services={catalog.servicesIn("games")}
        locationLine="Bengaluru based · Events across India"
        closingTitle="Give your guests a reason to jump in."
        closingCopy="Tell us about your event, the available space and the guest experience you want to create. We'll help you choose the right VR station or interactive game mix."
      />
      <section className="bg-[#DCE9D8] px-5 pb-16 sm:px-8 lg:px-12"><PolicyStrip /></section>
    </>
  );
}
