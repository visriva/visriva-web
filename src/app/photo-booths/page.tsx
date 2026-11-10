import { PageHero } from "@/components/PageHero";
import { PolicyStrip } from "@/components/PolicyStrip";
import { RateList } from "@/components/RateList";
import { GoldLink } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { getPublishedCatalog } from "@/lib/services-catalog";

export const metadata = pageMeta(
  "Corporate event photo booth Bangalore",
  "Instant iPad, DSLR, roaming, and mobile photo booths for corporate events in Bangalore. Starting from ₹15,000. Owned inventory, attended, end to end.",
  "/photo-booths",
);

export default async function PhotoBoothsPage() {
  const catalog = await getPublishedCatalog();
  const boothServices = catalog.servicesIn("photo-booths");

  return (
    <main>
      <PageHero
        kicker="Photo booths"
        title="Prints while the room is still warm."
        lede="Five ways to capture a corporate floor. Every booth is ours, attended, and priced as a starting figure."
        image="/images/reception.jpg"
        alt="Guests gathered at a corporate reception"
      />

      <section className="mx-auto grid max-w-[1500px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-5">
          <h2 className="font-display text-5xl italic leading-none text-cream">
            Fixed, roaming, or phone.
          </h2>
        </div>

        <div className="space-y-5 text-base leading-relaxed text-mist/85 lg:col-span-6 lg:col-start-7">
          <p>
            A starter iPad booth covers a shorter gathering: three hours and
            150 prints. The unlimited iPad and DSLR booths run four hours
            with the quota lifted.
          </p>
          <p>
            Roaming comes to the guest when the room is large. Mobile capture
            is the lighter build. Both are quoted inside a band, because the
            room changes the labour.
          </p>
          <p>
            Standard booth footprint is 8 × 8 ft, with a flat table and a
            power point within reach.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 pb-16 sm:px-6 lg:px-10">
        <RateList services={boothServices} />
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-10">
        <PolicyStrip />
        <div className="mx-auto mt-10 flex max-w-[1500px] justify-end">
          <GoldLink href="/quote?services=unlimited-dslr">
            Book a booth
          </GoldLink>
        </div>
      </section>
    </main>
  );
}