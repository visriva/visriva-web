import { Eyebrow, Plate } from "@/components/ui";

const STUDIO_OVERLAY =
  "linear-gradient(to top, rgb(4 13 10 / 0.94), rgb(11 61 46 / 0.55) 42%, rgb(26 26 26 / 0.15) 72%, transparent)";

export function PageHero({
  kicker,
  title,
  lede,
  image,
  alt,
}: {
  kicker: string;
  title: string;
  lede: string;
  image: string;
  alt: string;
}) {
  return (
    <section
      data-mood="sansdiego"
      className="mood-canvas mood-sansdiego mood-canvas--studio relative min-h-[80svh] overflow-hidden"
    >
      <Plate src={image} alt={alt} priority className="absolute inset-0 opacity-80" />
      <div className="absolute inset-0" style={{ background: STUDIO_OVERLAY }} />
      <div className="relative z-10 mx-auto flex min-h-[80svh] max-w-[1500px] flex-col justify-end px-5 pb-20 pt-36 sm:px-10 lg:px-16">
        <Eyebrow>{kicker}</Eyebrow>
        <div className="mt-6 h-px w-14 bg-gold/40" aria-hidden />
        <h1 className="type-display type-site-headline--lg mt-6 max-w-4xl text-cream">{title}</h1>
        <p className="mt-8 max-w-xl font-sans text-[1.05rem] font-light leading-[1.7] text-cream/90 sm:text-lg">
          {lede}
        </p>
      </div>
    </section>
  );
}
