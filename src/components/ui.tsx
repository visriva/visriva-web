import Image from "next/image";
import Link from "next/link";

export function Eyebrow({children}:{children:React.ReactNode}) { return <p className="section-kicker">{children}</p>; }

export function GoldLink({href,children,className=""}:{href:string;children:React.ReactNode;className?:string}) {
  return <Link href={href} className={"liquid-button inline-flex items-center justify-center rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[.14em] "+className}>{children}</Link>;
}

export function GhostLink({href,children,className=""}:{href:string;children:React.ReactNode;className?:string}) {
  return <Link href={href} className={"inline-flex items-center justify-center rounded-full border border-[#b7cbb2] bg-[#f8f7ef]/70 px-7 py-4 text-xs font-semibold uppercase tracking-[.14em] text-[#355642] transition hover:-translate-y-0.5 hover:border-[#a88f3e] hover:bg-white "+className}>{children}</Link>;
}

export function Plate({src,alt,className="",priority=false,sizes="100vw"}:{src:string;alt:string;className?:string;priority?:boolean;sizes?:string}) {
  return <div className={"relative overflow-hidden rounded-2xl bg-[#dce9d8] "+className}><Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover transition duration-700 hover:scale-[1.03]"/></div>;
}
