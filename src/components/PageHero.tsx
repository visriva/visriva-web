import type { MoodId } from "@/lib/moods";
import { moods } from "@/lib/moods";
import { Eyebrow, Plate } from "@/components/ui";

const overlays: Partial<Record<MoodId, string>> = {
  beli: "linear-gradient(to top, #1a1a1af2, #1a1a1a88, transparent)",
  chimela: "linear-gradient(to top, #141414f0, #14141480, transparent)",
  aurelia: "linear-gradient(to top, #1a1a1aee, #12181699, transparent)",
  balmonte: "linear-gradient(to top, #e0b8b8f0, #e0b8b888, #1a1a1a22)",
  epstonik: "linear-gradient(to top, #ea5514eb, #ea551488, #1a1a1a33)",
  "suster-selly": "linear-gradient(to top, #1a1a1af0, #1a1a1a88, transparent)",
  sansdiego: "linear-gradient(to top, #36454ff0, #36454f88, transparent)",
  nogams: "linear-gradient(to top, #e6e2d6f2, #e6e2d688, transparent)",
};

export function PageHero({
  kicker,
  title,
  lede,
  image,
  alt,
  mood = "beli",
}: {
  kicker: string;
  title: string;
  lede: string;
  image: string;
  alt: string;
  mood?: MoodId;
}) {
  const spec = moods[mood];
  return (
    <section
      data-mood={mood}
      className={`mood-canvas mood-${mood} relative min-h-[80svh] overflow-hidden`}
      style={{ color: spec.fg }}
    >
      <Plate src={image} alt={alt} priority className="absolute inset-0 opacity-85" />
      <div
        className="absolute inset-0"
        style={{ background: overlays[mood] ?? overlays.beli }}
      />
      <div className="relative z-10 mx-auto flex min-h-[80svh] max-w-[1500px] flex-col justify-end px-5 pb-20 pt-36 sm:px-10 lg:px-16">
        <Eyebrow>{kicker}</Eyebrow>
        <div className="mt-6 h-px w-14 bg-current opacity-40" aria-hidden />
        <h1 className={`mood-logotype mood-logotype-${mood} mt-6 max-w-4xl leading-[1.05]`}>{title}</h1>
        <p className="mt-8 max-w-xl text-[1.05rem] font-light leading-[1.7] opacity-92 sm:text-lg">{lede}</p>
      </div>
    </section>
  );
}
