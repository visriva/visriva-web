import { bookingInclusions } from "@/lib/booth-reference";

export function BookingInclusions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bookingInclusions.map((item) => (
        <article
          key={item.title}
          className="border border-gold/20 bg-white/[0.04] p-6 backdrop-blur-sm transition hover:border-gold/45"
        >
          <span className="text-2xl" aria-hidden>
            {item.icon}
          </span>
          <h3 className="mt-4 font-display text-2xl italic leading-tight text-cream">{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-mist/85">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
