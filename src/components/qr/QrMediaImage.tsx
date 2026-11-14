import Image from "next/image";

export function QrMediaImage({
  src,
  alt,
  className = "",
  width = 800,
  height = 800,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  if (!src) return null;
  if (src.startsWith("/")) {
    return <Image src={src} alt={alt} width={width} height={height} className={className} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} loading="lazy" />;
}