import { ArrowUpRight } from "lucide-react";

export function ArrowUpRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <ArrowUpRight className={`inline-block shrink-0 ${className}`} aria-hidden />;
}