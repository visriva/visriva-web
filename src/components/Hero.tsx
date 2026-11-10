"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SwipeLettersLink } from "@/components/ui";

const highlights=[
 {title:"Photo experiences",note:"Instant prints and portraits",image:"/images/reception.jpg",href:"/photo-booths"},
 {title:"AI & live merchandise",note:"Personalised keepsakes",image:"/images/workshop.jpg",href:"/ai-merchandise"},
 {title:"VR & interactive games",note:"Play that brings people together",image:"/images/stage.jpg",href:"/games-vr"},
];
type HeroPageContent = { eyebrow?: string; hero_title?: string; hero_accent?: string; hero_description?: string; hero_image?: string; hero_alt?: string };
export function Hero({pageContent}:{pageContent?:HeroPageContent|null}){
 const [active,setActive]=useState(0);
 const item=highlights[active];
 const title=pageContent?.hero_title || "Make every";
 const accent=pageContent?.hero_accent || "moment";
 const description=pageContent?.hero_description || "Photo experiences, AI transformations, live merchandise and VR games—thoughtfully designed to bring guests into the celebration and give them something to take home.";
 const image=pageContent?.hero_image || item.image;
 const imageAlt=pageContent?.hero_alt || item.title;
 const eyebrow=pageContent?.eyebrow || "Bengaluru’s live engagement studio";
 return <section className="relative overflow-hidden bg-[#E6EFE3] pt-[94px] text-[#203F30]">
  <div className="pointer-events-none absolute -right-24 -top-24 h-[34rem] w-[34rem] rounded-full bg-[#B7D0B2]/55 blur-[100px]"/>
  <div className="pointer-events-none absolute -left-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[#F5EEDB]/80 blur-[100px]"/>
  <div className="relative z-10 border-y border-[#CBDAC6] bg-[#F8F7EF]/85 px-5 py-2.5 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-2 text-[10px]"><div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 rounded-full border border-[#9DBD9D] bg-[#E2EEE0] px-3 py-1 font-semibold uppercase tracking-[.16em] text-[#355642]"><i className="h-2 w-2 rounded-full bg-[#76A77D]"/>Visriva event studio</span><span className="text-[#627967]">Owned stations · Live photo, AI, merchandise and VR experiences</span></div><Link href="/client-requirements" className="font-semibold text-[#8E7835] underline decoration-[#B8A04D]/50 underline-offset-4">Venue planning guide ↗</Link></div></div>
  <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:min-h-[650px] lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-12 lg:py-20">
   <div className="max-w-[700px]"><div className="inline-flex items-center gap-2 rounded-full border border-[#BBCFB5] bg-[#F8F7EF]/75 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.19em] text-[#52725B]"><span className="text-[#A88F3E]">✧</span>{eyebrow}</div>
    <h1 className="hero-display mt-6 text-[clamp(3.9rem,7.3vw,7.4rem)] leading-[.87] tracking-[-.045em] text-[#234A36]">{title}<br/><span className="gold-gradient italic">{accent}</span><br/>memorable.</h1>
    <p className="mt-7 max-w-[620px] text-base leading-8 text-[#607768] sm:text-lg">{description}</p>
    <div className="mt-8 flex flex-wrap gap-3"><SwipeLettersLink href="/quote" label="Plan your event" className="text-sm"/><Link href="/#experiences" className="inline-flex items-center gap-3 rounded-full border border-[#A9C1A6] bg-[#F8F7EF]/80 px-6 py-4 text-sm font-medium text-[#355642] transition hover:-translate-y-1 hover:border-[#947D34]">Explore experiences <span className="text-[#947D34]">↗</span></Link></div>
    <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#C6D7C2] pt-6 text-[10px] font-semibold uppercase tracking-[.14em] text-[#627967]"><span>Corporate celebrations</span><span>Brand activations</span><span>Weddings & private events</span><span>Employee engagement</span></div>
   </div>
   <div className="relative mx-auto w-full max-w-[600px]"><div className="absolute -inset-5 rounded-[2rem] bg-[#AACBA7]/45 blur-2xl"/><div className="relative rounded-[2rem] border border-[#C8D9C2] bg-[#F8F7EF]/90 p-3 shadow-[0_25px_80px_rgba(39,67,48,.12)] backdrop-blur-2xl sm:p-4">
    <div className="relative h-[360px] overflow-hidden rounded-[1.5rem] bg-[#C6D8C1] sm:h-[420px]"><Image key={item.image} src={image} alt={imageAlt} fill priority sizes="(min-width:1024px) 48vw,100vw" className="ken-burns object-cover transition-opacity duration-500"/><div className="absolute inset-0 bg-gradient-to-t from-[#193D2B]/80 via-transparent to-[#193D2B]/5"/><div className="absolute left-5 top-5 rounded-full border border-white/60 bg-[#F8F7EF]/85 px-3 py-2 text-[9px] font-semibold uppercase tracking-[.16em] text-[#355642] backdrop-blur">The Visriva collection</div><div className="absolute inset-x-0 bottom-0 p-6 text-white"><p className="text-[10px] uppercase tracking-[.18em] text-[#E6D69D]">{item.note}</p><h2 className="mt-2 font-display text-4xl leading-none sm:text-5xl">{item.title}</h2></div></div>
    <div className="grid grid-cols-3 gap-2 p-2 pt-4">{highlights.map((highlight,index)=><button type="button" key={highlight.title} onClick={()=>setActive(index)} className={`rounded-xl border px-3 py-3 text-left text-[10px] font-semibold transition-all ${active===index?"border-[#A88F3E] bg-[#E5EDDF] text-[#294937] shadow-[inset_0 0 0 1px #A88F3E]":"border-[#D8E2D3] bg-white/60 text-[#738676] hover:border-[#A8C3A4]"}`}>{highlight.title}<span className="mt-1 block font-normal opacity-75">{index===0?"Capture":index===1?"Customise":"Play"}</span></button>)}</div>
   </div><div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-[#D0DFCA] bg-[#F8F7EF]/95 px-5 py-4 shadow-xl sm:block"><p className="section-kicker">One creative partner</p><p className="mt-1 font-display text-2xl text-[#294937]">From set-up to keepsake.</p></div></div>
  </div>
 </section>;
}
