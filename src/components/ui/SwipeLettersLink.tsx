"use client";

import { LiquidButton } from "@/components/ui/LiquidButton";
import { cn } from "@/lib/utils";

export function SwipeLettersLink({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <LiquidButton href={href} variant="gradient" className={cn(className)} aria-label={label}>
      {label}
    </LiquidButton>
  );
}