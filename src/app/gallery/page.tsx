import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { GalleryView } from "@/components/GalleryView";
import { StudioPageBridge } from "@/components/StudioPageBridge";
import { MoodSection } from "@/components/MoodSection";
import { pageMeta } from "@/lib/seo";
import { getWebsitePage } from "@/lib/website-pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWebsitePage("gallery");
  return pageMeta(page?.seo_title || "Corporate event gallery Bangalore", page?.seo_description || "A gallery structure for Visriva corporate event photography and film in Bengaluru. Replace the stand-in frames with the house archive.", "/gallery");
}

export default async function GalleryPage() {
  const pageContent = await getWebsitePage("gallery");
  const films = fs.existsSync(path.join(process.cwd(), "public/films/booth.mp4"));

  return (
    <MoodSection mood="beli" className="px-4 pb-24 pt-32 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <p className="type-eyebrow">{pageContent?.eyebrow || "Gallery"}</p>
        <h1 className="type-display type-site-headline--lg mt-6 max-w-3xl sm:text-7xl">
          {pageContent?.hero_title || "Rooms we have already stood in."} {pageContent?.hero_accent || ""}
        </h1>
        <p className="mt-6 max-w-xl text-base font-light leading-relaxed opacity-88">
          These frames are stand-ins, graded to the house palette. Swap them for Visriva coverage without
          touching the layout.
        </p>
        <div className="mt-12">
          <GalleryView films={films} />
        </div>
      </div>
      <StudioPageBridge />
    </MoodSection>
  );
}
