import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { siteUrl } from "@/lib/site";

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
    <html lang="en-IN" className={`${outfit.variable} ${cormorant.variable} ${cinzel.variable} h-full antialiased`}>
      <body className="min-h-full bg-ink text-cream">
        <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-white">Skip to content</a>
        <JsonLd />
        <SiteChrome />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
