import type { Metadata } from "next";
import PricingEstimator from "@/components/PricingEstimator";
import { PolicyStrip } from "@/components/PolicyStrip";
import { ReserveEventDetailsForm } from "@/components/ReserveEventDetailsForm";
import { pageMeta } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const DEFAULT_TITLE = "Reserve Your Live Station | Visriva Bengaluru";
const DEFAULT_DESCRIPTION =
  "Book Visriva's live photo booth, magnet, keychain, mug, or tote printing stations for weddings and corporate events in Bengaluru. Instant estimate + WhatsApp confirmation.";

export function generateMetadata(): Metadata {
  const base = pageMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION, "/reserve");

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      title: "Reserve Visriva Live Station | Bengaluru",
      description: "Secure your live station for weddings and corporate events. Get an instant package estimate.",
      url: `${siteUrl}/reserve`,
      siteName: "Visriva Live Station",
    },
  };
}

export default function ReservePage() {
  return (
    <main className="bg-[#E7EFE3] text-[#203F30]">
      <section className="mx-auto max-w-4xl px-5 pb-6 pt-28 text-center sm:px-8 lg:px-12">
        <p className="section-kicker">Reserve</p>
        <h1 className="display-heading mt-4 text-4xl text-[#244936] sm:text-5xl md:text-6xl">Reserve your live station</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#617768] sm:text-lg">
          Secure Visriva for your upcoming wedding or corporate event in Bengaluru. Build an instant package estimate,
          then confirm on WhatsApp with our team.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16 sm:px-8 lg:px-12">
        <PricingEstimator />
      </section>

      <section className="border-t border-[#CBDCC7] bg-[#F5F0DF] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-3xl text-[#294937] sm:text-4xl">Or send us your event details</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-7 text-[#617768]">
            Prefer a short message? Share event type and venue—we&apos;ll pick up the thread on WhatsApp.
          </p>
          <div className="mt-10">
            <ReserveEventDetailsForm />
          </div>
        </div>
      </section>

      <section className="bg-[#DCE9D8] px-5 pb-16 sm:px-8 lg:px-12">
        <PolicyStrip />
      </section>
    </main>
  );
}