import fs from "node:fs";
import path from "node:path";
import { GalleryView } from "@/components/GalleryView";
import { MoodSection } from "@/components/MoodSection";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Corporate event gallery Bangalore",
  "A gallery structure for Visriva corporate event photography and film in Bengaluru. Replace the stand-in frames with the house archive.",
  "/gallery",
);

export default function GalleryPage() {
  const films = fs.existsSync(path.join(process.cwd(), "public/films/booth.mp4"));

  return (
    <MoodSection mood="beli" className="px-4 pb-24 pt-32 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <p className="type-eyebrow">Gallery</p>
        <h1 className="mood-logotype mood-logotype-beli mt-6 max-w-3xl text-6xl leading-[0.95] sm:text-7xl">
          Rooms we have already stood in.
        </h1>
        <p className="mt-6 max-w-xl text-base font-light leading-relaxed opacity-88">
          These frames are stand-ins, graded to the house palette. Swap them for Visriva coverage without
          touching the layout.
        </p>
        <div className="mt-12">
          <GalleryView films={films} />
        </div>
      </div>
    </MoodSection>
  );
}
