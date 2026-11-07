import { whyVisriva } from "@/lib/booth-reference";

export function WhyVisriva() {
  return (
    <ol className="grid gap-6 lg:grid-cols-2">
      {whyVisriva.map((item) => (
        <li
          key={item.num}
          className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-t border-gold/20 pt-6 first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-6"
        >
          <span className="font-display text-3xl italic text-gold/80">{item.num}</span>
          <div>
            <h3 className="font-display text-2xl italic text-cream">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist/85">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
