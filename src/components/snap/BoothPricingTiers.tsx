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
              ? "border-gold bg-ink text-cream shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
              : "border-gold/20 bg-white/[0.04] text-cream backdrop-blur-sm"
          }`}
        >
          <p className="type-eyebrow text-gold">{tier.name}</p>
          <p className="type-display mt-3 text-4xl leading-none">{tier.price}</p>
          <p className={`mt-2 text-sm ${tier.highlight ? "text-cream/80" : "text-mist/85"}`}>
            {tier.subtitle}
          </p>
          <ul className={`mt-6 flex flex-1 flex-col gap-2 text-sm ${tier.highlight ? "text-cream/90" : "text-mist/88"}`}>
            {tier.perks.map((perk) => (
              <li key={perk} className="flex gap-2">
                <span className="text-gold" aria-hidden>
                  ✓
                </span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/quote?services=${tier.id}`}
            className={`type-site-nav mt-8 inline-flex justify-center border px-4 py-3 text-center transition ${
              tier.highlight
                ? "border-gold bg-gold text-deep hover:bg-gold-2"
                : "border-gold/30 text-cream hover:border-gold hover:text-gold-2"
            }`}
          >
            Book this
          </Link>
        </article>
      ))}
    </div>
  );
}
