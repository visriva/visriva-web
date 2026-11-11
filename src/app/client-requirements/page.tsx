import type { Metadata } from "next";
import { ArFootprint } from "@/components/ArFootprint";
import { MoodSection } from "@/components/MoodSection";
import { RequirementsList } from "@/components/RequirementsList";
import { StudioPageBridge } from "@/components/StudioPageBridge";
import { GoldLink } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { getWebsitePage } from "@/lib/website-pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWebsitePage("client-requirements");
  return pageMeta(page?.seo_title || "Event station venue requirements in Bengaluru", page?.seo_description || "Prepare your Bengaluru venue for Visriva event stations: dedicated power, a flat table, outdoor shade, vehicle access and written venue rules. Review the checklist before booking.", "/client-requirements");
}

export default async function RequirementsPage() {
  const pageContent = await getWebsitePage("client-requirements");
  return (
    <main>
      <MoodSection mood="chimela" className="px-4 pb-24 pt-32 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="type-eyebrow">{pageContent?.eyebrow || "Before the date"}</p>
            <h1 className="type-display mt-6 text-4xl sm:text-5xl">{pageContent?.hero_title || "What you arrange. What we bring."} {pageContent?.hero_accent || ""}</h1>
            <p className="mt-6 max-w-md text-base font-light leading-relaxed opacity-88">
              {pageContent?.hero_description || "We arrive with the stations and the crew. The room has to be ready to receive them. Tick each line once it is true."}
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
