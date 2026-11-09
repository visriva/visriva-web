import Image from "next/image";
import Link from "next/link";
import { gstin,instagramUrl,linkedinUrl,navigation } from "@/lib/site";
import { WHATSAPP_GREETING,whatsAppLink } from "@/lib/whatsapp";
import { ActivityBadge,GoogleMapEmbed,LightBulbButton,TearTicket } from "@/components/FramerSuite";

export function Footer(){
 const whatsapp=whatsAppLink(WHATSAPP_GREETING);
 const links=navigation.flatMap(item=>item.children?item.children.map(child=>({href:child.href,label:child.label})):[{href:item.href,label:item.label}]);
 const billingAddress=process.env.NEXT_PUBLIC_BILLING_ADDRESS;
 return <footer className="relative overflow-hidden border-t border-[#CAD9C5] bg-[#E6EFE3] px-4 pb-5 pt-14 text-[#203F30] sm:px-7">
  <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full bg-[#BAD0B5]/45 blur-3xl"/>
  <div className="glass-footer-panel relative mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-12">
   <div className="grid gap-12 lg:grid-cols-12">
    <div className="lg:col-span-4"><div className="flex items-center gap-3"><Image src="/brand/visriva-logo.png" alt="Visriva emblem" width={800} height={800} className="h-14 w-14 object-contain"/><span className="font-display text-4xl text-[#203F30]">visriva</span></div><p className="mt-6 max-w-sm text-sm leading-7 text-[#687D6C]">Experiential stations that bring people together—and give them something memorable to take home. One team from setup to the final keepsake.</p><div className="mt-6"><ActivityBadge label="Bengaluru event studio"/></div><p className="mt-7 text-[.62rem] font-semibold uppercase tracking-[.2em] text-[#947D34]">Make the moment stay.</p></div>
    <div className="lg:col-span-2"><p className="section-kicker">Explore</p><ul className="mt-5 space-y-3 text-sm text-[#355642]">{links.map(link=><li key={link.href}><Link href={link.href} className="transition hover:text-[#947D34]">{link.label} ↗</Link></li>)}<li><Link href="/quote" className="font-semibold text-[#947D34]">Plan your event ↗</Link></li></ul></div>
    <div className="lg:col-span-3"><p className="section-kicker">Billing & studio</p><ul className="mt-5 space-y-3 text-sm leading-6 text-[#355642]"><li>Bengaluru, Karnataka, India</li><li>{whatsapp?<a href={whatsapp} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[#947D34]">WhatsApp the studio ↗</a>:<Link href="/quote">Request a quote</Link>}</li><li>{gstin ? "GSTIN " + gstin : "GSTIN printed on the tax invoice"}</li><li>18% GST on B2B invoices. 50% non-refundable advance to hold a date.</li></ul><div className="mt-5"><GoogleMapEmbed address={billingAddress}/></div><div className="mt-5 flex gap-5 text-sm">{instagramUrl?<a href={instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a>:null}{linkedinUrl?<a href={linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a>:null}</div></div>
    <div className="flex flex-col items-start justify-between gap-5 border-t border-[#D9E3D5] pt-7 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><div><p className="section-kicker">Make it memorable</p><p className="mt-3 font-display text-3xl leading-none text-[#294937]">Your next event<br/><em className="gold-gradient">starts here.</em></p></div><TearTicket/><LightBulbButton/></div>
   </div>
  </div>
  <div className="relative mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-2 py-5 text-xs text-[#8A9A8A]"><span>© 2026 Visriva. All rights reserved.</span><span>Experiences designed to bring people together.</span></div>
 </footer>;
}