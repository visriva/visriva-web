import Link from "next/link";
import { boothTiers } from "@/lib/booth-reference";

export function BoothPricingTiers() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {boothTiers.map((tier) => (
        <article
          key={tier.id}
          className={`flex flex-col border p-6 transition duration-300 hover:-translate-y-0.5 ${
            tier.highlight
              ? "border-[#c9a227] bg-[#1a1a1a] text-[#f5f2eb] shadow-[0_12px_40px_rgba(26,26,26,0.12)]"
              : "border-[#1a1a1a]/12 bg-white text-[#1a1a1a]"
          }`}
        >
          <p className="font-royal text-[0.62rem] uppercase tracking-[0.28em] text-[#c9a227]">{tier.name}</p>
          <p className="mt-3 font-display text-4xl italic leading-none">{tier.price}</p>
          <p className={`mt-2 text-sm ${tier.highlight ? "text-[#f5f2eb]/80" : "text-[#1a1a1a]/65"}`}>
            {tier.subtitle}
          </p>
          <ul className={`mt-6 flex flex-1 flex-col gap-2 text-sm ${tier.highlight ? "text-[#f5f2eb]/90" : "text-[#1a1a1a]/78"}`}>
            {tier.perks.map((perk) => (
              <li key={perk} className="flex gap-2">
                <span className="text-[#c9a227]" aria-hidden>
                  ✓
                </span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/quote?services=${tier.id}`}
            className={`mt-8 inline-flex justify-center border px-4 py-3 text-center font-royal text-[0.62rem] uppercase tracking-[0.22em] transition ${
              tier.highlight
                ? "border-[#c9a227] bg-[#c9a227] text-[#1a1a1a] hover:bg-[#e8cc6a]"
                : "border-[#1a1a1a]/25 text-[#1a1a1a] hover:border-[#c9a227] hover:text-[#c9a227]"
            }`}
          >
            Book this
          </Link>
        </article>
      ))}
    </div>
  );
}
