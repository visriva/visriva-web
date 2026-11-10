import Image from "next/image";
import Link from "next/link";
import { gstin, instagramUrl, linkedinUrl, navigation } from "@/lib/site";
import { WHATSAPP_GREETING, whatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  const whatsapp = whatsAppLink(WHATSAPP_GREETING);
  const links = navigation.flatMap((item) =>
    item.children
      ? item.children.map((child) => ({ href: child.href, label: child.label }))
      : [{ href: item.href, label: item.label }]
  );

  return (
    <footer className="relative overflow-hidden border-t border-[#806B2D]/40 bg-[#06140F] text-[#E9E1C4]">
      <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full bg-[#0B5A3D]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-[#B89425]/[0.07] blur-3xl" />
      <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <Image src="/brand/visriva-logo.png" alt="Visriva emblem" width={800} height={800} className="h-14 w-14 object-contain" />
            <span className="font-display text-4xl tracking-wide text-[#F4F0DF]">visriva</span>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-7 text-[#B8C2B4]">
            Experiential stations that bring people together—and give them something memorable to take home. One creative team, from set-up to the final keepsake.
          </p>
          <p className="mt-7 text-[.62rem] font-semibold uppercase tracking-[.2em] text-[#D2B85C]">Make the moment stay.</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#806B2D]/60 px-3 py-2 text-[.58rem] font-semibold uppercase tracking-[.17em] text-[#E4D7A6]">
            <span className="h-2 w-2 rounded-full bg-[#65A878]" /> Bengaluru event studio
          </span>
        </div>

        <div className="lg:col-span-2">
          <p className="text-[.62rem] font-bold uppercase tracking-[.24em] text-[#D2B85C]">Explore</p>
          <ul className="mt-5 space-y-3 text-sm text-[#D7D8C9]">
            {links.map((link) => <li key={link.href}><Link href={link.href} className="transition hover:text-[#E3C65E]">{link.label} ↗</Link></li>)}
            <li><Link href="/quote" className="font-semibold text-[#E3C65E]">Plan your event ↗</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="text-[.62rem] font-bold uppercase tracking-[.24em] text-[#D2B85C]">Contact the studio</p>
          <div className="mt-5 space-y-5 text-sm leading-6 text-[#D7D8C9]">
            <div><p className="mb-1 text-[.55rem] font-bold uppercase tracking-[.18em] text-[#A8A78D]">Location</p><p>Bengaluru, Karnataka, India</p></div>
            <div><p className="mb-1 text-[.55rem] font-bold uppercase tracking-[.18em] text-[#A8A78D]">WhatsApp</p>{whatsapp ? <a href={whatsapp} target="_blank" rel="noreferrer" className="text-[#E4D7A6] underline underline-offset-4 hover:text-[#E3C65E]">Request a quote ↗</a> : <Link href="/quote">Request a quote</Link>}</div>
            <div><p className="mb-1 text-[.55rem] font-bold uppercase tracking-[.18em] text-[#A8A78D]">Business details</p><p>{gstin ? `GSTIN ${gstin}` : "GSTIN printed on the tax invoice"}</p><p className="mt-1 text-xs text-[#9DA995]">18% GST on B2B invoices. 50% non-refundable advance to hold a date.</p></div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            {instagramUrl ? <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="social-glass !border-[#806B2D]/60 !bg-[#10251A] !text-[#E4D7A6] hover:!bg-[#173322]"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1" fill="currentColor" stroke="none"/></svg></a> : null}
            {linkedinUrl ? <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-glass !border-[#806B2D]/60 !bg-[#10251A] !text-[#E4D7A6] hover:!bg-[#173322]"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M5.2 8.6H2V22h3.2zM3.6 2A1.9 1.9 0 1 0 3.6 5.8 1.9 1.9 0 0 0 3.6 2ZM22 13.4c0-4-2.1-5.8-4.9-5.8a4.2 4.2 0 0 0-3.8 2.1V8.6h-3.2V22h3.2v-7.1c0-1.9.4-3.7 2.7-3.7s2.3 2.1 2.3 3.8V22h3.2z"/></svg></a> : null}
          </div>
        </div>

        <div className="border-t border-[#806B2D]/35 pt-8 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-[.62rem] font-bold uppercase tracking-[.24em] text-[#D2B85C]">Make it memorable</p>
          <h2 className="mt-4 font-display text-4xl leading-[.98] text-[#F4F0DF]">Your next event <em className="text-[#D2B85C]">starts here.</em></h2>
          <p className="mt-4 text-xs leading-6 text-[#AEB9AA]">Tell us what you are planning. We’ll help you build the right mix of experiences.</p>
          <Link href="/rate-card" className="mt-8 flex items-center justify-between rounded-xl border border-dashed border-[#806B2D]/70 bg-[#0D2117] px-4 py-4 transition hover:border-[#D2B85C] hover:bg-[#10291B]">
            <span><span className="block text-[.55rem] font-bold uppercase tracking-[.18em] text-[#D2B85C]">Your event, your mix</span><span className="mt-1 block text-sm font-semibold text-[#F4F0DF]">Explore the rate card</span></span><span className="text-xl text-[#E4D7A6]">→</span>
          </Link>
          <Link href="/quote" className="mt-3 inline-flex rounded-full border border-[#806B2D]/70 px-4 py-2 text-xs text-[#E4D7A6] transition hover:border-[#D2B85C]">Need a hand? ↗</Link>
        </div>
      </div>
      <div className="relative flex flex-col justify-between gap-2 border-t border-[#806B2D]/35 px-5 py-5 text-xs text-[#8F9B89] sm:flex-row sm:px-8 lg:px-12">
        <span>© 2026 Visriva. All rights reserved.</span>
        <span>Experiences designed to bring people together.</span>
      </div>
    </footer>
  );
}
