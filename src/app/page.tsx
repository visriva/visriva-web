import Image from "next/image";
import Link from "next/link";
import { ExperienceDeck } from "@/components/ExperienceDeck";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { StatsBar } from "@/components/StatsBar";
import { RateList } from "@/components/RateList";
import { getPublishedCatalog } from "@/lib/services-catalog";
import { processSteps } from "@/lib/site";

const promises = [
  { n: "01", title: "One creative partner", body: "A single team plans, installs and runs your stations, so every touchpoint feels connected." },
  { n: "02", title: "Experiences people join", body: "Thoughtful hosting and simple interactions invite every guest to take part." },
  { n: "03", title: "Keepsakes worth keeping", body: "Personalised prints and merchandise turn a brilliant event into a memory guests can take home." },
];

export default async function HomePage() {
  const catalog = await getPublishedCatalog();
  const featured = ["unlimited-dslr", "ai-station", "vr-station"].map((id) => catalog.getService(id)).filter((item) => item && item.bookable !== false);
  return (
    <main id="content" className="page-enter bg-[#e6efe3]">
      <Hero />
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12"><StatsBar /></div>

      <ExperienceDeck services={catalog.list} />

      <section className="bg-[#f8f7ef] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] items-center gap-12 lg:grid-cols-[.95fr_1.05fr]">
          <Reveal className="relative">
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white shadow-[0_24px_70px_rgba(39,67,48,.13)] sm:min-h-[540px]">
              <Image src="/images/party.jpg" alt="Guests enjoying an event experience" fill sizes="(min-width:1024px) 48vw,100vw" className="object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#173d2b]/65 via-transparent to-transparent"/>
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/65 bg-[#f8f7ef]/90 p-5 shadow-xl backdrop-blur-xl sm:right-auto sm:max-w-sm"><p className="section-kicker">The Visriva difference</p><p className="mt-2 font-display text-3xl leading-none text-[#294937]">Beautifully designed.<br/>Thoughtfully delivered.</p></div>
            </div>
          </Reveal>
          <div className="flex flex-col justify-center">
            <Reveal><p className="section-kicker">More than a station</p><h2 className="display-heading mt-4 text-6xl text-[#244936] sm:text-7xl">Bring people<br/><em className="gold-gradient">into the moment.</em></h2><p className="mt-6 max-w-xl text-base leading-8 text-[#667b6b]">The right event experience gives guests a reason to connect. We combine creative concepts, reliable equipment and on-ground hosting to make that happen.</p></Reveal>
            <div className="mt-8 divide-y divide-[#d5e0d1] border-y border-[#d5e0d1]">
              {promises.map((item,index)=><Reveal key={item.n} delay={index*80}><article className="grid grid-cols-[48px_1fr] gap-4 py-5"><span className="pt-1 text-xs font-bold text-[#a88f3e]">{item.n}</span><div><h3 className="font-semibold text-[#294937]">{item.title}</h3><p className="mt-2 max-w-lg text-sm leading-7 text-[#718574]">{item.body}</p></div></article></Reveal>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#dce9d8] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="section-kicker">Popular starting points</p><h2 className="display-heading mt-4 text-6xl text-[#244936] sm:text-7xl">Start with a<br/><em className="gold-gradient">guest favourite.</em></h2></div><p className="max-w-sm text-sm leading-7 text-[#667b6b]">A few popular stations to help you start your brief. We can tailor the final mix to your event.</p></div>
          <div className="mt-10"><RateList services={featured}/></div>
          <div className="mt-8 flex justify-end"><Link href="/quote" className="liquid-button inline-flex rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[.15em]">Build your event brief ↗</Link></div>
        </div>
      </section>

      <section className="bg-[#f8f7ef] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="section-kicker">Simple from day one</p><h2 className="display-heading mt-4 text-6xl text-[#244936] sm:text-7xl">From first idea<br/><em className="gold-gradient">to final encore.</em></h2></div><p className="max-w-sm text-sm leading-7 text-[#667b6b]">A clear process keeps planning easy and lets you focus on your guests.</p></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {processSteps.map((step,index)=><Reveal key={step.n} delay={index*90}><article className="h-full rounded-2xl border border-[#d1dfcd] bg-white/70 p-7 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(39,67,48,.08)]"><span className="inline-grid h-10 w-10 place-items-center rounded-full bg-[#e7efe3] text-xs font-semibold text-[#947d34]">{step.n}</span><h3 className="mt-5 font-display text-4xl text-[#294937]">{step.title}</h3><p className="mt-3 text-sm leading-7 text-[#718574]">{step.body}</p></article></Reveal>)}
          </div>
        </div>
      </section>

      <section className="bg-[#cbdcc6] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-8 rounded-[2rem] border border-white/70 bg-[#e4eee0] px-7 py-14 shadow-[0_25px_70px_rgba(39,67,48,.08)] sm:px-12 lg:flex-row lg:items-end">
          <div><p className="section-kicker">Let's make it memorable</p><h2 className="display-heading mt-4 max-w-3xl text-6xl text-[#244936] sm:text-7xl">Your event deserves<br/><em className="gold-gradient">a little more wonder.</em></h2><p className="mt-5 max-w-lg text-sm leading-7 text-[#667b6b]">Tell us what you are planning. We will help you find the right experiences for your guests.</p></div>
          <Link href="/quote" className="liquid-button shrink-0 rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-[.15em]">Start your event brief ↗</Link>
        </div>
      </section>
    </main>
  );
}
