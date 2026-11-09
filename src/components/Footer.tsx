import Image from "next/image";
import Link from "next/link";
import { gstin, instagramUrl, linkedinUrl, navigation } from "@/lib/site";
import { WHATSAPP_GREETING, whatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  const whatsapp = whatsAppLink(WHATSAPP_GREETING);
  const links = navigation.flatMap((item) => item.children ? item.children.map((child) => ({ href: child.href, label: child.label })) : [{ href: item.href, label: item.label }]);
  return (
    <footer className="relative overflow-hidden border-t border-[#cad9c5] bg-[#f8f7ef] text-[#203f30]">
      <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full bg-[#bad0b5]/35 blur-3xl" />
      <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-5"><div className="flex items-center gap-3"><Image src="/brand/visriva-logo.png" alt="Visriva emblem" width={800} height={800} className="h-14 w-14 object-contain" /><span className="font-display text-4xl text-[#203f30]">visriva</span></div><p className="mt-6 max-w-sm text-sm leading-7 text-[#687d6c]">Experiential stations that bring people together—and give them something memorable to take home. One team from setup to the final keepsake.</p><p className="mt-7 text-[.62rem] font-semibold uppercase tracking-[.2em] text-[#947d34]">Make the moment stay.</p></div>
        <div className="lg:col-span-3"><p className="section-kicker">Explore</p><ul className="mt-5 space-y-3 text-sm text-[#355642]">{links.map((link)=><li key={link.href}><Link href={link.href} className="transition hover:text-[#947d34]">{link.label} ↗</Link></li>)}<li><Link href="/quote" className="font-semibold text-[#947d34]">Plan your event ↗</Link></li></ul></div>
        <div className="lg:col-span-4"><p className="section-kicker">Studio</p><ul className="mt-5 space-y-3 text-sm leading-6 text-[#355642]"><li>Bengaluru, Karnataka, India</li><li>{whatsapp ? <a href={whatsapp} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[#947d34]">WhatsApp the studio ↗</a> : <Link href="/quote">Request a quote</Link>}</li><li>{gstin ? `GSTIN ${gstin}` : "GSTIN printed on the tax invoice"}</li><li>18% GST on B2B invoices. 50% non-refundable advance to hold a date.</li></ul><div className="mt-6 flex gap-5 text-sm">{instagramUrl ? <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a> : null}{linkedinUrl ? <a href={linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a> : null}</div></div>
      </div>
      <div className="relative border-t border-[#d9e3d5] px-5 py-5 text-center text-xs text-[#8a9a8a]">© 2026 Visriva. All rights reserved.</div>
    </footer>
  );
}
