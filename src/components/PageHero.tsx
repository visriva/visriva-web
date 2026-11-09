import Image from "next/image";
import Link from "next/link";

export function PageHero({kicker,title,lede,image,alt}:{kicker:string;title:string;lede:string;image:string;alt:string}){
 return <section className="editorial-hero relative isolate overflow-hidden bg-[#DCE9D8] pt-[104px] sm:pt-[120px]">
  <div className="editorial-orb editorial-orb-one" aria-hidden="true"/>
  <div className="editorial-orb editorial-orb-two" aria-hidden="true"/>
  <div className="relative mx-auto grid max-w-[1500px] items-center gap-8 px-5 pb-12 pt-10 sm:px-8 sm:pb-16 lg:grid-cols-[.88fr_1.12fr] lg:gap-14 lg:px-12 lg:py-16">
   <div className="relative z-10">
    <div className="flex items-center gap-3"><span className="h-px w-9 bg-[#A88F3E]"/><p className="section-kicker">{kicker}</p></div>
    <h1 className="display-heading mt-6 max-w-[12ch] text-[clamp(3.5rem,8vw,7.4rem)] text-[#244936]">{title}</h1>
    <p className="mt-6 max-w-xl text-[.98rem] leading-8 text-[#617768] sm:text-lg">{lede}</p>
    <div className="mt-7 flex flex-wrap items-center gap-4">
     <Link href="/quote" className="liquid-button inline-flex items-center gap-3 rounded-full px-6 py-4 text-[10px] font-bold uppercase tracking-[.14em]">Plan your event <span>↗</span></Link>
     <Link href="/gallery" className="inline-flex items-center gap-2 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#526F5A] underline decoration-[#B8A04D]/60 underline-offset-4">Explore the gallery</Link>
    </div>
    <div className="mt-9 grid max-w-lg grid-cols-3 border-y border-[#B8CDB4] py-4">
     <div><p className="font-display text-2xl text-[#294937] sm:text-3xl">01</p><p className="mt-1 text-[8px] font-bold uppercase tracking-[.12em] text-[#718574] sm:text-[9px]">One creative team</p></div>
     <div className="border-x border-[#B8CDB4] px-3"><p className="font-display text-2xl text-[#294937] sm:text-3xl">02</p><p className="mt-1 text-[8px] font-bold uppercase tracking-[.12em] text-[#718574] sm:text-[9px]">Hosted stations</p></div>
     <div className="pl-3"><p className="font-display text-2xl text-[#294937] sm:text-3xl">03</p><p className="mt-1 text-[8px] font-bold uppercase tracking-[.12em] text-[#718574] sm:text-[9px]">Keepsakes to keep</p></div>
    </div>
   </div>
   <div className="relative min-h-[300px] sm:min-h-[430px] lg:min-h-[590px]">
    <div className="absolute -inset-3 rounded-[2rem] border border-white/50 lg:-inset-5"/>
    <div className="editorial-image relative h-[min(112vw,460px)] overflow-hidden rounded-[1.55rem] border border-white/80 shadow-[0_25px_70px_rgba(39,67,48,.15)] sm:h-[500px] lg:h-[590px]">
     <Image src={image} alt={alt} fill priority sizes="(min-width:1024px) 58vw,100vw" className="object-cover"/>
     <div className="absolute inset-0 bg-gradient-to-t from-[#193D2B]/55 via-transparent to-white/5"/>
     <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-6">
      <div className="max-w-[75%] rounded-2xl border border-white/60 bg-[#F8F7EF]/90 p-4 shadow-lg backdrop-blur-md sm:p-5"><p className="text-[8px] font-bold uppercase tracking-[.18em] text-[#947D34]">Designed for your event</p><p className="mt-1 font-display text-2xl leading-none text-[#294937] sm:text-3xl">A better kind of guest experience.</p></div>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/70 bg-[#F8F7EF]/90 font-display text-xl text-[#947D34] shadow-lg sm:h-14 sm:w-14">✳</span>
     </div>
    </div>
    <span className="absolute -right-1 top-8 hidden rotate-90 text-[9px] font-bold uppercase tracking-[.3em] text-[#708772] lg:block">VISRIVA · EXPERIENCES THAT CONNECT</span>
   </div>
  </div>
 </section>;
}
