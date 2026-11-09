import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/services";

export function RateList({ services }: { services: Service[] }) {
  if (!services.length) return <p className="rounded-2xl border border-dashed border-[#c6d7c1] bg-[#f8f7ef] p-8 text-sm text-[#6a806e]">New experiences are being added. Contact the Visriva team for a tailored brief.</p>;
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {services.map((service,index)=>(
        <article key={service.id} className="group overflow-hidden rounded-[1.5rem] border border-[#d2dfce] bg-[#f9faf4] shadow-[0_12px_35px_rgba(35,65,45,.055)] transition duration-500 hover:-translate-y-1 hover:border-[#b4caae] hover:shadow-[0_22px_50px_rgba(35,65,45,.11)]">
          <div className="relative h-56 overflow-hidden bg-[#dce9d8]">
            <Image src={service.image} alt={service.name} fill sizes="(min-width:1280px) 30vw,(min-width:640px) 50vw,100vw" className="object-cover transition duration-700 group-hover:scale-105"/>
            <span className="absolute left-4 top-4 rounded-full border border-white/75 bg-[#f8f7ef]/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.16em] text-[#49654f]">{service.footprint}</span>
            {service.comingSoon||service.bookable===false?<span className="absolute right-4 top-4 rounded-full bg-[#294937] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-white">Coming soon</span>:null}
          </div>
          <div className="p-6">
            <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#9a843a]">Visriva experience · 0{index+1}</p>
            <h2 className="mt-2 font-display text-4xl leading-none text-[#294937]">{service.name}</h2>
            <p className="mt-4 text-sm leading-7 text-[#718574]">{service.summary}</p>
            {service.includes.length?<ul className="mt-4 space-y-2 text-xs text-[#506a57]">{service.includes.slice(0,4).map(item=><li key={item} className="flex gap-2"><span className="text-[#a88f3e]">✳</span>{item}</li>)}</ul>:null}
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#e3ebe0] pt-5">
              <div><p className="text-[9px] uppercase tracking-[.16em] text-[#8b9a8b]">Starting investment</p><p className="mt-1 text-sm font-semibold text-[#294937]">{service.priceLabel}</p></div>
              {service.comingSoon||service.bookable===false?<span className="text-xs text-[#839284]">Ask us</span>:<Link href={"/quote?services="+service.id} className="inline-flex items-center gap-2 rounded-full border border-[#c4d5bf] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[.12em] text-[#49654f] transition hover:border-[#a88f3e] hover:bg-[#e8efe4]">Add to brief ↗</Link>}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
