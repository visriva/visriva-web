import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/services";

export function RateList({ services }: { services: Service[] }) {
  if (!services.length) return <p className="rounded-2xl border border-dashed border-stone-300 p-8 text-sm text-stone-500">New experiences are being added. Contact the Visriva team for a tailored brief.</p>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {services.map((service, index) => (
        <article key={service.id} className={`group overflow-hidden rounded-[1.4rem] border border-[#e7e0d5] bg-[#fffdf8] shadow-[0_12px_35px_rgba(35,30,20,.045)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(35,30,20,.10)] ${index === 0 ? "xl:col-span-1" : ""}`}>
          <div className="relative h-56 overflow-hidden bg-[#e9e2d6]">
            <Image src={service.image} alt="" fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
            {service.comingSoon || service.bookable === false ? <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[.62rem] font-semibold uppercase tracking-widest text-stone-700">Coming soon</span> : null}
          </div>
          <div className="p-6">
            <h2 className="font-display text-4xl leading-none text-[#24241e]">{service.name}</h2>
            <p className="mt-4 text-sm leading-7 text-[#68665c]">{service.summary}</p>
            {service.includes.length ? <ul className="mt-4 space-y-2 text-sm text-[#45453d]">{service.includes.slice(0,4).map((item) => <li key={item} className="flex gap-2"><span className="text-[#a87824]">✳</span>{item}</li>)}</ul> : null}
            {service.footprint ? <p className="mt-4 text-[.62rem] font-semibold uppercase tracking-[.16em] text-[#9a702b]">{service.footprint}</p> : null}
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#eee8dd] pt-5">
              <p className="text-sm font-semibold text-[#282820]">{service.priceLabel}</p>
              {service.comingSoon || service.bookable === false ? <span className="text-xs text-stone-500">Ask us</span> : <Link href={`/quote?services=${service.id}`} className="text-xs font-semibold uppercase tracking-widest text-[#92651f] underline underline-offset-4">Add to brief ↗</Link>}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
