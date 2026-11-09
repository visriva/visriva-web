import { PageHero } from "@/components/PageHero";
import { PolicyStrip } from "@/components/PolicyStrip";
import { RateList } from "@/components/RateList";
import { BookingInclusions } from "@/components/snap/BookingInclusions";
import { BoothPricingTiers } from "@/components/snap/BoothPricingTiers";
import { OccasionStrip } from "@/components/snap/OccasionStrip";
import { PrintFormats } from "@/components/snap/PrintFormats";
import { RentPaths } from "@/components/snap/RentPaths";
import { StationSpecs } from "@/components/snap/StationSpecs";
import { StudioPageBridge } from "@/components/StudioPageBridge";
import { WhyVisriva } from "@/components/snap/WhyVisriva";
import { MoodSection } from "@/components/MoodSection";
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
        kicker="Bengaluru, India"
        title="Where the room meets the print."
        lede="Premium instant booths for weddings, corporate floors, and private celebrations — attended, branded, and priced clearly from the first quote."
        image="/images/reception.jpg"
        alt="Guests gathered at a corporate reception"
      />

      <section className="mx-auto max-w-[1500px] px-4 py-20 sm:px-6 lg:px-10">
        <p className="type-eyebrow">Two ways in</p>
        <h2 className="type-display-italic mt-4 text-5xl leading-none text-cream sm:text-6xl">Rent it. Stack it.</h2>
        <div className="mt-10">
          <RentPaths />
        </div>
      </section>

      <section className="snap-canvas px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <p className="type-eyebrow">The station</p>
          <h2 className="type-display mt-4 max-w-2xl text-4xl sm:text-5xl">
            Owned gear. Built for long runs on an Indian floor.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist/88">
            DSLR or iPad capture, dye-sublimation printing, and custom welcome screens — the same house that
            runs your merch and games.
          </p>
          <div className="mt-10">
            <StationSpecs />
          </div>
        </div>
      </section>

      <MoodSection mood="balmonte" className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <p className="type-eyebrow">What ships every time</p>
          <h2 className="type-display mt-4 text-4xl sm:text-5xl">Every booking fully loaded</h2>
          <p className="mt-4 max-w-xl text-base font-light opacity-88">
            Setup, attendant, branded frame, and sharing — included in every package below.
          </p>
          <div className="mt-12">
            <BookingInclusions />
          </div>
        </div>
      </MoodSection>

      <section id="packages" className="snap-canvas scroll-mt-28 px-4 py-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <p className="type-eyebrow">Rental packages</p>
          <h2 className="type-display mt-4 text-5xl sm:text-6xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 max-w-xl text-base text-mist/88">
            Starting figures before GST and Bengaluru transit. Custom frames and welcome screens included.
          </p>
          <div className="mt-12">
            <BoothPricingTiers />
          </div>
          <p className="mt-10 text-sm text-mist/80">
            Need mobile capture or a roaming line?{" "}
            <a href="/quote?services=mobile-capture" className="text-gold-2 underline decoration-gold underline-offset-4">
              Get a custom quote →
            </a>
          </p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <p className="type-eyebrow">Print options</p>
          <h2 className="type-display-italic mt-4 text-4xl text-cream sm:text-5xl">Two formats, one memory</h2>
          <p className="mt-4 max-w-lg text-base text-mist/85">
            Dye-sublimation colour that holds up after the event — strips for favours, postcards for desks.
          </p>
          <div className="mt-10">
            <PrintFormats />
          </div>
        </div>
      </section>

      <section className="snap-canvas px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <p className="type-eyebrow">Perfect for every occasion</p>
          <h2 className="type-display mt-4 text-4xl sm:text-5xl">
            We show up where you celebrate
          </h2>
          <div className="mt-8">
            <OccasionStrip />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-20 sm:px-6 lg:px-10">
        <p className="type-eyebrow">Why Visriva</p>
        <h2 className="type-display-italic mt-4 max-w-xl text-4xl text-cream sm:text-5xl">The house, not a broker</h2>
        <div className="mt-12">
          <WhyVisriva />
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 pb-16 sm:px-6 lg:px-10">
        <p className="type-eyebrow">Full rate card</p>
        <h2 className="type-display mt-4 text-3xl text-cream">Every booth SKU</h2>
        <div className="mt-10">
          <RateList services={boothServices} />
        </div>
      </section>

      <StudioPageBridge />

      <section className="px-4 pb-10 sm:px-6 lg:px-10">
        <PolicyStrip />
        <div className="mx-auto mt-10 flex max-w-[1500px] justify-end">
          <GoldLink href="/quote?services=unlimited-dslr">Book a booth</GoldLink>
        </div>
      </section>
    </main>
  );
}
