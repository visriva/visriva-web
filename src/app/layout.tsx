import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Outfit } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppBubble } from "@/components/WhatsAppBubble";
import { siteUrl } from "@/lib/site";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

const title = "Visriva · Live stations for corporate events in Bangalore";
const description =
  "Best live station vendor in Bangalore for corporate events. Photo booths, AI merchandise, VR, and DTF t-shirt printing. Owned inventory. One team, end to end.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Visriva",
  },
  description,
  applicationName: "Visriva",
  keywords: [
    "best live station vendor Bangalore",
    "corporate event photo booth Bangalore",
    "VR station for corporate events India",
    "DTF t-shirt printing Bangalore",
    "AI photo booth Bangalore",
    "corporate event services Bengaluru",
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
        url: "/brand/visriva-green.png",
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
    images: ["/brand/visriva-green.png"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: { icon: "/brand/visriva-green.png", apple: "/brand/visriva-green.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${outfit.variable} ${cormorant.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-cream">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-deep"
        >
          Skip to content
        </a>
        <JsonLd />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-2 z-[40] hidden border border-gold/15 lg:block"
        />
        <Suspense fallback={<div className="h-20" />}>
          <Header />
        </Suspense>
        {children}
        <Footer />
        <WhatsAppBubble />
      </body>
    </html>
  );
}
