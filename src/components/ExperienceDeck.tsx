"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Service, ServiceCategory } from "@/lib/services";
import { categoryMeta } from "@/lib/services";

const tabs:{id:"all"|ServiceCategory;label:string;note:string}[]=[
 {id:"all",label:"Everything",note:"The full collection"},
 {id:"photo-booths",label:"Photo experiences",note:"Capture the moment"},
 {id:"ai-merchandise",label:"AI & live merch",note:"Make it yours"},
 {id:"games",label:"VR & games",note:"Bring on the play"},
];

export function ExperienceDeck({services}:{services:Service[]}){
 const [active,setActive]=useState<(typeof tabs)[number]["id"]>("all");
 const [flipped,setFlipped]=useState<string|null>(null);
 const [compareIds,setCompareIds]=useState<string[]>([]);
 const [compareOpen,setCompareOpen]=useState(false);
 const rail=useRef<HTMLDivElement>(null);
 const filtered=useMemo(()=>active==="all"?services:services.filter(service=>service.category===active),[active,services]);
 const compared=services.filter(service=>compareIds.includes(service.id));

 useEffect(()=>{
  if(!compareOpen)return;
  const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")setCompareOpen(false);};
  window.addEventListener("keydown",onKey);
  return()=>window.removeEventListener("keydown",onKey);
 },[compareOpen]);

 function changeTab(id:(typeof tabs)[number]["id"]){
  setActive(id);setFlipped(null);
  rail.current?.scrollTo({left:0,behavior:"smooth"});
 }
 function move(direction:-1|1){
  rail.current?.scrollBy({left:direction*400,behavior:"smooth"});
 }
 function toggleCompare(id:string){
  setCompareIds(current=>current.includes(id)?current.filter(item=>item!==id):current.length<3?[...current,id]:current);
 }

 return <section id="experiences" className="relative overflow-hidden bg-[#DCE9D8] px-5 py-24 text-[#203F30] sm:px-8 lg:px-12">
  <div className="pointer-events-none absolute -right-44 top-0 h-[34rem] w-[34rem] rounded-full bg-[#B7D0B2]/55 blur-[120px]"/>
  <div className="pointer-events-none absolute -left-36 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[#F8F7EF]/80 blur-[110px]"/>
  <div className="relative mx-auto max-w-[1500px]">
   <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
    <div><p className="section-kicker section-kicker--sentence">The Visriva collection</p><h2 className="mt-4 max-w-3xl font-display text-6xl leading-[.9] sm:text-7xl">Find the experience.<br/><em className="gold-gradient">Make it unforgettable.</em></h2></div>
    <p className="max-w-md text-sm leading-7 text-[#667B6B]">Explore the live station inventory. Swipe through the collection, turn a card to see what is included, or compare up to three experiences side by side.</p>
   </div>

   <div className="mt-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
    <div className="bouncy-tabs flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-white/80 bg-[#F8F7EF]/85 p-1.5 scrollbar-none" role="tablist" aria-label="Filter experiences">
     {tabs.map(tab=><button key={tab.id} type="button" role="tab" aria-selected={active===tab.id} onClick={()=>changeTab(tab.id)} className={`bouncy-tab shrink-0 rounded-full px-4 py-3 text-[10px] font-bold uppercase tracking-[.12em] sm:px-5 ${active===tab.id?"is-active bg-[#294937] text-white shadow-[0_7px_18px_rgba(41,73,55,.2)]":"text-[#607768] hover:bg-[#EAF1E6] hover:text-[#294937]"}`}>{tab.label}</button>)}
    </div>
    <div className="flex items-center gap-3"><span className="text-xs font-semibold text-[#607768]">{filtered.length} experiences</span></div>
   </div>

   <div ref={rail} className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 scrollbar-none" aria-label="Experience carousel">
    {filtered.map((service,index)=>{
     const isFlipped=flipped===service.id;
     const isCompared=compareIds.includes(service.id);
     return <article key={service.id} className="experience-flip-wrap w-[min(84vw,390px)] shrink-0 snap-start">
      <button type="button" aria-label={isFlipped?`Show ${service.name} image`:`See details for ${service.name}`} aria-pressed={isFlipped} onClick={()=>setFlipped(isFlipped?null:service.id)} className={`experience-flip w-full text-left ${isFlipped?"is-flipped":""}`}>
       <div className="experience-flip-inner">
        <div className="experience-face experience-front">
         <div className="relative h-full min-h-[430px] overflow-hidden rounded-[1.4rem] border border-white/70 bg-[#C9DCC5] shadow-[0_16px_42px_rgba(39,67,48,.11)]">
          <Image src={service.image} alt={service.name} fill sizes="390px" className="object-cover transition duration-700 hover:scale-[1.04]"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#193D2B]/90 via-[#193D2B]/10 to-transparent"/>
          <div className="absolute left-5 top-5 rounded-full border border-white/70 bg-[#F8F7EF]/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[.14em] text-[#355642]">{categoryMeta[service.category].label}</div>
          {service.comingSoon||service.bookable===false?<span className="absolute right-5 top-5 rounded-full bg-[#294937]/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[.14em] text-white">Coming soon</span>:null}
          <div className="absolute inset-x-0 bottom-0 p-6">
           <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#E9DDAE]">{service.footprint}</p>
           <h3 className="mt-2 font-display text-[2.4rem] leading-[.96] text-white">{service.name}</h3>
           <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/30 pt-4"><span className="text-sm font-semibold text-white">{service.priceLabel}</span><span className="grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/15 text-white backdrop-blur" aria-hidden="true"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 0 1.2 4"/></svg></span></div>
           <p className="mt-3 text-xs font-semibold text-white/90">Tap to view details</p>
          </div>
         </div>
        </div>
        <div className="experience-face experience-back rounded-[1.4rem] border border-[#C8D9C2] bg-[radial-gradient(circle_at_top_right,#F8F7EF,#D6E6D2_72%)] p-7 shadow-[0_16px_42px_rgba(39,67,48,.08)]">
         <span className="text-[10px] font-bold uppercase tracking-[.19em] text-[#947D34]">Inside the experience</span>
         <h3 className="mt-5 font-display text-4xl leading-none text-[#294937]">{service.name}</h3>
         <p className="mt-5 text-sm leading-7 text-[#617768]">{service.summary}</p>
         <div className="mt-6 border-t border-[#C5D8C0] pt-5"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#947D34]">What is included</p><ul className="mt-3 space-y-2 text-xs leading-5 text-[#405B48]">{service.includes.slice(0,5).map(item=><li key={item}>✳ {item}</li>)}</ul></div>
         <div className="mt-auto pt-6"><p className="font-display text-3xl text-[#947D34]">{service.priceLabel}</p><p className="mt-2 text-xs font-semibold text-[#526B58]">Tap to return to the image</p></div>
        </div>
       </div>
      </button>
      <div className="mt-3 flex items-center justify-between gap-3 px-1">
       <Link href={categoryMeta[service.category].href} className="text-xs font-semibold text-[#947D34] transition hover:underline hover:underline-offset-4">Explore category</Link>
       <button type="button" onClick={()=>toggleCompare(service.id)} disabled={!isCompared&&compareIds.length>=3} aria-pressed={isCompared} className={`rounded-full border-2 px-4 py-2.5 text-xs font-semibold transition ${isCompared?"border-[#294937] bg-[#294937] text-white":"border-[#B8CBB4] bg-[#F8F7EF]/75 text-[#607768] hover:border-[#A88F3E]"} disabled:opacity-40`}>{isCompared?"✓ Added":"Compare +"}</button>
      </div>
     </article>;
    })}
    {filtered.length===0?<p className="w-full rounded-2xl border border-dashed border-[#B8CBB4] bg-[#F8F7EF]/70 p-10 text-center text-sm text-[#667B6B]">No experiences in this category yet. Contact the team for a tailored setup.</p>:null}
   </div>
   <div className="mt-2 flex justify-end gap-2 pr-1"><button type="button" aria-label="Previous experiences" onClick={()=>move(-1)} className="deck-arrow">←</button><button type="button" aria-label="Next experiences" onClick={()=>move(1)} className="deck-arrow">→</button></div>
   <div className="mt-7 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/80 bg-[#F8F7EF]/85 p-6 shadow-[0_12px_35px_rgba(39,67,48,.06)] sm:flex-row sm:p-8">
    <div><p className="section-kicker">Designed around your event</p><p className="mt-2 font-display text-3xl text-[#294937]">Mix, match and make it yours.</p></div>
    <div className="flex flex-wrap gap-3"><Link href="/rate-card" className="rounded-full border border-[#B8CBB4] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#355642] transition hover:bg-[#E8EFE4]">View rate card</Link><Link href="/quote" className="liquid-button rounded-full px-7 py-3.5 text-[10px] font-bold uppercase tracking-[.14em]">Build your event brief ↗</Link></div>
   </div>
  </div>
  {compareIds.length>0?<div className="sticky bottom-4 z-40 mx-auto mt-5 flex max-w-[700px] items-center justify-between gap-4 rounded-2xl border border-[#C9D7C4] bg-[#F8F7EF]/95 p-3 pl-5 shadow-[0_18px_55px_rgba(32,63,48,.16)] backdrop-blur-xl"><div><p className="text-xs font-semibold text-[#294937]">{compareIds.length} of 3 experiences selected</p><p className="mt-1 text-[10px] text-[#718574]">Compare pricing, footprint and inclusions</p></div><div className="flex gap-2"><button type="button" onClick={()=>setCompareIds([])} className="rounded-full px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-[#7D8B7C]">Clear</button><button type="button" onClick={()=>setCompareOpen(true)} disabled={compareIds.length<2} className="rounded-full bg-[#294937] px-5 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-white disabled:opacity-40">Compare now ↗</button></div></div>:null}
  {compareOpen?<div className="fixed inset-0 z-[100] grid place-items-center bg-[#203F30]/55 p-3 backdrop-blur-md sm:p-6" role="dialog" aria-modal="true" aria-label="Compare experiences" onClick={()=>setCompareOpen(false)}><section className="max-h-[88svh] w-full max-w-5xl overflow-auto rounded-[1.7rem] border border-white bg-[#F8F7EF] p-5 shadow-2xl sm:p-8" onClick={event=>event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="section-kicker">Side by side</p><h3 className="mt-2 font-display text-4xl text-[#294937] sm:text-5xl">Compare experiences.</h3></div><button type="button" onClick={()=>setCompareOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-[#C8D8C3] text-[#355642]">×</button></div><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-left text-sm"><thead><tr><th className="w-36 border-b border-[#D9E4D5] p-3 text-[10px] uppercase tracking-wider text-[#839183]">Details</th>{compared.map(item=><th key={item.id} className="border-b border-[#D9E4D5] p-3 font-display text-2xl text-[#294937]">{item.name}</th>)}</tr></thead><tbody>{[["Starting price",(item:Service)=>item.priceLabel],["Footprint",(item:Service)=>item.footprint],["Duration",(item:Service)=>item.durationMinutes?item.durationMinutes+" minutes":"Confirmed in quote"],["Includes",(item:Service)=>item.includes.join(" · ")]].map(([label,render])=><tr key={label as string}><th className="border-b border-[#E4EBE0] p-3 align-top text-[10px] uppercase tracking-wider text-[#839183]">{label as string}</th>{compared.map(item=><td key={item.id} className="border-b border-[#E4EBE0] p-3 align-top leading-6 text-[#526B58]">{(render as (item:Service)=>string)(item)}</td>)}</tr>)}</tbody></table></div><div className="mt-7 flex flex-wrap justify-end gap-3"><button type="button" onClick={()=>setCompareOpen(false)} className="rounded-full border border-[#C8D8C3] px-6 py-3 text-xs font-semibold text-[#49654F]">Keep exploring</button><Link href={"/quote?services="+compareIds.join(",")} className="liquid-button rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider">Add compared services ↗</Link></div></section></div>:null}
 </section>;
}
