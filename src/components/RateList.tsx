import Link from "next/link";
import { Plate } from "@/components/ui";
import type { Service } from "@/lib/services";

export function RateList({ services }: { services: Service[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service, index) => (
        <article
          key={service.id}
          className={`group flex flex-col border border-gold/25 bg-white/[0.03] backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:border-gold/70 ${
            index === 0 ? "md:col-span-2 xl:col-span-1" : ""
          }`}
        >
          <div className="relative h-52">
            <Plate
              src={service.image}
              alt=""
              className="absolute inset-0"
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h2 className="font-display text-4xl italic leading-none text-cream">{service.name}</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist/85">{service.summary}</p>
            <ul className="mt-4 space-y-1 text-sm text-champagne/90">
              {service.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4 font-royal text-[0.62rem] uppercase tracking-[0.2em] text-gold/80">
              {service.footprint}
            </p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-lg text-gold-2">{service.priceLabel}</p>
              <Link href={`/quote?services=${service.id}`} className="link-gold text-[0.68rem] uppercase tracking-[0.18em] text-cream">
                Add to quote
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
