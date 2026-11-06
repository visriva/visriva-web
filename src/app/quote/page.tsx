import { Suspense } from "react";
import { QuoteWizard } from "@/components/QuoteWizard";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Request a quote",
  "Book Visriva stations for a corporate event in Bengaluru. Choose booths, AI merchandise, and games, then send a partial or complete brief.",
  "/quote",
);

export default function QuotePage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-[70svh]" />}>
        <QuoteWizard />
      </Suspense>
    </main>
  );
}
