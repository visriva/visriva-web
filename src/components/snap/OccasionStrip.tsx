import Link from "next/link";
import { occasions } from "@/lib/booth-reference";

export function OccasionStrip() {
  return (
    <div className="flex flex-wrap gap-2">
      {occasions.map((occasion) => (
        <Link
          key={occasion.label}
          href={occasion.href}
          className="snap-canvas type-site-nav inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-cream transition hover:border-gold/50"
        >
          <span aria-hidden>{occasion.emoji}</span>
          {occasion.label}
        </Link>
      ))}
    </div>
  );
}
