import { PageHero } from "@/components/PageHero";
import { PolicyStrip } from "@/components/PolicyStrip";
import { StudioPageBridge } from "@/components/StudioPageBridge";
import { RateList } from "@/components/RateList";
import { GoldLink } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { servicesIn } from "@/lib/services";

export const metadata = pageMeta(
  "AI photo booth and DTF t-shirt printing Bangalore",
  "AI experience stations, canvas tote stamps, magnets, corporate PVC ID cards, and live DTF t-shirt printing for corporate events in Bangalore.",
  "/ai-merchandise",
);

const story = [
  { n: "01", title: "Prompt", body: "The AI station includes prompts written for your brand. Guests are not dropped into a generic filter." },
  { n: "02", title: "Stamp", body: "Canvas totes, stocked at 100 or 200. They leave with something they will carry on Monday." },
  { n: "03", title: "Keep", body: "Magnets and keychains in a run of 300. PVC cards at ₹120 each. Shirts on a live DTF press, quoted to the run." },
];

export default function AiMerchandisePage() {
  return (
    <main>
      <PageHero
        kicker="AI and merchandise"
        title="A portrait they can carry home."
        lede="AI stations and live merchandise, run by the same house as the booths. Custom prompts are included."
        image="/images/workshop.jpg"
        alt="A table set for a working session"
      />
      <section className="overflow-hidden py-16" aria-label="How a merchandise hour moves">
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 scrollbar-none sm:px-6 lg:px-10">
          {story.map((item) => (
            <article key={item.n} className="w-[85vw] shrink-0 snap-start border border-gold/30 bg-deep p-8 sm:w-[28rem]">
              <p className="type-eyebrow text-sm text-gold">{item.n}</p>
              <h2 className="type-display mt-4 text-5xl text-cream">{item.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-mist/85">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1500px] px-4 pb-16 sm:px-6 lg:px-10">
        <RateList services={servicesIn("ai-merchandise")} />
      </section>
      <StudioPageBridge />

      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <PolicyStrip />
        <div className="mx-auto mt-10 max-w-[1500px]">
          <GoldLink href="/quote?services=ai-station">Add an AI station</GoldLink>
        </div>
      </section>
    </main>
  );
}
