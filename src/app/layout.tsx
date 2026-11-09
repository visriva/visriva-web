import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Outfit, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppBubble } from "@/components/WhatsAppBubble";
import { siteUrl } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-jakarta", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-playfair", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-outfit", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cinzel", display: "swap" });

const title = "Visriva | Experiential stations for events in Bengaluru";
const description = "Create unforgettable event moments with photo experiences, AI-powered keepsakes, live merchandise, VR and interactive games. One team, end to end.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Visriva" },
  description,
  applicationName: "Visriva",
  keywords: ["event engagement Bengaluru", "AI photo booth Bangalore", "corporate event photo booth", "VR engagement events", "live event merchandise", "DTF t-shirt printing Bangalore"],
  openGraph: { type: "website", locale: "en_IN", url: siteUrl, siteName: "Visriva", title, description, images: [{ url: "/brand/visriva-logo.png", width: 800, height: 800, alt: "Visriva gold emblem and wordmark" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/visriva-logo.png"] },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: { icon: "/brand/visriva-logo.png", apple: "/brand/visriva-logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${jakarta.variable} ${playfair.variable} ${outfit.variable} ${cormorant.variable} ${cinzel.variable} h-full antialiased`}>
      <body className="min-h-full bg-ink text-cream">
        <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-white">Skip to content</a>
        <JsonLd />
        <Suspense fallback={<div className="h-20" />}><Header /></Suspense>
        {children}
        <Footer />
        <WhatsAppBubble />
      </body>
    </html>
  );
}
