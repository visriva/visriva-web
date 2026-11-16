import Link from "next/link";
import { SERVICE_SILO_LINKS } from "@/lib/service-silo-links";

type ServiceSiloLinksProps = {
  /** Hide the current page pill (e.g. `/services/magnet-station`) */
  omitHref?: string;
};

export function ServiceSiloLinks({ omitHref }: ServiceSiloLinksProps) {
  const links = omitHref ? SERVICE_SILO_LINKS.filter((item) => item.href !== omitHref) : SERVICE_SILO_LINKS;

  return (
    <section aria-labelledby="service-silo-heading" className="border-t border-[#CBDCC7] bg-[#F8F7EF] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[900px] text-center">
        <p className="section-kicker">Pair stations</p>
        <h2 id="service-silo-heading" className="display-heading mt-4 text-3xl text-[#244936] sm:text-4xl">
          Complete your <em className="gold-gradient not-italic">event experience</em>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#617768] sm:text-base">
          Pair this station with our other high-engagement activations for a complete guest experience across Bengaluru.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-[#C9A227]/40 bg-[#E7EFE3] px-4 py-2 text-xs font-semibold text-[#244936] transition hover:border-[#C9A227] hover:bg-[#F5F0DF]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}