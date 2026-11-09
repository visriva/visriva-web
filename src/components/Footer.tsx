import Image from "next/image";
import Link from "next/link";
import { gstin,instagramUrl,linkedinUrl,navigation } from "@/lib/site";
import { WHATSAPP_GREETING,whatsAppLink } from "@/lib/whatsapp";
import { ActivityBadge,GoogleMapEmbed,LightBulbButton,TearTicket } from "@/components/FramerSuite";

function SocialIcon({kind}:{kind:"instagram"|"linkedin"|"whatsapp"}){
 const paths={
  instagram:<><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
  linkedin:<><path d="M5 9v10M5 5v.01M10 19v-6a3 3 0 0 1 6 0v6M10 10v9"/></>,
  whatsapp:<><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M9 9c.5 2 2 3.5 4 4l1-1 2 1c-.3 1.5-1.4 2-2.7 1.7-3-.8-5.2-3-6-6-.3-1.3.2-2.4 1.7-2.7l1 2Z"/></>
 };
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[18px] w-[18px]">{paths[kind]}</svg>;
}

export function Footer(){
 const whatsapp=whatsAppLink(WHATSAPP_GREETING);
 const links=navigation.flatMap(item=>item.children?item.children.map(child=>({href:child.href,label:child.label})):[{href:item.href,label:item.label}]);
 const billingAddress=process.env.NEXT_PUBLIC_BILLING_ADDRESS;
 return <footer className="relative overflow-hidden border-t border-[#C9A227]/25 bg-[#050B08] px-4 pb-5 pt-16 text-[#F5F0E5] sm:px-7">
  <div className="pointer-events-none absolute -right-28 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#0B6A49]/20 blur-[100px]"/>
  <div className="pointer-events-none absolute -left-28 bottom-0 h-[22rem] w-[22rem] rounded-full bg-[#C9A227]/[.07] blur-[100px]"/>
  <div className="glass-footer-panel relative mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-12">
   <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent"/>
   <div className="grid gap-12 lg:grid-cols-12">
    <div className="lg:col-span-4">
     <div className="flex items-center gap-3"><Image src="/brand/visriva-logo.png" alt="Visriva emblem" width={800} height={800} className="h-14 w-14 object-contain"/><span className="font-display text-4xl tracking-[.08em] text-[#F5F0E5]">VISRIVA</span></div>
     <p className="mt-6 max-w-sm text-sm leading-7 text-[#CFC5A9]">Experiential stations that bring people together—and give them something memorable to take home. One creative team, from set-up to the final keepsake.</p>
     <div className="mt-6"><ActivityBadge label="Bengaluru event studio"/></div>
     <p className="mt-7 text-[.62rem] font-semibold uppercase tracking-[.2em] text-[#D4AF37]">Make the moment stay.</p>
     <div className="mt-7 flex items-center gap-3">
      {instagramUrl?<a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Visriva on Instagram" className="social-glass"><SocialIcon kind="instagram"/></a>:null}
      {linkedinUrl?<a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="Visriva on LinkedIn" className="social-glass"><SocialIcon kind="linkedin"/></a>:null}
      {whatsapp?<a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Chat with Visriva on WhatsApp" className="social-glass"><SocialIcon kind="whatsapp"/></a>:null}
     </div>
    </div>
    <div className="lg:col-span-2"><p className="section-kicker">Explore</p><ul className="mt-5 space-y-3 text-sm text-[#D8D0BF]">{links.map(link=><li key={link.href}><Link href={link.href} className="transition hover:text-[#D4AF37]">{link.label} ↗</Link></li>)}<li><Link href="/quote" className="font-semibold text-[#D4AF37]">Plan your event ↗</Link></li></ul></div>
    <div className="lg:col-span-3"><p className="section-kicker">Contact the studio</p><div className="mt-5 space-y-4 text-sm leading-6 text-[#D8D0BF]">
      <div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#A69E86]">Location</p><p className="mt-1">Bengaluru, Karnataka, India</p></div>
      <div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#A69E86]">WhatsApp</p>{whatsapp?<a href={whatsapp} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-2 text-[#E8D9A8] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#D4AF37]">Chat with our team ↗</a>:<Link href="/quote" className="mt-1 inline-block text-[#E8D9A8]">Request a quote ↗</Link>}</div>
      <div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#A69E86]">Business details</p><p className="mt-1">{gstin ? "GSTIN " + gstin : "GSTIN printed on the tax invoice"}</p><p className="mt-1 text-xs text-[#A69E86]">18% GST on B2B invoices. 50% non-refundable advance to hold a date.</p></div>
     </div>
     <div className="mt-5"><GoogleMapEmbed address={billingAddress}/></div>
    </div>
    <div className="flex flex-col items-start justify-between gap-6 border-t border-[#C9A227]/20 pt-7 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><div><p className="section-kicker">Make it memorable</p><p className="mt-3 font-display text-3xl leading-[1.15] text-[#F5F0E5]">Your next event<br/><em className="gold-gradient">starts here.</em></p><p className="mt-4 max-w-xs text-xs leading-6 text-[#BDB49C]">Tell us what you are planning. We’ll help you build the right mix of experiences.</p></div><div className="flex flex-wrap gap-3"><TearTicket/><LightBulbButton/></div></div>
   </div>
  </div>
  <div className="relative mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-2 py-6 text-[10px] text-[#A69E86]"><span>© 2026 Visriva. All rights reserved.</span><span>Experiences designed to bring people together.</span><Link href="/privacy" className="transition hover:text-[#D4AF37]">Privacy</Link></div>
 </footer>;
}
