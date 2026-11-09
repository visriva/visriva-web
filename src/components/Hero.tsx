"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ActivityBadge, WaveRevealButton } from "@/components/FramerSuite";

const highlights=[
 {title:"Photo experiences",note:"Instant prints · Portrait moments",image:"/images/reception.jpg",href:"/photo-booths",tag:"01 / CAPTURE"},
 {title:"AI & live merchandise",note:"Personalised keepsakes · Live customisation",image:"/images/workshop.jpg",href:"/ai-merchandise",tag:"02 / CREATE"},
 {title:"VR & interactive games",note:"Immersive play · Shared experiences",image:"/images/stage.jpg",href:"/games-vr",tag:"03 / PLAY"},
];

export function Hero(){
 const [active,setActive]=useState(0);
 const item=highlights[active];
 return <section className="royal-hero relative isolate overflow-hidden bg-[#050B08] pt-[94px] text-[#F5F0E5]">
  <div className="hero-grid pointer-events-none absolute inset-0 opacity-50"/>
  <div className="pointer-events-none absolute -right-40 top-[-10rem] h-[42rem] w-[42rem] rounded-full bg-[#0B6A49]/20 blur-[110px]"/>
  <div className="pointer-events-none absolute -left-40 bottom-[-16rem] h-[38rem] w-[38rem] rounded-full bg-[#C9A227]/10 blur-[110px]"/>
  <div className="relative z-10 border-y border-[#C9A227]/20 bg-[#07110D]/65 px-5 py-3 backdrop-blur-xl sm:px-8 lg:px-12">
   <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 text-[10px]">
    <div className="flex flex-wrap items-center gap-3"><ActivityBadge label="Bengaluru event studio"/><span className="text-[#CFC5A9]">Owned stations · One creative team · End-to-end delivery</span></div>
    <Link href="/client-requirements" className="font-semibold uppercase tracking-[.13em] text-[#E8D9A8] underline decoration-[#C9A227]/50 underline-offset-4 transition hover:text-[#D4AF37]">Venue planning guide ↗</Link>
   </div>
  </div>
  <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-12 px-5 pb-20 pt-14 sm:px-8 lg:min-h-[760px] lg:grid-cols-[1.02fr_.98fr] lg:gap-16 lg:px-12 lg:py-20">
   <div className="relative z-10 max-w-[740px]">
    <div className="mb-7 flex items-center gap-3"><span className="h-px w-10 bg-[#D4AF37]"/><p className="text-[10px] font-semibold uppercase tracking-[.28em] text-[#E8D9A8]">Experiences that connect</p><span className="h-px w-10 bg-[#D4AF37]/40"/></div>
    <h1 className="hero-display max-w-[10ch] text-[clamp(3.2rem,7.3vw,7.5rem)] leading-[.99] tracking-[.08em] text-[#F5F0E5]">Make every <span className="gold-gradient block italic">moment</span> unforgettable.</h1>
    <p className="mt-7 max-w-[610px] text-base leading-8 text-[#D8D0BF] sm:text-lg">A world of photo experiences, AI transformations, live merchandise and immersive VR—curated to bring guests into the celebration and give every moment a story worth taking home.</p>
    <div className="mt-9 flex flex-wrap items-center gap-3"><WaveRevealButton href="/quote" label="Plan your event"/><Link href="/#experiences" className="group inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/45 bg-white/[.035] px-6 py-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#F5F0E5] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#D4AF37] hover:bg-white/[.08]">Explore experiences <span className="text-[#D4AF37] transition-transform group-hover:translate-x-1">↗</span></Link></div>
    <div className="mt-12 grid max-w-[620px] grid-cols-3 border-y border-[#C9A227]/25 py-5">
     <div className="pr-3"><p className="font-display text-3xl text-[#D4AF37] sm:text-4xl">01</p><p className="mt-2 text-[8px] font-semibold uppercase tracking-[.16em] text-[#BDB49C] sm:text-[9px]">Creative direction</p></div>
     <div className="border-x border-[#C9A227]/25 px-4"><p className="font-display text-3xl text-[#D4AF37] sm:text-4xl">02</p><p className="mt-2 text-[8px] font-semibold uppercase tracking-[.16em] text-[#BDB49C] sm:text-[9px]">Hosted stations</p></div>
     <div className="pl-4"><p className="font-display text-3xl text-[#D4AF37] sm:text-4xl">03</p><p className="mt-2 text-[8px] font-semibold uppercase tracking-[.16em] text-[#BDB49C] sm:text-[9px]">Lasting keepsakes</p></div>
    </div>
   </div>
   <div className="relative mx-auto w-full max-w-[650px]">
    <div className="absolute -inset-5 rounded-[2.5rem] border border-[#D4AF37]/15 bg-[#0B3D2E]/10 blur-[1px]"/>
    <div className="royal-glass relative rounded-[2rem] p-3 shadow-[0_35px_100px_rgba(0,0,0,.55)] sm:p-4">
     <div className="relative h-[390px] overflow-hidden rounded-[1.45rem] bg-[#0B1711] sm:h-[490px]">
      <Image key={item.image} src={item.image} alt={item.title} fill priority sizes="(min-width:1024px) 48vw,100vw" className="ken-burns object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-t from-[#030906]/95 via-[#07110D]/10 to-[#07110D]/20"/>
      <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3"><span className="rounded-full border border-white/25 bg-[#07110D]/45 px-3 py-2 text-[9px] font-semibold uppercase tracking-[.18em] text-[#F5F0E5] backdrop-blur-xl">The Visriva collection</span><span className="rounded-full border border-[#D4AF37]/50 bg-[#07110D]/55 px-3 py-2 text-[9px] font-bold tracking-[.15em] text-[#E8D9A8] backdrop-blur-xl">{item.tag}</span></div>
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8"><p className="text-[10px] uppercase tracking-[.2em] text-[#E8D9A8]">{item.note}</p><h2 className="mt-3 max-w-[12ch] font-display text-4xl leading-[1.02] text-[#FFF9E9] sm:text-5xl">{item.title}</h2><Link href={item.href} className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.17em] text-[#D4AF37] transition hover:gap-4">Discover this experience <span>↗</span></Link></div>
     </div>
     <div className="grid grid-cols-3 gap-2 p-2 pt-4">{highlights.map((highlight,index)=><button type="button" key={highlight.title} onClick={()=>setActive(index)} aria-pressed={active===index} className={`group rounded-xl border px-3 py-3 text-left transition-all duration-300 ${active===index?"border-[#D4AF37]/80 bg-[#C9A227]/10 shadow-[inset_0_0_0_1px_rgba(201,162,39,.25)]":"border-white/10 bg-white/[.025] hover:border-[#D4AF37]/45 hover:bg-white/[.06]"}`}><span className={`block text-[9px] font-bold uppercase tracking-[.1em] ${active===index?"text-[#E8D9A8]":"text-[#A69E86]"}`}>{highlight.title}</span><span className="mt-1 block text-[9px] text-[#A69E86]">{index===0?"Capture":index===1?"Create":"Play"}</span><span className={`mt-2 block h-px transition-all ${active===index?"w-full bg-[#D4AF37]":"w-5 bg-white/20 group-hover:w-full"}`}/></button>)}</div>
    </div>
    <div className="absolute -bottom-7 -left-5 hidden rounded-2xl border border-[#D4AF37]/30 bg-[#07110D]/85 px-5 py-4 shadow-2xl backdrop-blur-2xl sm:block"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#D4AF37]">One creative partner</p><p className="mt-1 font-display text-2xl text-[#F5F0E5]">From set-up to keepsake.</p></div>
   </div>
  </div>
  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/55 to-transparent"/>
 </section>;
}
