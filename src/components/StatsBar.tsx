"use client";

const items = [
  { value:"240+", label:"Corporate events executed" },
  { value:"85+", label:"Enterprise brands served" },
  { value:"18 Rigs", label:"Owned stations in fleet" },
  { value:"12 Sec", label:"Lab-grade print speed" },
];

export function StatsBar() {
  return <section aria-label="Visriva in numbers" className="relative z-20 mx-auto grid max-w-[1500px] gap-3 pb-10 sm:grid-cols-2 lg:grid-cols-4">
    {items.map((item)=><div key={item.label} className="rounded-xl border border-[#b8a04d]/35 bg-[#062619]/95 px-5 py-5 shadow-[0_12px_34px_rgba(0,0,0,.2)] backdrop-blur-xl sm:px-6"><p className="font-display text-4xl font-semibold text-[#f1e4bc] sm:text-5xl">{item.value}</p><p className="mt-1 text-xs text-[#a9b9a9]">{item.label}</p></div>)}
  </section>;
}
