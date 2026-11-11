import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteWizard } from "@/components/QuoteWizard";
import { pageMeta } from "@/lib/seo";
import { getWebsitePage } from "@/lib/website-pages";
import { getPublishedCatalog } from "@/lib/services-catalog";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWebsitePage("quote");
  return pageMeta(page?.seo_title || "Request a quote", page?.seo_description || "Build an event brief with Visriva. Select your stations, share your event details, and receive a tailored quote.", "/quote");
}

export default async function QuotePage() {
  const catalog = await getPublishedCatalog();

  return (
    <main>
      <Suspense fallback={<div className="min-h-[70svh]" />}>
        <QuoteWizard
          catalog={catalog.list}
          bookable={catalog.bookable}
        />
      </Suspense>
    </main>
  );
}