import { PageHero } from "@/components/PageHero";
import { PolicyStrip } from "@/components/PolicyStrip";
import { GoldLink, Plate } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { getService } from "@/lib/services";

export const metadata = pageMeta(
  "VR station for corporate events India",
  "Hosted VR stations, Catch the Baton, and Buzz the Wire for corporate events in India. Bengaluru crews, owned inventory, starting from ₹6,000.",
  "/games-vr",
);

export default function GamesPage() {
  const vr = getService("vr-station");
  const baton = getService("catch-baton");
  const wire = getService("buzz-wire");
  if (!vr || !baton || !wire) return null;

  return (
    <main>
      <PageHero
        mood="sansdiego"
        kicker="Games and VR"
        title="A queue, a headset, a reset."
        lede="Play stations for a corporate floor. Hosted, compact, and run by the same crew as the booth."
        image="/images/stage.jpg"
        alt="A lit stage during a corporate programme"
      />
      <section className="mx-auto grid max-w-[1500px] gap-6 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-10">
        <article className="relative min-h-[32rem] overflow-hidden border border-gold/30 lg:col-span-7">
          <Plate src={vr.image} alt="" className="absolute inset-0" />
          <div className="relative z-10 flex h-full min-h-[32rem] flex-col justify-end p-8">
            <p className="font-royal text-[0.62rem] uppercase tracking-[0.24em] text-gold">{vr.footprint}</p>
            <h2 className="mt-2 font-display text-6xl italic text-cream">{vr.name}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-champagne/90">{vr.summary}</p>
            <p className="mt-6 text-xl text-gold-2">{vr.priceLabel}</p>
          </div>
        </article>
        <div className="grid gap-6 lg:col-span-5">
          {[baton, wire].map((game) => (
            <article key={game.id} className="flex flex-1 flex-col justify-between border border-gold/30 bg-deep p-7">
              <div>
                <p className="font-royal text-[0.62rem] uppercase tracking-[0.24em] text-gold">{game.footprint}</p>
                <h2 className="mt-3 font-display text-4xl italic text-cream">{game.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-mist/85">{game.summary}</p>
              </div>
              <p className="mt-6 text-lg text-gold-2">{game.priceLabel}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <PolicyStrip />
        <div className="mx-auto mt-10 max-w-[1500px]">
          <GoldLink href="/quote?services=vr-station,buzz-wire">Add games to the brief</GoldLink>
        </div>
      </section>
    </main>
  );
}
