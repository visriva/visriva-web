import { PageHero } from "@/components/PageHero";
import { GoldLink, Plate } from "@/components/ui";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getWebsitePage } from "@/lib/website-pages";
import { audiences, processSteps } from "@/lib/site";

export const metadata = pageMeta(
  "About Visriva, Bengaluru event experience team",
  "Meet Visriva, a Bengaluru event experience team delivering hosted photo booths, AI photo experiences, live merchandise and VR stations for corporate events and celebrations.",
  "/about",
);

const pillars = [
  { title: "End to end", body: "We do not assemble a night from rented fragments. The brief, the plan, the load-in, and the wrap sit with one team." },
  { title: "Owned inventory", body: "Booths, printers, presses, headsets, and games are in our store. Multiple setups can run on the same date because the kit is ours." },
  { title: "The record", body: "The work has sat inside technology launches, finance offsites, and consumer-brand nights across Bengaluru. The names stay with the clients. The standard does not." },
];

export default async function AboutPage() {\n  const pageContent = await getWebsitePage("about");
  return (
    <main>
      <PageHero
        kicker="The house"
        title="One standard, from the first print to the last headset."
        lede="Visriva Live Station is a Bengaluru house for corporate floors and celebrations. We own the stations and we staff them."
        image="/images/hero.jpg"
        alt="A full corporate reception prepared for a guest experience"
      />
      <section className="mx-auto grid max-w-[1500px] gap-8 px-4 py-20 sm:px-6 lg:grid-cols-3 lg:px-10">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="border-t border-gold/40 pt-6">
            <h2 className="type-display text-4xl text-cream">{pillar.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist/85">{pillar.body}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto grid max-w-[1500px] gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-10">
        {audiences.map((audience) => (
          <article key={audience.title} className="border border-gold/25 bg-white/[0.03] p-8 backdrop-blur-sm">
            <h2 className="type-display text-4xl text-cream">{audience.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist/85">{audience.copy}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto grid max-w-[1500px] items-center gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:px-10">
        <Plate src="/images/summit.jpg" alt="Delegates seated at a corporate summit" className="min-h-[28rem]" sizes="(min-width: 1024px) 45vw, 100vw" />
        <div>
          <p className="type-eyebrow">A Visriva date</p>
          <ol className="mt-6 space-y-6">
            {processSteps.map((step) => (
              <li key={step.n}>
                <p className="type-eyebrow text-gold">{step.n}</p>
                <h3 className="type-display mt-1 text-3xl text-cream">{step.title}</h3>
                <p className="mt-2 text-sm text-mist/80">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8"><GoldLink href="/quote">Start a brief</GoldLink></div>
        </div>
      </section>
    </main>
  );
}
