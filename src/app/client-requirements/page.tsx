import { ArFootprint } from "@/components/ArFootprint";
import { MoodSection } from "@/components/MoodSection";
import { RequirementsList } from "@/components/RequirementsList";
import { StudioPageBridge } from "@/components/StudioPageBridge";
import { GoldLink } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Event station venue requirements in Bengaluru",
  "Prepare your Bengaluru venue for Visriva event stations: dedicated power, a flat table, outdoor shade, vehicle access and written venue rules. Review the checklist before booking.",
  "/client-requirements",
);

export default function RequirementsPage() {
  return (
    <main>
      <MoodSection mood="chimela" className="px-4 pb-24 pt-32 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="type-eyebrow">Before the date</p>
            <h1 className="type-display mt-6 text-4xl sm:text-5xl">What you arrange. What we bring.</h1>
            <p className="mt-6 max-w-md text-base font-light leading-relaxed opacity-88">
              We arrive with the stations and the crew. The room has to be ready to receive them. Tick each line once it is true.
            </p>
            <div className="mt-8"><GoldLink href="/quote">Continue to the quote</GoldLink></div>
          </div>
          <div className="lg:col-span-7"><RequirementsList /></div>
        </div>
      </MoodSection>
      <MoodSection mood="sansdiego" className="px-4 pb-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <p className="type-eyebrow">See it at your venue</p>
          <h2 className="type-display mt-4 max-w-xl text-3xl sm:text-4xl">An 8 × 8 ft frame on your camera.</h2>
          <div className="mt-8 max-w-3xl"><ArFootprint /></div>
        </div>
      </MoodSection>
      <StudioPageBridge />
    </main>
  );
}
