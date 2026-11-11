"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppBubble } from "@/components/WhatsAppBubble";

export function SiteChrome() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <Suspense fallback={<div className="h-20" />}><Header /></Suspense>
      <Footer />
      <WhatsAppBubble />
    </>
  );
}
