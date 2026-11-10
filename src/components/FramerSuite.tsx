"use client";

import Link from "next/link";
import { useEffect,useState } from "react";

export function ActivityBadge({label="Studio available"}:{label?:string}){
 return <span className="inline-flex items-center gap-2 rounded-full border border-[#C9D7C4] bg-[#F8F7EF]/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[.16em] text-[#355642]"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#78A87C] opacity-50"/><span className="relative inline-flex h-2 w-2 rounded-full bg-[#5F996A]"/></span>{label}</span>;
}

export function DotButton({label,onClick}:{label:string;onClick:()=>void}){
 return <button type="button" aria-label={label} onClick={onClick} className="group grid h-11 w-11 place-items-center rounded-full border border-[#C9D7C4] bg-[#F8F7EF]/90 transition hover:-translate-y-1 hover:border-[#A88F3E] hover:shadow-lg"><span className="h-2 w-2 rounded-full bg-[#A88F3E] transition group-hover:scale-[1.8]"/></button>;
}

export function WaveRevealButton({href,label}:{href:string;label:string}){
 return <Link href={href} className="wave-button group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[#D4AF37]/60 bg-[#0B3D2E] px-7 py-4 text-xs font-bold uppercase tracking-[.14em] text-[#F5F0E5] shadow-[0_12px_32px_rgba(0,0,0,.32)] transition hover:-translate-y-1"><span className="wave-button-fill absolute inset-x-0 bottom-0 h-0 bg-[#D4AF37] transition-[height] duration-500 group-hover:h-full"/><span className="relative z-10 transition-colors group-hover:text-[#07110D]">{label}</span><span className="relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span></Link>;
}

export function LightBulbButton({children="Need a hand?"}:{children?:React.ReactNode}){
 const [on,setOn]=useState(false);
 return <div className="relative"><button type="button" aria-expanded={on} onClick={()=>setOn(v=>!v)} className="inline-flex items-center gap-2 rounded-full border border-[#C9D7C4] bg-[#F8F7EF]/90 px-4 py-3 text-xs font-semibold text-[#355642] transition hover:border-[#A88F3E]"><span className={on?"text-[#B08E25]":"text-[#829182]"}>☼</span>{children}</button>{on?<div className="absolute bottom-full right-0 z-30 mb-3 w-64 rounded-2xl border border-[#C9D7C4] bg-[#F8F7EF] p-4 text-sm leading-6 text-[#617768] shadow-xl"><strong className="text-[#294937]">Not sure where to start?</strong><p className="mt-1">Tell us your event date, guest count and venue. We’ll help shortlist the right stations.</p><Link href="/quote" className="mt-3 inline-block font-semibold text-[#D4AF37] underline underline-offset-4">Build a quick brief ↗</Link></div>:null}</div>;
}

export function TearTicket({href="/rate-card",label="Explore the rate card"}:{href?:string;label?:string}){
 return <Link href={href} className="ticket-link group relative inline-flex items-center gap-4 rounded-xl border border-dashed border-[#B8CBB4] bg-[#F8F7EF] px-5 py-4 text-[#294937] shadow-[0_10px_30px_rgba(39,67,48,.07)] transition hover:-translate-y-1 hover:shadow-xl"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#E7EFE3] text-xl text-[#D4AF37]">✳</span><span><span className="block text-[9px] font-bold uppercase tracking-[.18em] text-[#947D34]">Your event, your mix</span><span className="mt-1 block text-sm font-semibold">{label}</span></span><span className="ml-2 text-lg transition-transform group-hover:translate-x-1">→</span></Link>;
}

