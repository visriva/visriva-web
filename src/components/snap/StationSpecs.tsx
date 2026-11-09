import { stationSpecs } from "@/lib/booth-reference";

export function StationSpecs() {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stationSpecs.map((spec) => (
        <div key={spec.label} className="snap-canvas rounded-lg p-6">
          <dt className="type-eyebrow flex items-center gap-2 text-mist">
            <span aria-hidden>{spec.icon}</span>
            {spec.label}
          </dt>
          <dd className="type-display mt-3 text-2xl">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
