import { printFormats } from "@/lib/booth-reference";

export function PrintFormats() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {printFormats.map((format) => (
        <article key={format.title} className="snap-canvas border border-[#1a1a1a]/10 p-8">
          <h3 className="font-display text-3xl italic text-[#1a1a1a]">{format.title}</h3>
          <p className="mt-4 text-base leading-relaxed text-[#1a1a1a]/72">{format.body}</p>
        </article>
      ))}
    </div>
  );
}
