"use client";

import { useRef, type MouseEvent } from "react";
import { services } from "@/lib/services";

const featured = ["unlimited-dslr", "ai-station", "tote-100", "vr-station", "dtf-tees", "buzz-wire"];

export function StationShowcase() {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20" aria-labelledby="showcase-title">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] items-end justify-between gap-6">
          <div>
            <p className="font-royal text-[0.68rem] uppercase tracking-[0.32em] text-gold">
              The inventory
            </p>
            <h2 id="showcase-title" className="mood-logotype mood-logotype-chimela mt-3 max-w-xl text-3xl sm:text-4xl">
              Turn the station. See the footprint.
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              className="border border-gold/40 px-4 py-2 text-gold"
              onClick={() => scroller.current?.scrollBy({ left: -360, behavior: "smooth" })}
              aria-label="Previous station"
            >
              ←
            </button>
            <button
              type="button"
              className="border border-gold/40 px-4 py-2 text-gold"
              onClick={() => scroller.current?.scrollBy({ left: 360, behavior: "smooth" })}
              aria-label="Next station"
            >
              →
            </button>
          </div>
        </div>
      </div>
      <div
        ref={scroller}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 scrollbar-none sm:px-6 lg:px-10"
      >
        {featured.map((id) => {
          const service = services.find((item) => item.id === id);
          if (!service) return null;
          return <StationCard key={id} name={service.name} price={service.priceLabel} footprint={service.footprint} moment={service.guestMoment} kind={id} />;
        })}
      </div>
    </section>
  );
}

function StationCard({
  name,
  price,
  footprint,
  moment,
  kind,
}: {
  name: string;
  price: string;
  footprint: string;
  moment: string;
  kind: string;
}) {
  const card = useRef<HTMLElement>(null);

  function tilt(event: MouseEvent<HTMLElement>) {
    const node = card.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `rotateY(${px * 16}deg) rotateX(${-py * 12}deg)`;
  }

  return (
    <article
      ref={card}
      onMouseMove={tilt}
      onMouseLeave={() => {
        if (card.current) card.current.style.transform = "rotateY(0deg) rotateX(0deg)";
      }}
      className="w-[82vw] shrink-0 snap-center border border-gold/30 bg-deep p-6 transition duration-200 [transform-style:preserve-3d] sm:w-[24rem]"
      style={{ transform: "rotateY(0deg)" }}
    >
      <div className="grid h-64 place-items-center border border-gold/20 bg-[radial-gradient(circle_at_center,#145c45,#041510_70%)] [transform:translateZ(30px)]">
        <StationMark kind={kind} />
      </div>
      <p className="mt-6 font-royal text-[0.6rem] uppercase tracking-[0.24em] text-gold">{footprint}</p>
      <h3 className="mt-2 font-display text-4xl italic text-cream">{name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-mist/80">{moment}</p>
      <p className="mt-5 text-sm text-champagne">{price}</p>
    </article>
  );
}

function StationMark({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 160 120" className="h-28 w-40 text-gold" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="18" y="28" width="70" height="64" />
      {kind.includes("dslr") || kind.includes("ipad") ? <circle cx="53" cy="58" r="14" /> : null}
      {kind.includes("ai") ? <path d="M40 78c12-28 28-28 40 0" /> : null}
      {kind.includes("tote") ? <path d="M108 36h28l-4 52H112zM114 36c2-10 20-10 22 0" /> : null}
      {kind.includes("vr") ? <path d="M108 52h36v16c-8 10-28 10-36 0z" /> : null}
      {kind.includes("dtf") ? <path d="M108 40h34v10H108zM112 50v28M138 50v28" /> : null}
      {kind.includes("wire") || kind.includes("buzz") ? <path d="M110 40c20 8 24 36 8 48" /> : null}
      <path d="M100 96h42" />
    </svg>
  );
}
