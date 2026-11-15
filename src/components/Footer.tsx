import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/ArrowUpRightIcon";
import { gstin, navigation } from "@/lib/site";
import type { SiteGlobals } from "@/lib/site-globals-types";
import { WHATSAPP_GREETING, whatsAppLink } from "@/lib/whatsapp";

export function Footer({ globals }: { globals: SiteGlobals }) {
  const whatsapp = whatsAppLink(WHATSAPP_GREETING);
  const instagramUrl = globals.instagram_url;
  const linkedinUrl = globals.linkedin_url;
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
            <Image src="/brand/visriva-logo.png" alt="Visriva" width={140} height={56} className="h-12 w-auto object-contain" />
          </div>
          <p className="mt-6 max-w-sm text-sm leading-7 text-[#B8C2B4]">{globals.footer_blurb}</p>
          <p className="mt-7 text-[.62rem] font-semibold uppercase tracking-[.2em] text-[#D2B85C]">{globals.footer_tagline}</p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#806B2D]/60 px-3 py-2 text-[.58rem] font-semibold uppercase tracking-[.17em] text-[#E4D7A6]">
            <span className="h-2 w-2 rounded-full bg-[#65A878]" /> {globals.footer_badge}
          </span>
        </div>

        <div className="lg:col-span-2">
          <p className="text-[.62rem] font-bold uppercase tracking-[.24em] text-[#D2B85C]">Explore</p>
          <ul className="mt-5 space-y-3 text-sm text-[#D7D8C9]">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex items-center gap-1 transition hover:text-[#E3C65E]">
                  {link.label}
                  <ArrowUpRightIcon className="h-3.5 w-3.5 opacity-70" />
                </Link>
              </li>
            ))}
            <li>
              <Link href="/quote" className="inline-flex items-center gap-1 font-semibold text-[#E3C65E]">
                Plan your event
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="text-[.62rem] font-bold uppercase tracking-[.24em] text-[#D2B85C]">Contact the studio</p>
          <div className="mt-5 space-y-5 text-sm leading-6 text-[#D7D8C9]">
            <div><p className="mb-1 text-[.55rem] font-bold uppercase tracking-[.18em] text-[#A8A78D]">Location</p><p>{globals.footer_location}</p></div>
            <div>
              <p className="mb-1 text-[.55rem] font-bold uppercase tracking-[.18em] text-[#A8A78D]">WhatsApp</p>
              {whatsapp ? (
                <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#E4D7A6] underline underline-offset-4 hover:text-[#E3C65E]">
                  Request a quote
                  <ArrowUpRightIcon className="h-3.5 w-3.5" />
                </a>
              ) : (
                <Link href="/quote">Request a quote</Link>
              )}
            </div>
            <div><p className="mb-1 text-[.55rem] font-bold uppercase tracking-[.18em] text-[#A8A78D]">Business details</p><p>{gstin ? `GSTIN ${gstin}` : "GSTIN printed on the tax invoice"}</p><p className="mt-1 text-xs text-[#9DA995]">{globals.footer_gst_note}</p></div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            {instagramUrl ? <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="social-glass !border-[#806B2D]/60 !bg-[#10251A] !text-[#E4D7A6] hover:!bg-[#173322]"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1" fill="currentColor" stroke="none"/></svg></a> : null}
            {linkedinUrl ? <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-glass !border-[#806B2D]/60 !bg-[#10251A] !text-[#E4D7A6] hover:!bg-[#173322]"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M5.2 8.6H2V22h3.2zM3.6 2A1.9 1.9 0 1 0 3.6 5.8 1.9 1.9 0 0 0 3.6 2ZM22 13.4c0-4-2.1-5.8-4.9-5.8a4.2 4.2 0 0 0-3.8 2.1V8.6h-3.2V22h3.2v-7.1c0-1.9.4-3.7 2.7-3.7s2.3 2.1 2.3 3.8V22h3.2z"/></svg></a> : null}
          </div>
        </div>

        <div className="border-t border-[#806B2D]/35 pt-8 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-[.62rem] font-bold uppercase tracking-[.24em] text-[#D2B85C]">Make it memorable</p>
          <h2 className="mt-4 font-display text-4xl leading-[.98] text-[#F4F0DF]">
            {globals.footer_cta_title} <em className="text-[#D2B85C]">{globals.footer_cta_accent}</em>
          </h2>
          <p className="mt-4 text-xs leading-6 text-[#AEB9AA]">{globals.footer_cta_copy}</p>
          <Link href="/rate-card" className="mt-8 flex items-center justify-between rounded-xl border border-dashed border-[#806B2D]/70 bg-[#0D2117] px-4 py-4 transition hover:border-[#D2B85C] hover:bg-[#10291B]">
            <span><span className="block text-[.55rem] font-bold uppercase tracking-[.18em] text-[#D2B85C]">Your event, your mix</span><span className="mt-1 block text-sm font-semibold text-[#F4F0DF]">Explore the rate card</span></span><span className="text-xl text-[#E4D7A6]">→</span>
          </Link>
          <Link href="/quote" className="mt-3 inline-flex items-center gap-1 rounded-full border border-[#806B2D]/70 px-4 py-2 text-xs text-[#E4D7A6] transition hover:border-[#D2B85C]">
            Need a hand?
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
      <div className="relative flex flex-col justify-between gap-2 border-t border-[#806B2D]/35 px-5 py-5 text-xs text-[#8F9B89] sm:flex-row sm:px-8 lg:px-12">
        <span>{globals.footer_copyright}</span>
        <span>{globals.footer_rights_line}</span>
      </div>
    </footer>
  );
}
