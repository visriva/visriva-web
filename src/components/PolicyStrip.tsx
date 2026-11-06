import { policies } from "@/lib/site";

export function PolicyStrip() {
  return (
    <aside className="mx-auto grid max-w-[1500px] border border-gold/25 sm:grid-cols-3" aria-label="Booking terms">
      {policies.map((policy) => (
        <div key={policy.title} className="border-gold/20 px-6 py-7 sm:border-l first:border-l-0">
          <p className="font-royal text-[0.6rem] uppercase tracking-[0.26em] text-gold">{policy.kicker}</p>
          <p className="mt-3 font-display text-3xl italic text-cream">{policy.title}</p>
          <p className="mt-3 text-sm leading-relaxed text-mist/80">{policy.body}</p>
        </div>
      ))}
    </aside>
  );
}
