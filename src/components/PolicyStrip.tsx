import { policies } from "@/lib/site";

export function PolicyStrip() {
  return (
    <aside className="mx-auto grid max-w-[1500px] overflow-hidden rounded-2xl border border-[#ccdcc7] bg-[#f8f7ef] shadow-[0_10px_30px_rgba(39,67,48,.04)] sm:grid-cols-3" aria-label="Booking terms">
      {policies.map((policy) => (
        <div key={policy.title} className="border-b border-[#e2eade] px-6 py-7 last:border-b-0 sm:border-b-0 sm:border-l first:border-l-0">
          <p className="font-royal text-[0.6rem] uppercase tracking-[0.26em] text-gold">{policy.kicker}</p>
          <p className="mt-3 font-display text-3xl italic text-cream">{policy.title}</p>
          <p className="mt-3 text-sm leading-relaxed text-mist/80">{policy.body}</p>
        </div>
      ))}
    </aside>
  );
}
