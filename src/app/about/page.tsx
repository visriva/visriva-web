import { PageHero } from "@/components/PageHero";
import { GoldLink, Plate } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { processSteps } from "@/lib/site";

export const metadata = pageMeta(
  "About Visriva, Bengaluru",
  "Visriva is a Bengaluru house for corporate event stations. End to end, not piecemeal. Owned inventory and one crew for booths, merchandise, and games.",
  "/about",
);

const pillars = [
  {
    title: "End to end",
    body: "We do not assemble a night from rented fragments. The brief, the plan, the load-in, and the wrap sit with one team.",
  },
  {
    title: "Owned inventory",
    body: "Booths, printers, presses, headsets, and games are in our store. Multiple setups can run on the same date because the kit is ours.",
  },
  {
    title: "The record",
    body: "The work has sat inside technology launches, finance offsites, and consumer-brand nights across Bengaluru. The names stay with the clients. The standard does not.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        kicker="The house"
        title="One standard, from the first print to the last headset."
        lede="Visriva is a Bengaluru studio for corporate floors. We own the stations and we staff them."
        image="/images/hero.jpg"
        alt="A full corporate reception"
      />
      <section className="mx-auto grid max-w-[1500px] gap-8 px-4 py-20 sm:px-6 lg:grid-cols-3 lg:px-10">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="border-t border-gold/40 pt-6">
            <h2 className="font-display text-4xl italic text-cream">{pillar.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist/85">{pillar.body}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto grid max-w-[1500px] items-center gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:px-10">
        <Plate
          src="/images/summit.jpg"
          alt="Delegates at a corporate summit"
          className="min-h-[28rem]"
          sizes="(min-width: 1024px) 45vw, 100vw"
        />
        <div>
          <p className="font-royal text-[0.68rem] uppercase tracking-[0.28em] text-gold">A Visriva date</p>
          <ol className="mt-6 space-y-6">
            {processSteps.map((step) => (
              <li key={step.n}>
                <p className="font-royal text-[0.62rem] tracking-[0.22em] text-gold">{step.n}</p>
                <h3 className="mt-1 font-display text-3xl italic text-cream">{step.title}</h3>
                <p className="mt-2 text-sm text-mist/80">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <GoldLink href="/quote">Start a brief</GoldLink>
          </div>
        </div>
      </section>
    </main>
  );
}
