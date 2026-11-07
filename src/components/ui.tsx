import Image from "next/image";
import Link from "next/link";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="type-eyebrow">{children}</p>;
}

export function GoldLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center justify-center overflow-hidden border border-gold/80 bg-gradient-to-b from-gold-2 to-gold px-7 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-deep shadow-[0_12px_40px_rgba(201,162,39,0.22)] transition duration-500 hover:border-gold-3 hover:shadow-[0_16px_48px_rgba(201,162,39,0.32)] ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition duration-700 group-hover:translate-x-full"
      />
      <span className="relative">{children}</span>
    </Link>
  );
}

export function GhostLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center border border-gold/35 bg-velvet/40 px-7 py-4 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-champagne backdrop-blur-sm transition duration-500 hover:border-gold hover:bg-velvet/70 hover:text-gold-3 ${className}`}
    >
      {children}
    </Link>
  );
}

export function Plate({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`group relative overflow-hidden bg-deep ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover contrast-[1.08] brightness-[0.68] saturate-[0.85] transition duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-emerald/55 to-deep/30" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gold/10 to-transparent opacity-60" />
    </div>
  );
}
