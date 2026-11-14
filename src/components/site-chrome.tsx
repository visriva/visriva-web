"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

export function SiteChrome() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/qr")) return null;

  return <Suspense fallback={<div className="h-20" />}><Header /></Suspense>;
}
