import type { Metadata } from "next";
import Link from "next/link";
import { VisrivaGoogleReviewSection } from "@/components/reviews/VisrivaGoogleReviewSection";
import { ReviewsPageChrome } from "@/components/reviews/ReviewsPageChrome";
import { getGoogleReviewSettings } from "@/lib/google-review";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta(
    "Leave a Google review",
    "Share your Visriva event experience on Google. Quick, secure review window — no app install.",
    "/reviews",
  );
}

export default async function ReviewsPage() {
  const settings = await getGoogleReviewSettings();

  return (
    <div className="bg-[#041A13] px-4 pb-24 pt-6 sm:px-6 lg:px-10">
      <ReviewsPageChrome>
      <div className="mx-auto max-w-[1100px] pt-6">
        <p className="font-royal text-[0.62rem] uppercase tracking-[0.28em] text-[#E8D48A]">Visriva · Client feedback</p>
        <VisrivaGoogleReviewSection settings={{ ...settings, enabled: true }} variant="page" />
        <p className="mt-10 text-center text-sm text-white/70">
          Prefer email?{" "}
          <Link href="/quote" className="font-semibold text-[#E8D48A] underline">
            Tell us about your event
          </Link>
        </p>
      </div>
      </ReviewsPageChrome>
    </div>
  );
}