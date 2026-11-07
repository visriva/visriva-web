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
import { Eyebrow, GoldLink, Plate } from "@/components/ui";
import { categoryMeta, servicesIn } from "@/lib/services";
import { MoodRibbon } from "@/components/MoodRibbon";
import { MoodSection } from "@/components/MoodSection";
import { OccasionStrip } from "@/components/snap/OccasionStrip";
import { moodForCategory } from "@/lib/moods";
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
        <MoodSection mood="chimela" className="-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <StatsBar />
        </MoodSection>
      </div>

      <MoodRibbon />

      <section className="snap-canvas px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-royal text-[0.62rem] uppercase tracking-[0.28em] text-[#1a1a1a]/55">
              Weddings · corporate · parties
            </p>
            <h2 className="mt-2 font-display text-3xl italic text-[#1a1a1a] sm:text-4xl">
              Pick the room. We bring the stations.
            </h2>
          </div>
          <OccasionStrip />
        </div>
      </section>

      <div className="mt-16 overflow-hidden border-y border-gold/20 py-4 mood-canvas mood-aurelia" aria-hidden>
        <div className="marquee-track gap-10">
          {Array.from({ length: 2 }).map((_, copy) => (
            <p key={copy} className="type-display-italic flex gap-10 text-3xl text-gold/75">
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

      <section id="experiences" className="section-frame scroll-mt-28 px-4 py-28 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <Eyebrow>Three houses</Eyebrow>
            <h2 className="type-display-italic mt-5 max-w-3xl text-5xl leading-[0.94] text-cream sm:text-7xl">
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
                  <Link
                    href={meta.href}
                    className="group relative block min-h-[26rem] overflow-hidden border border-gold/20 shadow-[inset_0_0_0_1px_rgba(201,162,39,0.05)] transition duration-700 hover:border-gold/45 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                  >
                    <Plate src={house.image} alt={house.alt} className="absolute inset-0 transition duration-700 group-hover:scale-105" />
                    <div className="relative z-10 flex h-full min-h-[26rem] flex-col justify-end p-4 sm:p-5">
                      <div className={`mood-panel mood-${moodForCategory(house.key)} p-6 sm:p-7`}>
                        <p className="type-eyebrow opacity-80">{meta.kicker}</p>
                        <h3 className={`mood-logotype mood-logotype-${moodForCategory(house.key)} mt-3 text-4xl sm:text-5xl`}>
                          {meta.label}
                        </h3>
                        <p className="mt-3 max-w-md text-sm font-light leading-relaxed opacity-92">{house.text}</p>
                        <p className="mt-5 text-sm font-medium opacity-90">
                          {from ? `From ${from.priceLabel.replace("Starting ", "")}` : "Custom quote"}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <MoodSection mood="aurelia" id="floor" className="scroll-mt-28">
        <EventBuilder />
      </MoodSection>
      <MoodSection mood="chimela">
        <StationShowcase />
      </MoodSection>
      <MoodSection mood="suster-selly">
        <GuestMoments films={loops} />
      </MoodSection>

      <MoodSection mood="beli" className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>The night</Eyebrow>
            <h2 className="type-display-italic mt-5 text-5xl leading-none text-cream">
              How a Visriva floor is run.
            </h2>
          </div>
          <ol className="lg:col-span-8">
            {processSteps.map((step) => (
              <li key={step.n} className="grid grid-cols-[auto_1fr] gap-6 border-t border-gold/25 py-7">
                <span className="font-royal text-sm text-gold">{step.n}</span>
                <div>
                  <h3 className="type-display mt-2 text-4xl text-cream">{step.title}</h3>
                  <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-mist/88">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </MoodSection>

      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <PolicyStrip />
      </section>

      <MoodSection mood="nogams" className="px-4 py-24 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-8 px-6 py-14 sm:px-12 lg:flex-row lg:items-end">
          <div>
            <p className="mood-logotype mood-logotype-nogams text-4xl sm:text-5xl">The brief</p>
            <h2 className="type-display-italic mt-5 max-w-xl text-5xl leading-none sm:text-6xl">
              Send what you know. We will price the rest.
            </h2>
          </div>
          <GoldLink href="/quote">Request a quote</GoldLink>
        </div>
      </MoodSection>
    </main>
  );
}
