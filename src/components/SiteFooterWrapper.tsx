"use client";

import { usePathname } from "next/navigation";

const HIDE_CHROME_PREFIXES = ["/admin", "/qr", "/docforclient", "/docforreview"] as const;

export function SiteFooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (HIDE_CHROME_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  return children;
}