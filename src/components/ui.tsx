import Image from "next/image";
import Link from "next/link";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="section-kicker">{children}</p>;
}

export function GoldLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return <Link href={href} className={`inline-flex items-center justify-center rounded-full bg-[#20221c] px-7 py-4 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#a87824] ${className}`}>{children}</Link>;
}

export function GhostLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return <Link href={href} className={`inline-flex items-center justify-center rounded-full border border-[#b9b2a4] px-7 py-4 text-xs font-semibold uppercase tracking-[.14em] text-[#292a23] transition hover:border-[#a87824] hover:text-[#94651c] ${className}`}>{children}</Link>;
}

export function Plate({ src, alt, className = "", priority = false, sizes = "100vw" }: { src: string; alt: string; className?: string; priority?: boolean; sizes?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#e7e0d4] ${className}`}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover transition duration-700 hover:scale-[1.03]" />
    </div>
  );
}
