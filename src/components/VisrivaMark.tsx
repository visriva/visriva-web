import Image from "next/image";
import { brandLogoSrc, businessName } from "@/lib/site";

type VisrivaMarkProps = {
  className?: string;
  priority?: boolean;
};

export function VisrivaMark({ className = "h-14 w-auto max-w-[9.5rem] object-contain", priority }: VisrivaMarkProps) {
  return (
    <Image
      src={brandLogoSrc}
      alt={businessName}
      width={800}
      height={800}
      priority={priority}
      className={className}
    />
  );
}
