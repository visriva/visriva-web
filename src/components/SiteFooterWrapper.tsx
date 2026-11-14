"use client";

import { usePathname } from "next/navigation";

export function SiteFooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/qr")) return null;
  return children;
}