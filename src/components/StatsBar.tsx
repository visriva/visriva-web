"use client";

const items = [
  { value:"240+", label:"Corporate events executed" },
  { value:"85+", label:"Enterprise brands served" },
  { value:"18 Rigs", label:"Owned stations in fleet" },
  { value:"12 Sec", label:"Lab-grade print speed" },
];

export function StatsBar() {
  return <section aria-label="Visriva in numbers" className="relative z-20 mx-auto grid max-w-[1500px] gap-3 px-0 pb-10 sm:grid-cols-2 lg:grid-cols-4">
    {items.map((item,index)=><div key={item.label} className="group rounded-2xl border border-[#B8A04D]/30 bg-[#064B35]/90 px-5 py-5 shadow-[0_12px_34px_rgba(39,67,48,.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#a88f3e]/55 sm:px-6"><div className="flex items-center justify-between"><p className="font-display text-4xl font-semibold text-[#F5F0DF] sm:text-5xl">{item.value}</p><span className="text-sm text-[#D1BD73]">0{index+1}</span></div><p className="mt-1 text-xs text-[#C6D5C8]">{item.label}</p></div>)}
  </section>;
}
