import Link from "next/link";
import { studioNav } from "@/lib/studio-nav";

/** Cross-links so service pages feel connected to home + siblings. */
export function StudioPageBridge() {
  return (
    <section className="border-y border-gold/15 bg-deep/40 px-5 py-10 backdrop-blur-sm sm:px-10">
      <div className="mx-auto max-w-[1500px]">
        <p className="type-eyebrow">Explore the studio</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/#rate-card"
            className="type-site-nav rounded-lg border border-gold/35 bg-gold/10 px-4 py-2 text-cream transition hover:border-gold"
          >
            12-station rate card
          </Link>
          {studioNav
            .filter((item) => !item.href.includes("#"))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="type-site-nav rounded-lg border border-gold/20 px-4 py-2 text-cream/90 transition hover:border-gold/50 hover:text-cream"
              >
                {item.label}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
