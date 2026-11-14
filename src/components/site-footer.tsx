"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { WhatsAppBubble } from "@/components/WhatsAppBubble";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/qr")) return null;

  return (
    <>
      <Footer />
      <WhatsAppBubble />
    </>
  );
}
