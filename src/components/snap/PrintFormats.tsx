import { printFormats } from "@/lib/booth-reference";

export function PrintFormats() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {printFormats.map((format) => (
        <article key={format.title} className="snap-canvas rounded-lg p-8">
          <h3 className="type-display text-3xl">{format.title}</h3>
          <p className="mt-4 text-base leading-relaxed text-mist/90">{format.body}</p>
        </article>
      ))}
    </div>
  );
}