const prompts=[
 {eyebrow:"The atmosphere",title:"Make the room feel alive.",copy:"A hosted photo moment, an interactive game or a live customisation bar gives guests a reason to gather."},
 {eyebrow:"The keepsake",title:"Give the memory a place to live.",copy:"Instant prints and personalised merchandise turn a passing moment into something guests can take home."},
 {eyebrow:"The connection",title:"Bring every guest into the story.",copy:"Choose experiences that invite people to participate, create and share the celebration."}
];
export function QuoteDeck(){
 const [index,setIndex]=useState(0);
 useEffect(()=>{const id=window.setInterval(()=>setIndex(v=>(v+1)%prompts.length),6500);return()=>window.clearInterval(id);},[]);
 const item=prompts[index];
 return <section className="relative overflow-hidden rounded-[1.7rem] border border-[#D4AF37]/25 bg-[linear-gradient(135deg,#F8F7EF,#E6EFE3)] p-7 shadow-[0_18px_55px_rgba(39,67,48,.07)] sm:p-10" aria-live="polite"><div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-[#B8D0B1]/45 blur-3xl"/><div className="relative"><div className="flex items-center justify-between gap-4"><p className="section-kicker">{item.eyebrow}</p><div className="flex gap-2">{prompts.map((_,i)=><button key={i} type="button" aria-label={`Show idea ${i+1}`} aria-pressed={index===i} onClick={()=>setIndex(i)} className={`h-1.5 rounded-full transition-all ${index===i?"w-8 bg-[#D4AF37]":"w-3 bg-[#5B665D]"}`}/>)}</div></div><h3 className="mt-5 max-w-2xl font-display text-4xl leading-[.98] text-[#294937] sm:text-5xl">{item.title}</h3><p className="mt-4 max-w-xl text-sm leading-7 text-[#617768]">{item.copy}</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/quote" className="liquid-button rounded-full px-6 py-3.5 text-[10px] font-bold uppercase tracking-[.14em]">Build your event brief ↗</Link><button type="button" onClick={()=>setIndex(v=>(v+1)%prompts.length)} className="rounded-full border border-[#D4AF37]/35 px-5 py-3.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#355642]">Next idea →</button></div></div></section>;
}

export function GoogleMapEmbed({address}:{address?:string}){
 if(!address)return <div className="rounded-2xl border border-dashed border-[#D4AF37]/35 bg-[#F8F7EF] p-5 text-xs leading-6 text-[#617768]">Map location will appear here once the verified billing address is configured.</div>;
 const src=`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
 return <div className="overflow-hidden rounded-2xl border border-[#D0DECC] bg-[#F8F7EF] shadow-lg"><iframe title="Visriva billing location map" src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-64 w-full border-0" allowFullScreen/><p className="px-4 py-3 text-xs text-[#617768]">{address}</p></div>;
}

export function PaperBackground({children}:{children:React.ReactNode}){
 return <div className="paper-surface relative overflow-hidden">{children}</div>;
}

export function MotionSubmitButton({children="Send enquiry",pending=false,onClick}:{children?:React.ReactNode;pending?:boolean;onClick?:()=>void}){
 return <button type="button" onClick={onClick} disabled={pending} className="liquid-button group inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-[.15em] disabled:cursor-wait disabled:opacity-60"><span>{pending?"Sending…":children}</span><span className="transition-transform group-hover:translate-x-1">{pending?"◌":"↗"}</span></button>;
}

export function BackTrigger(){
 return <button type="button" onClick={()=>{if(window.history.length>1)window.history.back();else window.location.assign("/");}} className="inline-flex items-center gap-2 rounded-full border border-[#C9D7C4] bg-[#F8F7EF]/90 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#355642] transition hover:border-[#A88F3E] hover:-translate-x-1">← Back</button>;
}

export function DynamicIslandNav({active="Overview"}:{active?:string}){
 const [open,setOpen]=useState(false);
 const items=[["Overview","/#content"],["Experiences","/#experiences"],["Rate card","/rate-card"],["Gallery","/gallery"],["Plan event","/quote"]];
 return <div className="dynamic-island relative z-20 mx-auto w-fit"><button type="button" aria-expanded={open} onClick={()=>setOpen(v=>!v)} className="glass-nav flex items-center gap-3 rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#355642]"><span className="h-2 w-2 rounded-full bg-[#D4AF37]"/>{active}<span className={`transition-transform ${open?"rotate-180":""}`}>⌄</span></button>{open?<nav className="glass-nav absolute left-1/2 top-full mt-2 flex -translate-x-1/2 flex-col gap-1 rounded-2xl p-2 shadow-xl">{items.map(([label,href])=><Link key={label} href={href} onClick={()=>setOpen(false)} className="whitespace-nowrap rounded-xl px-4 py-3 text-xs text-[#617768] transition hover:bg-[#E7EFE3] hover:text-[#D4AF37]">{label}</Link>)}</nav>:null}</div>;
}
