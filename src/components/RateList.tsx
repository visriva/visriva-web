"use client";

import Image from "next/image";
import { useMemo,useRef,useState } from "react";
import type { Service,ServiceCategory } from "@/lib/services";
import { SwipeLettersLink } from "@/components/ui";
import { categoryMeta } from "@/lib/services";

type Filter="all"|ServiceCategory;
const tabs:{id:Filter;label:string}[]=[
 {id:"all",label:"All experiences"},
 {id:"photo-booths",label:"Photo booths"},
 {id:"ai-merchandise",label:"AI & merchandise"},
 {id:"games",label:"Games & VR"},
];

export function RateList({services}:{services:Service[]}){
 const [active,setActive]=useState<Filter>("all");
 const [expanded,setExpanded]=useState<string|null>(null);
 const rail=useRef<HTMLDivElement>(null);
 const filtered=useMemo(()=>active==="all"?services:services.filter(item=>item.category===active),[active,services]);
 const available=filtered.filter(service=>service.bookable!==false&&!service.comingSoon);
 function changeFilter(id:Filter){setActive(id);setExpanded(null);rail.current?.scrollTo({left:0,behavior:"smooth"});}
 return <div>
  <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
   <div className="bouncy-tabs flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-white/80 bg-[#F8F7EF]/90 p-1.5 scrollbar-none" role="tablist" aria-label="Filter rate card">
    {tabs.map(tab=><button key={tab.id} type="button" role="tab" aria-selected={active===tab.id} onClick={()=>changeFilter(tab.id)} className={`bouncy-tab shrink-0 rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-[.12em] ${active===tab.id?"is-active bg-[#294937] text-white":"text-[#607768] hover:bg-[#EAF1E6]"}`}>{tab.label}</button>)}
   </div>
   <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.14em] text-[#819181]"><span>{filtered.length} options</span><span className="h-1 w-1 rounded-full bg-[#B8A04D]"/><span>{available.length} bookable now</span></div>
  </div>
  <div ref={rail} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
   {filtered.map((service,index)=>{
    const isOpen=expanded===service.id;
    return <article key={service.id} className={`group relative overflow-hidden rounded-[1.55rem] border bg-[#F9FAF4] shadow-[0_12px_35px_rgba(35,65,45,.055)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(35,65,45,.12)] ${isOpen?"border-[#A88F3E] shadow-[0_0_0_1px_rgba(168,143,62,.18)]":"border-[#D2DFCE] hover:border-[#B4CAAE]"}`}>
     <div className="relative h-56 overflow-hidden bg-[#DCE9D8]">
      <Image src={service.image} alt={service.name} fill sizes="(min-width:1280px) 30vw,(min-width:640px) 50vw,100vw" className="object-cover transition duration-700 group-hover:scale-105"/>
      <div className="absolute inset-0 bg-gradient-to-t from-[#173D2B]/50 via-transparent to-transparent"/>
      <span className="absolute left-4 top-4 rounded-full border border-white/75 bg-[#F8F7EF]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.16em] text-[#49654F]">{categoryMeta[service.category].label}</span>
      {service.comingSoon||service.bookable===false?<span className="absolute right-4 top-4 rounded-full bg-[#294937] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white">Coming soon</span>:<span className="absolute right-4 top-4 rounded-full border border-white/70 bg-[#F8F7EF]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#49654F]">Available</span>}
      <span className="absolute bottom-4 left-4 rounded-full border border-white/50 bg-[#173D2B]/40 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.14em] text-white backdrop-blur">{service.footprint}</span>
     </div>
     <div className="p-6">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-[#9A843A]">Visriva · {String(index+1).padStart(2,"0")}</p><h2 className="mt-2 font-display text-[2rem] leading-[.98] text-[#294937]">{service.name}</h2><button type="button" aria-expanded={isOpen} aria-controls={`rate-details-${service.id}`} onClick={()=>setExpanded(isOpen?null:service.id)} className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#49654F] underline decoration-[#B8CBB4] underline-offset-4 hover:text-[#947D34]">{isOpen?"Hide details":"View details"} <span aria-hidden="true">{isOpen?"−":"+"}</span></button></div><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#E7EFE3] text-sm text-[#947D34] transition group-hover:rotate-45">✳</span></div>
      <div className="mt-4 border-t border-[#E3EBE0] pt-4"><p className="text-xs font-semibold text-[#8B9A8B]">Starting investment</p><p className="mt-1 font-display text-3xl text-[#294937]">{service.priceLabel}</p></div>
      <div id={`rate-details-${service.id}`} className={`grid transition-all duration-300 ${isOpen?"grid-rows-[1fr] opacity-100":"grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><div className="mt-4 border-t border-[#E3EBE0] pt-4"><p className="text-xs leading-6 text-[#718574]">{service.summary}</p><ul className="mt-3 space-y-2 text-xs text-[#506A57]">{service.includes.slice(0,4).map(item=><li key={item} className="flex gap-2"><span className="text-[#A88F3E]">✳</span>{item}</li>)}</ul></div></div></div>
      <div className="mt-5 flex items-center justify-between gap-3">
       {service.comingSoon||service.bookable===false?<span className="text-[10px] text-[#839284]">Ask the studio about availability</span>:<SwipeLettersLink href={"/quote?services="+service.id} label="Add to event brief" icon="plus" className="w-full px-5 py-3.5 text-xs"/>}
      </div>
     </div>
    </article>;
   })}
  </div>
  {!filtered.length?<p className="rounded-2xl border border-dashed border-[#C6D7C1] bg-[#F8F7EF] p-8 text-sm text-[#6A806E]">No services are listed in this category yet. Contact the Visriva team for a tailored brief.</p>:null}
 </div>;
}
