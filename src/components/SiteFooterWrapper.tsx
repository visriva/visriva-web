"use client";

import { usePathname } from "next/navigation";

const HIDE_CHROME_PREFIXES = ["/admin", "/qr", "/docforclient", "/docforreview"] as const;

export function SiteFooterWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  if (pathname && HIDE_CHROME_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  return <div className={className}>{children}</div>;
}