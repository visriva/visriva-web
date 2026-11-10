import { InventoryPage } from "@/components/InventoryPage";
import { PolicyStrip } from "@/components/PolicyStrip";
import { pageMeta } from "@/lib/seo";
import { getPublishedCatalog } from "@/lib/services-catalog";

export const metadata = pageMeta(
  "AI Photo Experiences and Live Event Merchandise in Bangalore",
  "Bring AI photo experiences, custom tote bag printing, live DTF T-shirt printing, magnets, keychains and branded keepsakes to corporate events in Bangalore and across India.",
  "/ai-merchandise",
);

const highlights = [
  { number: "01", title: "Create", body: "AI portraits and custom prompts designed around your brand or celebration." },
  { number: "02", title: "Customise", body: "Live merchandise stations where guests make something personal." },
  { number: "03", title: "Carry it forward", body: "Useful, memorable keepsakes that keep your event present after the day." },
];

export default async function AiMerchandisePage() {
  const catalog = await getPublishedCatalog();
  return (
    <>
      <InventoryPage
        eyebrow="AI experiences · Live merchandise"
        title="Make it"
        accent="personal."
        description="Turn guest participation into something they can take home. Visriva brings AI photo experiences, custom merchandise, live DTF T-shirt printing, tote bag stations and personalised keepsakes to corporate events, brand activations and celebrations."
        heroImage="/images/workshop.jpg"
        heroAlt="A creative team working together around a table"
        introTitle="A keepsake is better when guests help make it."
        intro="Our AI and live merchandise stations combine creative direction with hands-on participation. Guests can create an AI portrait, customise a canvas tote, watch a T-shirt come off the DTF press or take home a personalised event keepsake. Each station is planned around your audience, brand and event format."
        highlights={highlights}
        services={catalog.servicesIn("ai-merchandise")}
        locationLine="Bengaluru based · Events across India"
        closingTitle="Give guests something made just for them."
        closingCopy="Share your event theme, brand guidelines and expected guest count. We'll help you build a live merchandise and AI experience that feels connected to your celebration."
      />
      <section className="bg-[#DCE9D8] px-5 pb-16 sm:px-8 lg:px-12"><PolicyStrip /></section>
    </>
  );
}
