"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { galleryFilms, galleryItems } from "@/lib/site";

const filters = ["All", "Gatherings", "Stations", "Night"] as const;

export function GalleryView({ films }: { films: boolean }) {
  const [filter,setFilter]=useState<(typeof filters)[number]>("All");
  const [open,setOpen]=useState<(typeof galleryItems)[number]|null>(null);
  const items=galleryItems.filter((item)=>filter==="All"||item.tag===filter);

  useEffect(()=>{
    if(!open)return;
    const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(null);};
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[open]);

  return <div>
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Gallery filters">
      {filters.map((item)=><button key={item} type="button" role="tab" aria-selected={filter===item} onClick={()=>setFilter(item)} className={filter===item?"rounded-full border border-[#294937] bg-[#294937] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[.15em] text-white":"rounded-full border border-[#cbdcc7] bg-[#f8f7ef] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[.15em] text-[#637968] hover:border-[#a88f3e]"}>{item}</button>)}
    </div>
    <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
      {items.map((item)=><button key={item.src} type="button" onClick={()=>setOpen(item)} className="mb-5 block w-full break-inside-avoid text-left">
        <figure className="group relative overflow-hidden rounded-2xl border border-[#cfddca] bg-[#f8f7ef] shadow-[0_10px_30px_rgba(39,67,48,.06)]">
          <div className={item.tall?"relative h-[28rem] overflow-hidden":"relative h-64 overflow-hidden"}><Image src={item.src} alt={item.alt} fill sizes="(min-width:1024px) 30vw,100vw" className="object-cover transition duration-700 group-hover:scale-105"/></div>
          <figcaption className="flex items-center justify-between gap-3 px-4 py-4 text-sm text-[#294937]"><span>{item.caption}</span><span className="text-[9px] font-bold uppercase tracking-[.15em] text-[#947d34]">{item.tag}</span></figcaption>
        </figure>
      </button>)}
    </div>
    <div className="mt-16 border-t border-[#cbdcc7] pt-12">
      <p className="section-kicker">Moving pictures</p><h2 className="mt-3 font-display text-4xl text-[#F5F0DF]">The event, in motion.</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[#D2DED3]">Video slots are ready for the Visriva event archive. Add approved MP4 footage when available.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {galleryFilms.map((film)=><figure key={film.title} className="relative h-56 overflow-hidden rounded-2xl border border-[#cfddca] bg-[#dce9d8]">
          {films?<video className="h-full w-full object-cover" autoPlay muted loop playsInline poster={film.poster}><source src={film.src} type="video/mp4"/></video>:<Image src={film.poster} alt="" fill className="object-cover" sizes="33vw"/>}
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#173d2b]/85 to-transparent p-4 text-sm text-white">{film.title}<span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.15em] text-[#efdfaa]">{film.src.replace("/films/","")}</span></figcaption>
        </figure>)}
      </div>
    </div>
    {open?<div className="fixed inset-0 z-[95] grid place-items-center bg-[#203f30]/85 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={open.caption} onClick={()=>setOpen(null)}>
      <figure className="relative h-[min(80svh,820px)] w-full max-w-5xl rounded-2xl bg-[#f8f7ef] p-3 shadow-2xl" onClick={(event)=>event.stopPropagation()}>
        <div className="relative h-full w-full"><Image src={open.src} alt={open.alt} fill className="object-contain" sizes="100vw"/></div>
        <figcaption className="absolute bottom-3 left-3 rounded-lg bg-[#f8f7ef]/90 px-4 py-3 text-sm text-[#294937]">{open.caption}</figcaption>
        <button type="button" className="absolute right-4 top-4 rounded-full bg-[#294937] px-4 py-2 text-xs uppercase tracking-[.15em] text-white" onClick={()=>setOpen(null)}>Close ×</button>
      </figure>
    </div>:null}
  </div>;
}
