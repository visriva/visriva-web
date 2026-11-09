"use client";

import Link from "next/link";
import { useState } from "react";

const rigs = [
  { id:"dslr", tab:"DSLR Booth", eyebrow:"Corporate 10th anniversary · Bengaluru", title:"Unlimited Instant DSLR Red-Carpet Rig", spec:"Canon DSLR + DNP DS620A Print Server", output:"✓ 412 Lab Prints in 3.5 Hours", node:"visriva/webbooth", server:"USB 0ms READY", hub:"AI MODERATED", size:"8ft × 8ft · 220V AC", speed:"12-SEC PRINT SPEED" },
  { id:"tote", tab:"Tote Stamp Bar", eyebrow:"Live merchandise · Brand activation", title:"Personalised Tote Customisation Station", spec:"Live design desk + heat press workflow", output:"✓ On-site customised guest keepsakes", node:"visriva/merch", server:"PRESS READY", hub:"LIVE DESIGN", size:"10ft × 8ft · 220V AC", speed:"LIVE CUSTOM PRINT" },
  { id:"vr", tab:"Dual VR Arena", eyebrow:"Immersive play · Employee engagement", title:"Dual Headset VR Engagement Arena", spec:"Dual VR rigs + guided game library", output:"✓ Hosted multiplayer guest sessions", node:"visriva/vrhub", server:"2 HEADSETS READY", hub:"SESSION SAFE", size:"12ft × 10ft · 220V AC", speed:"DUAL PLAYER MODE" },
];

