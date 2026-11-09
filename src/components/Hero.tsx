import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f5f1e8] pt-[76px]">
      <div className="mx-auto grid min-h-[650px] max-w-[1600px] items-center gap-10 px-5 py-14 sm:px-8 lg:min-h-[760px] lg:grid-cols-[.9fr_1.1fr] lg:gap-12 lg:px-12 lg:py-16">
        <div className="relative z-10 max-w-[650px] py-8">
          <p className="section-kicker">Experiential stations · Bengaluru & across India</p>
          <h1 className="display-heading mt-7 text-[clamp(4.2rem,8vw,8.3rem)] text-[#1c1d18]">
            Make the<br /><em className="text-[#a87824]">moment</em><br />stay.
          </h1>
          <p className="mt-7 max-w-[470px] text-base leading-8 text-[#5b5a50] sm:text-lg">
            Interactive photo experiences, AI-powered keepsakes, live customisation and play stations—designed to make your event impossible to forget.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/quote" className="rounded-full bg-[#1f211b] px-7 py-4 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#a87824]">Build your event brief <span aria-hidden>↗</span></Link>
            <Link href="/#experiences" className="rounded-full border border-[#b9b2a4] px-7 py-4 text-xs font-semibold uppercase tracking-[.14em] text-[#272820] transition hover:border-[#a87824] hover:text-[#94651c]">Explore experiences</Link>
          </div>
          <div className="mt-14 flex items-center gap-5 border-t border-[#d9d2c6] pt-6">
            <div className="flex -space-x-2" aria-hidden>
              <span className="h-8 w-8 rounded-full border-2 border-[#f5f1e8] bg-[#d9c5a3]" />
              <span className="h-8 w-8 rounded-full border-2 border-[#f5f1e8] bg-[#a8a18e]" />
              <span className="h-8 w-8 rounded-full border-2 border-[#f5f1e8] bg-[#7c806d]" />
            </div>
            <p className="text-xs leading-5 text-[#69675d]"><strong className="block text-[#282820]">One team. Every station.</strong> From setup to the final keepsake.</p>
          </div>
        </div>

        <div className="relative min-h-[430px] sm:min-h-[560px] lg:min-h-[650px]">
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#d8d0c1]">
            <Image src="/images/hero.jpg" alt="A beautifully staged corporate event space" fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="ken-burns object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171913]/45 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-5 left-4 max-w-[270px] rounded-2xl border border-white/70 bg-[#fffdf8]/95 p-5 shadow-xl backdrop-blur sm:bottom-8 sm:-left-10">
            <p className="section-kicker">The Visriva experience</p>
            <p className="mt-2 font-display text-3xl leading-none text-[#24241d]">A little wonder.<br />A lasting memory.</p>
          </div>
          <div className="absolute right-5 top-5 rounded-full border border-white/60 bg-black/20 px-4 py-2 text-[.62rem] font-semibold uppercase tracking-[.18em] text-white backdrop-blur">Designed to engage</div>
        </div>
      </div>
      <div className="mx-auto max-w-[1600px] px-5 pb-8 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#d9d2c6] pt-5 text-[.65rem] font-semibold uppercase tracking-[.18em] text-[#777367]">
          <span>Corporate celebrations</span><span>Brand activations</span><span>Weddings & private events</span><span>Employee engagement</span>
        </div>
      </div>
    </section>
  );
}
