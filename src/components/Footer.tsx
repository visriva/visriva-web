"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  brandName,
  businessName,
  contactEmail,
  gstin,
  instagramUrl,
  linkedinUrl,
  navigation,
  phoneDisplay,
  phoneTel,
} from "@/lib/site";
import { WHATSAPP_GREETING, whatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/live")) return null;

  const whatsapp = whatsAppLink(WHATSAPP_GREETING);
  const links = navigation.flatMap((item) =>
    item.children
      ? item.children.map((child) => ({ href: child.href, label: child.label }))
      : [{ href: item.href, label: item.label }],
  );

  return (
    <footer className="relative border-t border-gold/25 bg-gradient-to-b from-deep to-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
      />
      <div className="mx-auto grid max-w-[1500px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-5">
          <Image
            src="/brand/visriva-green.png"
            alt="Visriva"
            width={160}
            height={160}
            className="h-24 w-24 object-cover ring-1 ring-gold/40"
          />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-mist/80">
            {businessName} · {brandName}. Photo booths, AI merchandise, games, and live gifting.
            Based in Bengaluru, travelling across India. Owned inventory. One crew from load-in to
            last print.
          </p>
        </div>

        <div className="lg:col-span-3">
          <p className="font-royal text-[0.64rem] uppercase tracking-[0.28em] text-gold">
            House
          </p>
          <ul className="mt-5 space-y-2 text-sm text-cream/90">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-gold">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/quote" className="link-gold">
                Quote / Book
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-4">
          <p className="font-royal text-[0.64rem] uppercase tracking-[0.28em] text-gold">
            Studio
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-cream/90">
            <li>Bengaluru, Karnataka, India</li>
            <li>
              <a href={`tel:${phoneTel}`} className="link-gold">
                {phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${contactEmail}`} className="link-gold">
                {contactEmail}
              </a>
            </li>
            <li>
              {whatsapp ? (
                <a href={whatsapp} className="link-gold" target="_blank" rel="noreferrer">
                  WhatsApp the studio
                </a>
              ) : (
                <Link href="/quote" className="link-gold">
                  Request a quote
                </Link>
              )}
            </li>
            <li>{gstin ? `GSTIN ${gstin}` : "GSTIN printed on the tax invoice"}</li>
            <li>18% GST on B2B invoices. 50% non-refundable advance to hold a date.</li>
            <li>Bengaluru transit ₹2,000 – ₹4,000.</li>
          </ul>
          <div className="mt-6 flex gap-5 text-sm">
            <a href={instagramUrl} className="link-gold text-champagne" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={linkedinUrl} className="link-gold text-champagne" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gold/15 px-4 py-5 text-center text-[0.7rem] tracking-wide text-mist/60 sm:px-6">
        © 2026 Visriva. All rights reserved. Preview photography stands in until the house archive is placed.
      </div>
    </footer>
  );
}
