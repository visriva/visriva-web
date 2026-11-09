import Link from "next/link";
import { rentPaths } from "@/lib/booth-reference";

export function RentPaths() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {rentPaths.map((path) => (
        <article
          key={path.title}
          className="group flex flex-col justify-between rounded-lg border border-gold/25 bg-white/[0.03] p-8 backdrop-blur-md transition hover:border-gold/55"
        >
          <div>
            <h3 className="type-display text-4xl leading-none text-cream">{path.title}</h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-mist/85">{path.body}</p>
          </div>
          <Link
            href={path.href}
            className="link-gold type-site-nav mt-8 inline-flex w-fit text-gold"
          >
            {path.cta} →
          </Link>
        </article>
      ))}
    </div>
  );
}
