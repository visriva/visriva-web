import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/ArrowUpRightIcon";
import {
  ActivityBadge,
  GoogleMapEmbed,
  LiquidGlassFooter,
  TearTicket,
  WhatsAppChatTeaser,
} from "@/components/FramerSuite";
import { gstin, navigation, phoneDisplay } from "@/lib/site";
import type { SiteGlobals } from "@/lib/site-globals-types";
import { WHATSAPP_GREETING, whatsAppLink } from "@/lib/whatsapp";

export function Footer({ globals }: { globals: SiteGlobals }) {
  const whatsapp = whatsAppLink(WHATSAPP_GREETING);
  const instagramUrl = globals.instagram_url;
  const linkedinUrl = globals.linkedin_url;
  const links = navigation.flatMap((item) =>
    item.children
      ? item.children.map((child) => ({ href: child.href, label: child.label }))
      : [{ href: item.href, label: item.label }],
  );

  return (
    <footer className="relative overflow-hidden border-t border-[#806B2D]/40 bg-[#06140F] pb-20 text-[#E9E1C4] md:pb-8">
      <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full bg-[#0B5A3D]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-[#B89425]/[0.07] blur-3xl" />
      <div className="relative mx-auto max-w-[1500px] gap-10 px-5 py-16 sm:px-8 lg:grid lg:grid-cols-12 lg:px-12">
        <LiquidGlassFooter className="lg:col-span-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Image src="/brand/visriva-logo.png" alt="Visriva" width={140} height={56} className="h-12 w-auto object-contain" />
            <ActivityBadge label={globals.footer_badge} />
          </div>
          <p className="mt-6 max-w-sm text-sm leading-7 text-[#B8C2B4]">{globals.footer_blurb}</p>
          <p className="mt-5 text-[.62rem] font-semibold uppercase tracking-[.2em] text-[#D2B85C]">{globals.footer_tagline}</p>
        </LiquidGlassFooter>

        <div className="mt-10 lg:col-span-2 lg:mt-0">
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
              <Link href="/reviews" className="inline-flex items-center gap-1 transition hover:text-[#E3C65E]">
                Client reviews
                <ArrowUpRightIcon className="h-3.5 w-3.5 opacity-70" />
              </Link>
            </li>
            <li>
              <Link href="/quote" className="inline-flex items-center gap-1 font-semibold text-[#E3C65E]">
                Plan your event
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-10 space-y-6 lg:col-span-3 lg:mt-0">
          <LiquidGlassFooter>
            <p className="text-[.62rem] font-bold uppercase tracking-[.24em] text-[#D2B85C]">Contact &amp; billing</p>
            <p className="mt-3 text-sm leading-6 text-[#D7D8C9]">{globals.footer_location}</p>
            <div className="mt-5">
              <GoogleMapEmbed address={globals.footer_location} />
            </div>
            <p className="mt-4 text-xs text-[#9DA995]">{globals.footer_gst_note}</p>
            <p className="mt-2 text-xs">{gstin ? `GSTIN ${gstin}` : "GSTIN on tax invoice"}</p>
          </LiquidGlassFooter>
          {whatsapp ? <WhatsAppChatTeaser href={whatsapp} phone={phoneDisplay} /> : null}
          <div className="flex items-center gap-3">
            {instagramUrl ? (
              <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="social-glass !border-[#806B2D]/60 !bg-[#10251A] !text-[#E4D7A6] hover:!bg-[#173322]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </a>
            ) : null}
            {linkedinUrl ? (
              <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-glass !border-[#806B2D]/60 !bg-[#10251A] !text-[#E4D7A6] hover:!bg-[#173322]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M5.2 8.6H2V22h3.2zM3.6 2A1.9 1.9 0 1 0 3.6 5.8 1.9 1.9 0 0 0 3.6 2ZM22 13.4c0-4-2.1-5.8-4.9-5.8a4.2 4.2 0 0 0-3.8 2.1V8.6h-3.2V22h3.2v-7.1c0-1.9.4-3.7 2.7-3.7s2.3 2.1 2.3 3.8V22h3.2z" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-10 border-t border-[#806B2D]/35 pt-8 lg:col-span-3 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-[.62rem] font-bold uppercase tracking-[.24em] text-[#D2B85C]">Make it memorable</p>
          <h2 className="mt-4 font-display text-4xl leading-[.98] text-[#F4F0DF]">
            {globals.footer_cta_title} <em className="text-[#D2B85C]">{globals.footer_cta_accent}</em>
          </h2>
          <p className="mt-4 text-xs leading-6 text-[#AEB9AA]">{globals.footer_cta_copy}</p>
          <div className="mt-8">
            <TearTicket href="/rate-card" label="Explore the rate card" />
          </div>
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