export function Hero() {
  const [active,setActive]=useState("dslr");
  const [muted,setMuted]=useState(true);
  const rig=rigs.find((item)=>item.id===active) ?? rigs[0];
  return (
    <section className="relative overflow-hidden bg-[#030e0a] pt-[78px] text-[#f5f0df]">
      <div className="hero-grid absolute inset-0 pointer-events-none" />
      <div className="absolute -left-48 top-24 h-[36rem] w-[36rem] rounded-full bg-[#08734b]/20 blur-[120px] pointer-events-none" />
      <div className="relative z-10 flex min-h-9 flex-wrap items-center justify-between gap-2 border-y border-[#b8a04d]/20 bg-[#073323]/90 px-5 py-2.5 text-[10px] sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 rounded border border-[#b8a04d]/40 px-2 py-1 font-mono uppercase tracking-[.2em] text-[#d6c47c]"><i className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_9px_#34d399]" /> Live fleet status</span><span className="text-[#d5d9c9]/80">100% in-house hardware fleet · Print servers & dual VR rigs ready across Bengaluru</span></div>
        <div className="flex items-center gap-5 font-mono text-[#c3cdbf]"><span className="hidden sm:inline">GUESTS SERVED: <b className="text-[#e4c85c]">14,820</b></span><Link href="/giveaway" className="underline decoration-[#b8a04d]/50 underline-offset-4">♙ Guest QR Giveaway ↗</Link></div>
      </div>
      <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-12 px-5 pb-16 pt-16 sm:px-8 lg:min-h-[650px] lg:grid-cols-[1.2fr_.9fr] lg:gap-16 lg:px-12 lg:py-20">
        <div className="max-w-[760px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#b8a04d]/45 bg-[#073d2a]/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.19em] text-[#e7d9a5]"><span className="text-[#e5c44d]">✧</span> Bengaluru’s premier live engagement studio</div>
          <h1 className="hero-display mt-6 text-[clamp(3.6rem,7vw,6.8rem)] leading-[.91] tracking-[-.045em] text-[#f5f0df]">Crowds around<br/>every corner.<br/><span className="text-[#f0dfab]">Zero vendor</span><br/><span className="gold-gradient">chaos.</span></h1>
          <p className="mt-7 max-w-[680px] text-base leading-7 text-[#c2c9bd] sm:text-lg">We deploy owned, studio-grade Photo Booths, AI Transformation Rigs, Live Merch Presses, and VR Arenas for Bengaluru’s biggest corporate events. <strong className="text-[#f5f0df]">Transparent starting rates. End-to-end execution.</strong></p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/quote" className="liquid-button inline-flex items-center gap-3 rounded-xl px-7 py-4 text-sm font-semibold">Request a quote <span className="text-lg">→</span></Link><Link href="/rate-card" className="inline-flex items-center gap-3 rounded-xl border border-[#b8a04d]/50 bg-[#073d2a]/70 px-6 py-4 text-sm font-medium text-[#f5f0df] transition hover:bg-[#0b5138]"><span className="text-[#e5c44d]">▣</span> Open rate card</Link><Link href="/client-requirements" className="inline-flex items-center gap-3 rounded-xl border border-[#b8a04d]/30 px-6 py-4 text-sm text-[#b7c5b7] transition hover:border-[#b8a04d] hover:text-[#f5f0df]">↗ Venue requirements</Link></div>
          <div className="mt-8 flex flex-wrap gap-2">{["100% Owned Fleet","12-Sec Lab Prints","6-Hr Advance Setup","Private Offline AI"].map((label,i)=><span key={label} className="inline-flex items-center gap-2 rounded-lg border border-[#b8a04d]/25 bg-[#062619]/80 px-3 py-2 font-mono text-[10px] tracking-wide text-[#e4dfc8]"><span className="text-[#d9bd4d]">{["⛨","▤","◷","⌁"][i]}</span>{label}</span>)}</div>
        </div>
        <div className="relative mx-auto w-full max-w-[590px]">
          <div className="absolute -inset-5 rounded-[2rem] bg-[#08734b]/10 blur-2xl" />
          <div className="relative rounded-2xl border border-[#b8a04d]/45 bg-gradient-to-br from-[#0b3d2b] via-[#061a12] to-[#020b07] p-5 shadow-[0_30px_90px_rgba(0,0,0,.45)] sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-[#b8a04d]/25 pb-4"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.12em] text-[#e7dfc4]"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" /> Visriva production rig // telemetry</div><button type="button" onClick={()=>setMuted(!muted)} className="rounded-md border border-[#b8a04d]/30 px-2 py-1 text-[10px] text-[#aebbad]">{muted?"⌁ Audio muted":"♫ Audio on"}</button></div>
            <div className="mt-4 rounded-xl border border-[#b8a04d]/35 bg-[#020d08]/90 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2"><span className="rounded bg-[#d8b63d] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-[#07150d]">{rig.speed}</span><span className="rounded border border-[#b8a04d]/25 bg-[#0b2c1e] px-2 py-1 font-mono text-[9px] text-[#aebcad]">{rig.size}</span></div>
              <p className="mt-5 text-[10px] uppercase tracking-[.13em] text-[#e3bd43]">{rig.eyebrow}</p><h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#f5f0df] sm:text-4xl">{rig.title}</h2>
              <div className="mt-4 flex flex-wrap gap-2"><span className="rounded-md border border-emerald-500/35 bg-[#0b3c29] px-3 py-1.5 text-[10px] text-[#d8d9bd]">⚙ {rig.spec}</span><span className="rounded-md border border-emerald-500/30 bg-[#073523] px-3 py-1.5 text-[10px] text-emerald-300">{rig.output}</span></div>
              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#b8a04d]/20 pt-4 font-mono"><div className="rounded-md border border-[#b8a04d]/15 bg-[#082719] p-2"><p className="text-[8px] text-[#8eaa98]">CAPTURE NODE</p><p className="mt-1 truncate text-[9px] font-semibold text-[#e4e7d7]">{rig.node}</p></div><div className="rounded-md border border-[#b8a04d]/15 bg-[#082719] p-2"><p className="text-[8px] text-[#8eaa98]">PRINT SERVER</p><p className="mt-1 truncate text-[9px] font-semibold text-emerald-300">{rig.server}</p></div><div className="rounded-md border border-[#b8a04d]/15 bg-[#082719] p-2"><p className="text-[8px] text-[#8eaa98]">GUEST QR HUB</p><p className="mt-1 truncate text-[9px] font-semibold text-[#e5c44d]">{rig.hub}</p></div></div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">{rigs.map((item)=><button type="button" key={item.id} onClick={()=>setActive(item.id)} className={`rounded-lg border px-2 py-3 text-[10px] font-medium transition ${active===item.id?"border-[#d5b83d] bg-[#b99b2e]/20 text-[#f0dc8c] shadow-[inset_0_0_18px_rgba(184,160,77,.08)]":"border-[#b8a04d]/20 bg-[#071a11] text-[#aebbad] hover:border-[#b8a04d]/55"}`}>{item.tab}</button>)}</div>
          </div>
          <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 border-r border-t border-[#d2b64e]/60" />
        </div>
      </div>
    </section>
  );
}
