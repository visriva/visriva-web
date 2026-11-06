import { Plate } from "@/components/ui";

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
    <section className="relative min-h-[78svh] overflow-hidden">
      <Plate src={image} alt={alt} priority className="absolute inset-0" />
      <div className="relative z-10 flex min-h-[78svh] flex-col justify-end px-5 pb-16 pt-32 sm:px-10 lg:px-16">
        <p className="font-royal text-[0.68rem] uppercase tracking-[0.32em] text-gold">{kicker}</p>
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(3.1rem,7vw,6.4rem)] italic leading-[0.9] text-cream">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-champagne/90 sm:text-lg">{lede}</p>
      </div>
    </section>
  );
}
