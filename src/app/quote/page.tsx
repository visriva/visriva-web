import { Suspense } from "react";
import { MoodSection } from "@/components/MoodSection";
import { QuoteWizard } from "@/components/QuoteWizard";
import { pageMeta } from "@/lib/seo";
import { getPublishedCatalog } from "@/lib/services-catalog";

export const metadata = pageMeta(
  "Request a quote",
  "Book Visriva stations for a corporate event in Bengaluru. Choose booths, AI merchandise, and games, then send a partial or complete brief.",
  "/quote",
);

export default async function QuotePage() {
  const catalog = await getPublishedCatalog();
  return (
    <main>
      <MoodSection mood="beli">
        <Suspense fallback={<div className="min-h-[70svh]" />}>
          <QuoteWizard catalog={catalog.list} bookable={catalog.bookable} />
        </Suspense>
      </MoodSection>
    </main>
  );
}
