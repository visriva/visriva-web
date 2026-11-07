import type { Metadata } from "next";
import {
  Bebas_Neue,
  Caveat,
  DM_Serif_Display,
  Gloock,
  Italiana,
  Libre_Bodoni,
  Manrope,
  Pacifico,
  Rye,
} from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { StudioGlassNav } from "@/components/StudioGlassNav";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppBubble } from "@/components/WhatsAppBubble";
import { brandLogoSrc, siteUrl } from "@/lib/site";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const gloock = Gloock({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gloock",
  display: "swap",
});

const libreBodoni = Libre_Bodoni({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-bodoni",
  display: "swap",
});

const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italiana",
  display: "swap",
});

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-caveat", display: "swap" });
const rye = Rye({ subsets: ["latin"], weight: "400", variable: "--font-rye", display: "swap" });
const epstonik = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-epstonik",
  display: "swap",
});
const pacifico = Pacifico({ subsets: ["latin"], weight: "400", variable: "--font-pacifico", display: "swap" });

const title = "Visriva · Live stations for corporate events and weddings · Bengaluru";
const description =
  "Visriva Live Station — photo booths, AI and merchandise, games, and live gifting for corporate events and celebrations in Bengaluru and across India. Best live station vendor in Bangalore for booths and on-site keepsakes. Owned inventory. One team, end to end.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Visriva",
  },
  description,
  applicationName: "Visriva",
  keywords: [
    "Visriva",
    "Visriva Live Station",
    "best live station vendor Bangalore",
    "corporate event photo booth Bangalore",
    "wedding photo booth Bangalore",
    "live magnet station",
    "VR station for corporate events India",
    "DTF t-shirt printing Bangalore",
    "AI photo booth Bangalore",
    "corporate event services Bengaluru",
    "corporate event gifting India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Visriva",
    title,
    description,
    images: [
      {
        url: brandLogoSrc,
        width: 1200,
        height: 1200,
        alt: "Visriva golden lotus emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [brandLogoSrc],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: { icon: brandLogoSrc, apple: brandLogoSrc },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${manrope.variable} ${gloock.variable} ${libreBodoni.variable} ${italiana.variable} ${bebasNeue.variable} ${caveat.variable} ${rye.variable} ${epstonik.variable} ${pacifico.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-ink text-cream">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-deep"
        >
          Skip to content
        </a>
        <JsonLd />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-3 z-[40] hidden border border-gold/10 shadow-[inset_0_0_80px_rgba(201,162,39,0.04)] lg:block"
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-6 z-[39] hidden border border-white/[0.04] lg:block"
        />
        <Suspense fallback={<div className="h-[4.5rem]" />}>
          <StudioGlassNav />
        </Suspense>
        {children}
        <Footer />
        <WhatsAppBubble />
      </body>
    </html>
  );
}
