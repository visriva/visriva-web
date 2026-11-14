"use client";

import type { SiteStat } from "@/lib/site-globals-types";

export function StatsBar({ stats }: { stats: SiteStat[] }) {
  return (
    <section aria-label="Visriva in numbers" className="relative z-20 mx-auto grid max-w-[1500px] gap-3 pb-10 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => (
        <div
          key={item.label}
          className="group rounded-2xl border border-[#CBDCC7] bg-[#F8F7EF]/92 px-5 py-5 shadow-[0_12px_34px_rgba(39,67,48,.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#A88F3E]/55 sm:px-6"
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-4xl font-semibold text-[#294937] sm:text-5xl">
              {item.value}
              {item.suffix}
            </p>
            <span className="text-sm text-[#A88F3E]">0{index + 1}</span>
          </div>
          <p className="mt-1 text-xs text-[#738675]">{item.label}</p>
        </div>
      ))}
    </section>
  );
}