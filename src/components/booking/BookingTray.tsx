"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/components/booking/BookingContext";
import { formatINR } from "@/lib/luxury-stations";

export function BookingTray() {
  const { selectedIds, selectedStations, subtotal, quoteHref } = useBooking();

  if (selectedIds.length === 0) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[85] border-t border-gold/35 bg-ink/90 px-4 py-3 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-6"
      role="region"
      aria-label="Event package draft"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="type-eyebrow text-[0.65rem]">Booking draft</p>
          <p className="type-display-italic mt-1 text-lg text-cream sm:text-xl">
            {selectedStations.length} station{selectedStations.length === 1 ? "" : "s"} · from{" "}
            <span className="text-gold-2">{formatINR(subtotal)}</span>
          </p>
          <p className="mt-0.5 line-clamp-1 text-xs text-mist">
            {selectedStations.map((s) => s.name).join(" · ")}
          </p>
        </div>
        <Link
          href={quoteHref}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold via-gold-2 to-gold px-6 py-3.5 font-royal text-[0.68rem] uppercase tracking-[0.22em] text-deep transition hover:scale-[1.01]"
        >
          Continue to quote
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
