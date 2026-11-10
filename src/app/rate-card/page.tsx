import { PageHero } from "@/components/PageHero";
import { PolicyStrip } from "@/components/PolicyStrip";
import { RateList } from "@/components/RateList";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getWebsitePage } from "@/lib/website-pages";
import { getPublishedCatalog } from "@/lib/services-catalog";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWebsitePage("rate-card");
  return pageMeta(page?.seo_title || "Visriva event station prices and rate card Bengaluru", page?.seo_description || "Compare starting prices for Visriva photo booths, AI photo booth experiences, live tote and T-shirt merchandise, VR engagement and interactive event games. Request a tailored event quote.", "/rate-card");
}

export default async function RateCardPage() {
  const catalog = await getPublishedCatalog();
  return (
    <main>
      <PageHero
        kicker="The rate card"
        title="A clear starting point for every experience."
        lede="Browse the current station inventory and starting rates. Final pricing is confirmed around your event date, duration, guest count, venue and setup."
        image="/images/workshop.jpg"
        alt="A live merchandise and event customisation station"
      />
      <section className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div><p className="section-kicker">Current inventory</p><h2 className="mt-3 font-display text-5xl text-[#294937]">Choose your experience.</h2></div>
          <p className="max-w-md text-xs leading-6 text-[#718574]">Prices shown are starting figures before applicable GST and transit. Items marked coming soon are not currently bookable.</p>
        </div>
        <RateList services={catalog.list}/>
      </section>
      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <PolicyStrip/>
        <div className="mx-auto mt-10 flex max-w-[1500px] flex-wrap items-center justify-between gap-5 rounded-2xl border border-[#cbdcc7] bg-[#f8f7ef] p-6 sm:p-8">
          <div><p className="section-kicker">Ready to plan?</p><h2 className="mt-2 font-display text-3xl text-[#294937]">Build your event brief.</h2></div>
          <a href="/quote" className="liquid-button rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[.14em]">Start booking ↗</a>
        </div>
      </section>
    </main>
  );
}
