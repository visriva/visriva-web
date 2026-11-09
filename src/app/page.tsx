import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { StatsBar } from "@/components/StatsBar";
import { GoldLink } from "@/components/ui";
import { categoryMeta, type ServiceCategory } from "@/lib/services";
import { getPublishedCatalog } from "@/lib/services-catalog";
import { processSteps } from "@/lib/site";

const houses: { key: ServiceCategory; image: string; description: string; tag: string }[] = [
  { key: "photo-booths", image: "/images/reception.jpg", tag: "Capture the moment", description: "Portraits, instant prints and roaming photo experiences that turn guests into part of the story." },
  { key: "ai-merchandise", image: "/images/workshop.jpg", tag: "Make it personal", description: "AI portraits and live customisation stations. Guests create something that feels uniquely theirs." },
  { key: "games", image: "/images/stage.jpg", tag: "Bring on the play", description: "VR and interactive challenges that spark a little friendly competition across the room." },
];

const benefits = [
  ["01", "One creative partner", "A single team plans, installs and runs your stations—so the experience feels connected from start to finish."],
  ["02", "Experiences people join", "Beautifully hosted stations invite guests in. No complicated instructions, no awkward waiting around."],
  ["03", "Keepsakes worth keeping", "Personalised prints and merchandise turn a great event into something guests take home."],
];

export default async function HomePage() {
  const catalog = await getPublishedCatalog();
  return (
    <main id="content" className="page-enter">
      <Hero />
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12"><StatsBar /></div>

      <section id="experiences" className="scroll-mt-28 px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div><p className="section-kicker">Find your kind of memorable</p><h2 className="display-heading mt-4 max-w-3xl text-6xl text-[#20211b] sm:text-7xl">Experiences that<br /><em className="text-[#a87824]">bring the room alive.</em></h2></div>
              <p className="max-w-sm text-sm leading-7 text-[#69675e]">From a single photo moment to a full floor of interactive stations, build an experience that fits your event.</p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {houses.map((house, index) => {
              const meta = categoryMeta[house.key];
              const services = catalog.servicesIn(house.key);
              const starting = services.find((service) => service.fromPrice != null);
              return (
                <Reveal key={house.key} delay={index * 100}>
                  <Link href={meta.href} className="image-card group block">
                    <div className="relative aspect-[.88] overflow-hidden rounded-[1.5rem] bg-[#e5ddcf]">
                      <Image src={house.image} alt={meta.label} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                        <p className="text-[.62rem] font-semibold uppercase tracking-[.2em] text-white/80">{house.tag}</p>
                        <h3 className="mt-3 font-display text-5xl leading-none">{meta.label}</h3>
                        <p className="mt-3 max-w-sm text-sm leading-6 text-white/85">{house.description}</p>
                        <div className="mt-6 flex items-center justify-between border-t border-white/30 pt-4 text-xs">
                          <span>{starting ? `From ${starting.priceLabel.replace("Starting ", "")}` : "Made to measure"}</span><span className="text-lg transition group-hover:translate-x-1">↗</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#22251e] py-5 text-white">
        <div className="marquee-track gap-10">{Array.from({length:2}).map((_,copy)=><p key={copy} className="flex shrink-0 gap-10 text-xs font-semibold uppercase tracking-[.22em] text-[#e9d6a9]">{["AI photo experiences","Live merchandise","Instant keepsakes","VR engagement","Interactive games","Brand activations"].map(item=><span key={item} className="px-5">{item} <span className="ml-8 text-[#c69b4b]">✳</span></span>)}</p>)}</div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded-[1.5rem] bg-[#ded5c6]">
            <Image src="/images/party.jpg" alt="Guests enjoying an event experience" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <div className="absolute bottom-5 left-5 rounded-xl bg-[#fffdf8]/95 px-5 py-4 shadow-lg"><p className="section-kicker">The Visriva difference</p><p className="mt-1 font-display text-2xl text-[#22221c]">Thoughtful details.<br />Seamless execution.</p></div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="section-kicker">More than a station</p>
            <h2 className="display-heading mt-4 text-6xl text-[#20211b] sm:text-7xl">A better kind of<br /><em className="text-[#a87824]">event energy.</em></h2>
            <div className="mt-9 divide-y divide-[#ddd5c8] border-y border-[#ddd5c8]">
              {benefits.map(([n,title,body])=><article key={n} className="grid grid-cols-[48px_1fr] gap-4 py-5"><span className="pt-1 text-xs font-semibold text-[#a87824]">{n}</span><div><h3 className="font-semibold text-[#292a23]">{title}</h3><p className="mt-2 max-w-lg text-sm leading-7 text-[#69675e]">{body}</p></div></article>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eae4d9] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="section-kicker">Simple from day one</p><h2 className="display-heading mt-4 text-6xl text-[#20211b] sm:text-7xl">From first idea<br /><em className="text-[#a87824]">to final encore.</em></h2></div><p className="max-w-sm text-sm leading-7 text-[#69675e]">A clear process keeps the planning easy and the event running smoothly.</p></div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {processSteps.map((step,index)=><article key={step.n} className="border-t border-[#cfc5b4] pt-6"><span className="text-xs font-semibold text-[#a87824]">{step.n}</span><h3 className="mt-4 font-display text-4xl text-[#25251f]">{step.title}</h3><p className="mt-3 text-sm leading-7 text-[#66645b]">{step.body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-8 overflow-hidden rounded-[1.75rem] bg-[#24271f] px-7 py-14 text-white sm:px-12 lg:flex-row lg:items-end">
          <div><p className="text-[.65rem] font-semibold uppercase tracking-[.22em] text-[#d2b574]">Let's make it memorable</p><h2 className="display-heading mt-4 max-w-3xl text-6xl sm:text-7xl">Your event deserves<br /><em className="text-[#e0c58b]">a little more wonder.</em></h2><p className="mt-5 max-w-lg text-sm leading-7 text-white/70">Tell us what you are planning. We'll help you find the right mix of experiences for your guests.</p></div>
          <GoldLink href="/quote" className="shrink-0 bg-[#e2c27b] text-[#25251e] hover:bg-white">Start your event brief ↗</GoldLink>
        </div>
      </section>
    </main>
  );
}
