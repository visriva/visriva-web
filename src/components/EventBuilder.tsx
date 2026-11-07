"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type MouseEvent, type RefObject } from "react";
import { inr } from "@/lib/format";
import { categoryMeta, estimate, services, type Service } from "@/lib/services";

type Placement = { uid: string; serviceId: string; x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function EventBuilder() {
  const floorRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(services[0]?.id ?? "");
  const [placed, setPlaced] = useState<Placement[]>([]);
  const [guest, setGuest] = useState(0);
  const dragUid = useRef<string | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of placed) {
      const service = services.find((entry) => entry.id === item.serviceId);
      if (!service) continue;
      if (service.unitPrice) map[item.serviceId] = 100;
      else map[item.serviceId] = (map[item.serviceId] ?? 0) + 1;
    }
    return map;
  }, [placed]);

  const priced = estimate(counts);
  const quoteHref = `/quote?services=${encodeURIComponent(placed.map((item) => item.serviceId).join(","))}`;

  function pointFromEvent(clientX: number, clientY: number) {
    const rect = floorRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: clamp(((clientX - rect.left) / rect.width) * 100, 8, 92),
      y: clamp(((clientY - rect.top) / rect.height) * 100, 12, 88),
    };
  }

  function addStation(serviceId: string, clientX: number, clientY: number) {
    const point = pointFromEvent(clientX, clientY);
    if (!point || placed.length >= 8) return;
    setPlaced((current) => [
      ...current,
      { uid: crypto.randomUUID(), serviceId, ...point },
    ]);
    setArmed(serviceId);
  }

  function onFloorClick(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("[data-station]")) return;
    if (!armed) return;
    addStation(armed, event.clientX, event.clientY);
  }

  useEffect(() => {
    if (placed.length < 2) return;
    const timer = window.setInterval(() => {
      setGuest((index) => (index + 1) % placed.length);
    }, 1700);
    return () => window.clearInterval(timer);
  }, [placed.length]);

  const activeGuest = placed[guest] ?? placed[0];

  return (
    <section className="scroll-mt-28 px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="font-royal text-[0.68rem] uppercase tracking-[0.32em] text-gold">
            Build your event
          </p>
          <h2 className="mood-logotype mood-logotype-aurelia mt-4 text-5xl leading-[0.95] sm:text-6xl">
            Compose the room before you book it.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-mist/85 sm:text-base">
            Drag a station onto the floor, or tap one and then tap the plan.
            The starting figure updates as the room fills.
          </p>
          <div className="mt-8 max-h-[28rem] space-y-6 overflow-auto pr-2 scrollbar-none">
            {Object.entries(categoryMeta).map(([category, meta]) => (
              <div key={category}>
                <p className="font-royal text-[0.6rem] uppercase tracking-[0.26em] text-gold/80">
                  {meta.label}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {services
                    .filter((service) => service.category === category)
                    .map((service) => (
                      <StationChip
                        key={service.id}
                        service={service}
                        armed={armed === service.id}
                        onArm={() => setArmed(service.id)}
                        onDrop={(x, y) => addStation(service.id, x, y)}
                        floorRef={floorRef}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <p className="font-royal text-[0.62rem] uppercase tracking-[0.28em] text-gold">
              Venue plan · 8 ft grid
            </p>
            <button
              type="button"
              className="text-[0.68rem] uppercase tracking-[0.18em] text-mist/70 hover:text-gold"
              onClick={() => setPlaced([])}
            >
              Clear floor
            </button>
          </div>
          <div
            ref={floorRef}
            onClick={onFloorClick}
            className="relative aspect-[16/10] overflow-hidden border border-gold/35 bg-[radial-gradient(circle_at_center,#0e4a38_0%,#041510_70%)]"
            role="application"
            aria-label="Venue floor plan"
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(201,162,39,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.22) 1px, transparent 1px)",
                backgroundSize: "12.5% 16.6%",
              }}
            />
            <div className="pointer-events-none absolute left-4 top-4 font-royal text-[0.58rem] uppercase tracking-[0.22em] text-champagne/70">
              Entrance
            </div>
            {placed.length === 0 ? (
              <p className="pointer-events-none absolute inset-0 grid place-items-center px-8 text-center font-display text-3xl italic text-champagne/70">
                The floor is clear. Place the first station.
              </p>
            ) : null}
            {placed.map((item) => {
              const service = services.find((entry) => entry.id === item.serviceId);
              if (!service) return null;
              return (
                <button
                  key={item.uid}
                  type="button"
                  data-station
                  className="absolute grid w-28 -translate-x-1/2 -translate-y-1/2 place-items-center border border-gold bg-deep/80 px-2 py-3 text-center shadow-[0_0_30px_rgba(201,162,39,0.25)] backdrop-blur-sm sm:w-36"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  onPointerDown={(event) => {
                    dragUid.current = item.uid;
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }}
                  onPointerMove={(event) => {
                    if (dragUid.current !== item.uid) return;
                    const point = pointFromEvent(event.clientX, event.clientY);
                    if (!point) return;
                    setPlaced((current) =>
                      current.map((entry) =>
                        entry.uid === item.uid ? { ...entry, ...point } : entry,
                      ),
                    );
                  }}
                  onPointerUp={() => {
                    dragUid.current = null;
                  }}
                  onDoubleClick={() =>
                    setPlaced((current) => current.filter((entry) => entry.uid !== item.uid))
                  }
                >
                  <span className="font-royal text-[0.52rem] uppercase tracking-[0.16em] text-gold">
                    {service.footprint}
                  </span>
                  <span className="mt-1 text-[0.68rem] leading-tight text-cream">
                    {service.name}
                  </span>
                </button>
              );
            })}
            {activeGuest ? (
              <span
                className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_18px_#c9a227] transition-all duration-700"
                style={{ left: `${activeGuest.x}%`, top: `${activeGuest.y + 8}%` }}
                aria-hidden
              />
            ) : null}
          </div>

          <div className="mt-5 flex flex-col gap-4 border border-gold/25 bg-white/[0.03] p-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <div aria-live="polite">
              <p className="font-royal text-[0.6rem] uppercase tracking-[0.24em] text-gold">
                Starting from
              </p>
              <p className="mt-1 font-display text-4xl italic text-cream">
                {inr(priced.total)}
                {priced.hasCustom ? <span className="ml-2 text-xl text-champagne">+ custom</span> : null}
              </p>
              <p className="mt-1 text-xs text-mist/70">
                Before GST and Bengaluru transit. Double-click a station to remove it.
              </p>
            </div>
            <Link
              href={placed.length ? quoteHref : "/quote"}
              className="inline-flex items-center justify-center bg-gold px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-deep transition hover:bg-gold-2"
            >
              Send this plan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StationChip({
  service,
  armed,
  onArm,
  onDrop,
  floorRef,
}: {
  service: Service;
  armed: boolean;
  onArm: () => void;
  onDrop: (x: number, y: number) => void;
  floorRef: RefObject<HTMLDivElement | null>;
}) {
  const moved = useRef(false);

  return (
    <button
      type="button"
      onPointerDown={(event) => {
        moved.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={() => {
        moved.current = true;
      }}
      onPointerUp={(event) => {
        const rect = floorRef.current?.getBoundingClientRect();
        const overFloor =
          rect &&
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        if (overFloor && moved.current) onDrop(event.clientX, event.clientY);
        else onArm();
      }}
      className={`border px-3 py-2 text-left transition ${
        armed ? "border-gold bg-gold/15 text-cream" : "border-gold/30 text-champagne hover:border-gold"
      }`}
    >
      <span className="block text-xs">{service.name}</span>
      <span className="font-royal text-[0.55rem] uppercase tracking-[0.16em] text-gold">
        {service.priceLabel}
      </span>
    </button>
  );
}
