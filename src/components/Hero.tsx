"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const highlights = [
  { title: "Photo experiences", note: "Instant prints and portraits", image: "/images/reception.jpg", href: "/photo-booths" },
  { title: "AI & live merchandise", note: "Personalised keepsakes", image: "/images/workshop.jpg", href: "/ai-merchandise" },
  { title: "VR & interactive games", note: "Play that brings people together", image: "/images/stage.jpg", href: "/games-vr" },
];
const rigTabs = ["Photo booth", "Live merch", "VR arena"];

export function Hero() {
  const [active, setActive] = useState(0);
  const item = highlights[active];
  return (
    <section className="relative overflow-hidden bg-[#003F26] pt-[78px] text-[#F5F0DF]">
      <div className="pointer-events-none absolute -right-28 -top-28 h-[34rem] w-[34rem] rounded-full bg-[#0B6A47]/25 blur-[100px]" />
      <div className="pointer-events-none absolute -left-36 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#B8A04D]/10 blur-[100px]" />
      <div className="relative z-10 border-y border-[#B8A04D]/20 bg-[#052F20]/85 px-5 py-2.5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-2 text-[10px]">
          <div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 rounded-full border border-[#B8A04D]/35 bg-[#064B35] px-3 py-1 font-semibold uppercase tracking-[.16em] text-[#F5F0DF]"><i className="h-2 w-2 rounded-full bg-[#76a77d]" /> Visriva event studio</span><span className="text-[#D2DED3]">Owned stations · Live photo, AI, merchandise and VR experiences</span></div>
          <Link href="/client-requirements" className="font-semibold text-[#D1BD73] underline decoration-[#b8a04d]/50 underline-offset-4">Venue planning guide ↗</Link>
        </div>
      </div>
      <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:min-h-[640px] lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-12 lg:py-20">
        <div className="max-w-[700px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B8A04D]/35 bg-[#064B35]/85 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.19em] text-[#F5F0DF]"><span className="text-[#a88f3e]">✧</span> Bengaluru’s live engagement studio</div>
          <h1 className="hero-display mt-6 text-[clamp(3.9rem,7.3vw,7.4rem)] leading-[.87] tracking-[-.045em] text-[#F5F0DF]">Make every<br/><span className="gold-gradient italic">moment</span><br/>memorable.</h1>
          <p className="mt-7 max-w-[620px] text-base leading-8 text-[#D2DED3] sm:text-lg">Photo experiences, AI transformations, live merchandise and VR games—thoughtfully designed to bring guests into the celebration and give them something to take home.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/quote" className="liquid-button inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold">Plan your event <span className="text-lg">→</span></Link><Link href="/#experiences" className="inline-flex items-center gap-3 rounded-full border border-[#B8A04D]/45 bg-[#064B35]/70 px-6 py-4 text-sm font-medium text-[#F5F0DF] transition hover:-translate-y-1 hover:border-[#D1BD73]">Explore experiences <span className="text-[#D1BD73]">↗</span></Link></div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#B8A04D]/25 pt-6 text-[10px] font-semibold uppercase tracking-[.14em] text-[#D2DED3]"><span>Corporate celebrations</span><span>Brand activations</span><span>Weddings & private events</span><span>Employee engagement</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[600px]">
          <div className="absolute -inset-5 rounded-[2rem] bg-[#0A6845]/25 blur-2xl" />
          <div className="relative rounded-[2rem] border border-[#B8A04D]/35 bg-[#052F20]/90 p-3 shadow-[0_25px_80px_rgba(39,67,48,.12)] backdrop-blur-2xl sm:p-4">
            <div className="relative h-[360px] overflow-hidden rounded-[1.5rem] bg-[#064B35] sm:h-[420px]">
              <Image key={item.image} src={item.image} alt={item.title} fill priority sizes="(min-width:1024px) 48vw,100vw" className="ken-burns object-cover transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#193d2b]/80 via-transparent to-[#193d2b]/5" />
              <div className="absolute left-5 top-5 rounded-full border border-white/50 bg-[#003F26]/75 px-3 py-2 text-[9px] font-semibold uppercase tracking-[.16em] text-[#F5F0DF] backdrop-blur">The Visriva collection</div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white"><p className="text-[10px] uppercase tracking-[.18em] text-[#e6d69d]">{item.note}</p><h2 className="mt-2 font-display text-4xl leading-none sm:text-5xl">{item.title}</h2></div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-2 pt-4">{highlights.map((highlight,index)=><button type="button" key={highlight.title} onClick={()=>setActive(index)} className={`rounded-xl border px-3 py-3 text-left text-[10px] font-semibold transition-all ${active===index?"border-[#D1BD73] bg-[#B8A04D]/15 text-[#F5F0DF] shadow-[inset_0 0 0 1px #a88f3e]":"border-[#B8A04D]/25 bg-[#064B35] text-[#D2DED3] hover:border-[#D1BD73]"}`}>{rigTabs[index]}<span className="mt-1 block font-normal opacity-75">{index===0?"Capture":index===1?"Customise":"Play"}</span></button>)}</div>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-[#B8A04D]/35 bg-[#052F20]/95 px-5 py-4 shadow-xl sm:block"><p className="section-kicker">One creative partner</p><p className="mt-1 font-display text-2xl text-[#F5F0DF]">From set-up to keepsake.</p></div>
        </div>
      </div>
    </section>
  );
}
