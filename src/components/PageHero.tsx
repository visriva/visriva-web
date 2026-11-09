import Image from "next/image";

export function PageHero({ kicker, title, lede, image, alt }: { kicker: string; title: string; lede: string; image: string; alt: string }) {
  return (
    <section className="relative overflow-hidden bg-[#003F26] pt-[78px]">
      <div className="pointer-events-none absolute -right-24 top-12 h-96 w-96 rounded-full bg-[#0A6845]/25 blur-[90px]" />
      <div className="relative mx-auto grid min-h-[540px] max-w-[1500px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-12">
        <div className="relative z-10">
          <p className="section-kicker">{kicker}</p>
          <h1 className="display-heading mt-6 max-w-2xl text-[clamp(3.5rem,6.7vw,6.8rem)] text-[#F5F0DF]">{title}</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#D2DED3] sm:text-lg">{lede}</p>
        </div>
        <div className="relative min-h-[350px] overflow-hidden rounded-[1.75rem] border border-[#B8A04D]/25 shadow-[0_20px_60px_rgba(0,0,0,.25)] sm:min-h-[470px]">
          <Image src={image} alt={alt} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003F26]/35 to-transparent" />
        </div>
      </div>
    </section>
  );
}
