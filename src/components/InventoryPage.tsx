import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/services";

type Highlight = { number: string; title: string; body: string };

type InventoryPageProps = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  introTitle: string;
  intro: string;
  highlights: Highlight[];
  services: Service[];
  locationLine: string;
  closingTitle: string;
  closingCopy: string;
};

export function InventoryPage({
  eyebrow,
  title,
  accent,
  description,
  heroImage,
  heroAlt,
  introTitle,
  intro,
  highlights,
  services,
  locationLine,
  closingTitle,
  closingCopy,
}: InventoryPageProps) {
  return (
    <main className="overflow-hidden bg-[#E7EFE3] text-[#203F30]">
      <section className="relative isolate min-h-[680px] overflow-hidden bg-[#163D2C] pt-28 text-[#F8F7EF]">
        <Image src={heroImage} alt={heroAlt} fill priority sizes="100vw" className="absolute inset-0 -z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,42,29,.94)_0%,rgba(13,42,29,.76)_42%,rgba(13,42,29,.18)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#102F22]/75 via-transparent to-[#102F22]/10" />
        <div className="relative mx-auto flex min-h-[550px] max-w-[1500px] flex-col justify-center px-5 pb-20 pt-16 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.28em] text-[#E6D69C]">
              <span className="h-px w-9 bg-[#C8AE5C]" /> {eyebrow}
            </p>
            <h1 className="mt-7 max-w-4xl font-display text-[clamp(3.8rem,8vw,8rem)] leading-[.83] tracking-[-.045em] text-white">
              {title}<br /><em className="font-normal text-[#DCC77D]">{accent}</em>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">{description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/quote" className="liquid-button inline-flex items-center rounded-full px-7 py-4 text-[10px] font-bold uppercase tracking-[.16em]">Plan your experience ↗</Link>
              <Link href="/rate-card" className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-7 py-4 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur transition hover:bg-white/20">Explore starting prices</Link>
            </div>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/25 pt-6 text-[9px] font-semibold uppercase tracking-[.2em] text-white/70">
            <span>{services.length} experiences in this collection</span>
            <span className="h-1 w-1 rounded-full bg-[#DCC77D]" />
            <span>Designed and hosted by Visriva</span>
            <span className="h-1 w-1 rounded-full bg-[#DCC77D]" />
            <span>{locationLine}</span>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-14 right-[7%] hidden h-48 w-48 rounded-full border border-white/25 lg:block" />
        <div className="pointer-events-none absolute bottom-[5.5rem] right-[10%] hidden h-32 w-32 rounded-full border border-[#DCC77D]/50 lg:block" />
      </section>

      <section className="relative px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="section-kicker">The Visriva approach</p>
            <h2 className="mt-5 max-w-xl font-display text-5xl leading-[.92] tracking-tight text-[#244936] sm:text-7xl">{introTitle}</h2>
          </div>
          <div className="flex flex-col justify-between">
            <p className="max-w-3xl text-base leading-8 text-[#617768] sm:text-lg">{intro}</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <article key={item.number} className="border-t border-[#B9CDB5] pt-4">
                  <p className="text-[10px] font-bold tracking-[.2em] text-[#A88F3E]">{item.number}</p>
                  <h3 className="mt-3 font-display text-2xl text-[#294937]">{item.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#718574]">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F7EF] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">Explore the collection</p>
              <h2 className="mt-4 max-w-3xl font-display text-5xl leading-[.9] text-[#244936] sm:text-7xl">Choose your<br /><em className="font-normal text-[#A88F3E]">guest moment.</em></h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#718574]">Every experience can be shaped around your venue, guest count and event brief. Select a station to see what's included and start planning.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <article key={service.id} className="group overflow-hidden rounded-[1.65rem] border border-[#D8E2D4] bg-white shadow-[0_14px_45px_rgba(31,57,43,.06)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_25px_65px_rgba(31,57,43,.13)]">
                <div className="relative h-[290px] overflow-hidden bg-[#DCE9D8]">
                  <Image src={service.image} alt={service.name} fill sizes="(min-width:1280px) 33vw,(min-width:768px) 50vw,100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102F22]/80 via-[#102F22]/5 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full border border-white/60 bg-[#F8F7EF]/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[.16em] text-[#355642]">Visriva · {String(index + 1).padStart(2, "0")}</span>
                  {service.comingSoon || service.bookable === false ? <span className="absolute right-5 top-5 rounded-full bg-[#203F30]/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[.14em] text-white">Ask us</span> : <span className="absolute right-5 top-5 rounded-full bg-[#DCC77D] px-3 py-2 text-[9px] font-bold uppercase tracking-[.14em] text-[#203F30]">Bookable</span>}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#E7D89F]">{service.footprint}</p>
                    <h3 className="mt-2 font-display text-4xl leading-[.95] text-white">{service.name}</h3>
                  </div>
                </div>
                <div className="p-6 sm:p-7">
                  <p className="min-h-[72px] text-sm leading-7 text-[#647A69]">{service.description || service.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.includes.slice(0, 3).map((item) => <span key={item} className="rounded-full bg-[#EDF3E9] px-3 py-2 text-[9px] font-semibold text-[#526D58]">{item}</span>)}
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-3 border-t border-[#E4EBE0] pt-5">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[.17em] text-[#92A091]">Starting investment</p>
                      <p className="mt-1 font-display text-3xl text-[#294937]">{service.priceLabel}</p>
                    </div>
                    <Link href={service.bookable === false ? "/quote" : `/quote?services=${service.id}`} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#C8D8C3] text-xl text-[#355642] transition group-hover:border-[#A88F3E] group-hover:bg-[#294937] group-hover:text-white" aria-label={`Enquire about ${service.name}`}>↗</Link>
                  </div>
                  <p className="mt-4 text-xs italic leading-6 text-[#8A998A]">“{service.guestMoment}”</p>
                </div>
              </article>
            ))}
          </div>
          {services.length === 0 ? <p className="rounded-2xl border border-dashed border-[#C6D7C1] p-8 text-sm text-[#6A806E]">We are refreshing this collection. Contact Visriva for a tailored event brief.</p> : null}
        </div>
      </section>

      <section className="bg-[#DCE9D8] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-8 rounded-[2rem] border border-[#C9D9C4] bg-[#F8F7EF] p-8 shadow-[0_24px_70px_rgba(39,67,48,.08)] sm:p-12 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="section-kicker">Make the room remember</p>
            <h2 className="mt-4 font-display text-5xl leading-[.9] text-[#244936] sm:text-7xl">{closingTitle}</h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#718574] sm:text-base">{closingCopy}</p>
          </div>
          <Link href="/quote" className="liquid-button inline-flex shrink-0 items-center justify-center rounded-full px-8 py-4 text-[10px] font-bold uppercase tracking-[.16em]">Build your event brief ↗</Link>
        </div>
      </section>
    </main>
  );
}
