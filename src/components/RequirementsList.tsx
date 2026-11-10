"use client";

import { useState } from "react";
import { requirements } from "@/lib/site";

export function RequirementsList() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <ul className="space-y-4">
      {requirements.map((item, index) => {
        const on = Boolean(checked[item.title]);
        return (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => setChecked((current) => ({ ...current, [item.title]: !current[item.title] }))}
              className={`grid w-full grid-cols-[auto_1fr] gap-5 rounded-2xl border bg-[#F5F0DF] px-5 py-6 text-left shadow-[0_8px_26px_rgba(39,67,48,.04)] transition ${
                on ? "border-gold bg-gold/10" : "border-gold/25 hover:border-gold/60"
              }`}
              aria-pressed={on}
            >
              <span className="font-royal text-sm text-[#947D34]">0{index + 1}</span>
              <span>
                <span className="block font-display text-3xl italic text-[#244936]">{item.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-[#617768]">{item.body}</span>
                <span className="mt-3 block font-royal text-[0.58rem] uppercase tracking-[0.2em] text-[#947D34]">
                  {on ? "Noted" : "Mark as arranged"}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
