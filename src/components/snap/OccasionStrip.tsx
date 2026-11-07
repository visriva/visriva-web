import Link from "next/link";
import { occasions } from "@/lib/booth-reference";

export function OccasionStrip() {
  return (
    <div className="flex flex-wrap gap-3">
      {occasions.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="snap-canvas inline-flex items-center gap-2 border border-[#1a1a1a]/12 px-4 py-2.5 text-sm text-[#1a1a1a] transition hover:border-[#c9a227] hover:text-[#1a1a1a]"
        >
          <span aria-hidden>{item.emoji}</span>
          {item.label}
        </Link>
      ))}
    </div>
  );
}
