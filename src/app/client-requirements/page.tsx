import { ArFootprint } from "@/components/ArFootprint";
import { RequirementsList } from "@/components/RequirementsList";
import { GoldLink } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Client requirements for a Visriva booking",
  "What a Bengaluru venue must arrange before a Visriva station day: power, a flat table, outdoor cover, vehicle access, and venue rules.",
  "/client-requirements",
);

export default function RequirementsPage() {
  return (
    <main className="px-4 pb-24 pt-32 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-royal text-[0.68rem] uppercase tracking-[0.32em] text-gold">Before the date</p>
          <h1 className="mt-4 font-display text-6xl italic leading-[0.9] text-cream sm:text-7xl">
            What you arrange. What we bring.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-mist/85">
            We arrive with the stations and the crew. The room has to be ready to receive them. Tick each line once it is true.
          </p>
          <div className="mt-8">
            <GoldLink href="/quote">Continue to the quote</GoldLink>
          </div>
        </div>
        <div className="lg:col-span-7">
          <RequirementsList />
        </div>
      </div>
      <section className="mx-auto mt-20 max-w-[1500px]">
        <p className="font-royal text-[0.68rem] uppercase tracking-[0.32em] text-gold">See it at your venue</p>
        <h2 className="mt-3 max-w-xl font-display text-5xl italic text-cream">An 8 × 8 ft frame on your camera.</h2>
        <div className="mt-8 max-w-3xl">
          <ArFootprint />
        </div>
      </section>
    </main>
  );
}
