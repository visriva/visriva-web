import Image from "next/image";
import Link from "next/link";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-royal text-[0.68rem] uppercase tracking-[0.32em] text-gold">
      {children}
    </p>
  );
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
      className={`inline-flex items-center justify-center bg-gold px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-deep transition duration-300 hover:bg-gold-2 ${className}`}
    >
      {children}
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
      className={`inline-flex items-center justify-center border border-gold/50 px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-champagne transition duration-300 hover:border-gold hover:text-gold ${className}`}
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
    <div className={`relative overflow-hidden bg-deep ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover grayscale contrast-125 brightness-[0.72] mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-emerald/45 to-deep/25" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/25" />
    </div>
  );
}
