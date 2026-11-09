import Image from "next/image";

export function PageHero({ kicker, title, lede, image, alt }: { kicker: string; title: string; lede: string; image: string; alt: string }) {
  return (
    <section className="relative overflow-hidden bg-[#e9e2d6] pt-[76px]">
      <div className="mx-auto grid min-h-[560px] max-w-[1500px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-12">
        <div className="relative z-10">
          <p className="section-kicker">{kicker}</p>
          <h1 className="display-heading mt-6 max-w-2xl text-[clamp(3.5rem,6.7vw,6.8rem)] text-[#20211b]">{title}</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#5d5b52] sm:text-lg">{lede}</p>
        </div>
        <div className="relative min-h-[350px] overflow-hidden rounded-[1.75rem] sm:min-h-[470px]">
          <Image src={image} alt={alt} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}
