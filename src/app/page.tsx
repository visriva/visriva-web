import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { EventBuilder } from "@/components/EventBuilder";
import { GuestMoments } from "@/components/GuestMoments";
import { Hero } from "@/components/Hero";
import { PolicyStrip } from "@/components/PolicyStrip";
import { Reveal } from "@/components/Reveal";
import { StationShowcase } from "@/components/StationShowcase";
import { StatsBar } from "@/components/StatsBar";
import { GoldLink, Plate } from "@/components/ui";
import { categoryMeta, servicesIn } from "@/lib/services";
import { processSteps } from "@/lib/site";

const houses = [
  {
    key: "photo-booths" as const,
    image: "/images/reception.jpg",
    alt: "Guests at a corporate reception",
    text: "Instant prints, roaming capture, and phone booths. The souvenir is in their hand before the speech ends.",
  },
  {
    key: "ai-merchandise" as const,
    image: "/images/workshop.jpg",
    alt: "A working table ready for a make-station",
    text: "AI portraits, stamped totes, magnets, PVC cards, and live DTF shirts. Custom prompts included.",
  },
  {
    key: "games" as const,
    image: "/images/stage.jpg",
    alt: "A lit stage at a corporate programme",
    text: "A hosted VR station, plus the two games that still stop a corridor.",
  },
];

export default function HomePage() {
  const film = fs.existsSync(path.join(process.cwd(), "public/films/hero.mp4"));
  const loops = fs.existsSync(path.join(process.cwd(), "public/films/booth.mp4"));

  return (
    <main>
      <Hero film={film} />
      <div className="px-4 sm:px-6 lg:px-10">
        <StatsBar />
      </div>

      <div className="mt-16 overflow-hidden border-y border-gold/20 py-4" aria-hidden>
        <div className="marquee-track gap-10">
          {Array.from({ length: 2 }).map((_, copy) => (
            <p key={copy} className="flex gap-10 font-display text-3xl italic text-gold/80">
              {["Photo booths", "AI portraits", "Canvas totes", "PVC cards", "DTF shirts", "VR", "Baton", "Buzz wire"].map(
                (item) => (
                  <span key={`${copy}-${item}`} className="px-4">
                    {item}
                  </span>
                ),
              )}
            </p>
          ))}
        </div>
      </div>

      <section id="experiences" className="scroll-mt-28 px-4 py-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <p className="font-royal text-[0.68rem] uppercase tracking-[0.32em] text-gold">Three houses</p>
            <h2 className="mt-3 max-w-3xl font-display text-5xl italic leading-[0.92] text-cream sm:text-7xl">
              Booths, merch, and games. Not three vendors.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-12">
            {houses.map((house, index) => {
              const meta = categoryMeta[house.key];
              const from = servicesIn(house.key).find((service) => service.fromPrice != null);
              return (
                <Reveal
                  key={house.key}
                  delay={index * 90}
                  className={index === 0 ? "lg:col-span-7" : "lg:col-span-5"}
                >
                  <Link href={meta.href} className="group relative block min-h-[26rem] overflow-hidden border border-gold/25">
                    <Plate src={house.image} alt={house.alt} className="absolute inset-0 transition duration-700 group-hover:scale-105" />
                    <div className="relative z-10 flex h-full min-h-[26rem] flex-col justify-end p-7">
                      <p className="font-royal text-[0.62rem] uppercase tracking-[0.26em] text-gold">{meta.kicker}</p>
                      <h3 className="mt-2 font-display text-5xl italic text-cream">{meta.label}</h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-champagne/90">{house.text}</p>
                      <p className="mt-5 text-sm text-gold-2">
                        {from ? `From ${from.priceLabel.replace("Starting ", "")}` : "Custom quote"}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <EventBuilder />
      <StationShowcase />
      <GuestMoments films={loops} />

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-royal text-[0.68rem] uppercase tracking-[0.32em] text-gold">The night</p>
            <h2 className="mt-3 font-display text-5xl italic leading-none text-cream">How a Visriva floor is run.</h2>
          </div>
          <ol className="lg:col-span-8">
            {processSteps.map((step) => (
              <li key={step.n} className="grid grid-cols-[auto_1fr] gap-6 border-t border-gold/25 py-7">
                <span className="font-royal text-sm text-gold">{step.n}</span>
                <div>
                  <h3 className="font-display text-4xl italic text-cream">{step.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist/85">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <PolicyStrip />
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-8 border border-gold/30 bg-emerald/40 px-6 py-12 sm:px-12 lg:flex-row lg:items-end">
          <div>
            <p className="font-royal text-[0.68rem] uppercase tracking-[0.32em] text-gold">The brief</p>
            <h2 className="mt-3 max-w-xl font-display text-5xl italic leading-none text-cream sm:text-6xl">
              Send what you know. We will price the rest.
            </h2>
          </div>
          <GoldLink href="/quote">Request a quote</GoldLink>
        </div>
      </section>
    </main>
  );
}
