import Link from "next/link";

export function AdminModuleShell({
  kicker,
  title,
  description,
  links,
}: {
  kicker: string;
  title: string;
  description: string;
  links?: { href: string; label: string }[];
}) {
  return (
    <div className="soft-card rounded-2xl p-6 sm:p-8">
      <p className="section-kicker">{kicker}</p>
      <h1 className="mt-2 font-display text-4xl italic text-cream">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist">{description}</p>
      {links?.length ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="liquid-button rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-wider">
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}