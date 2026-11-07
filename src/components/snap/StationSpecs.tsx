import { stationSpecs } from "@/lib/booth-reference";

export function StationSpecs() {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stationSpecs.map((spec) => (
        <div key={spec.label} className="snap-canvas border border-[#1a1a1a]/8 p-6">
          <dt className="flex items-center gap-2 font-royal text-[0.62rem] uppercase tracking-[0.24em] text-[#1a1a1a]/55">
            <span aria-hidden>{spec.icon}</span>
            {spec.label}
          </dt>
          <dd className="mt-3 font-display text-2xl italic text-[#1a1a1a]">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
