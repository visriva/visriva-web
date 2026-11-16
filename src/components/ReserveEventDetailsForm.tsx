"use client";

import { useMemo, useState } from "react";
import { whatsAppLink } from "@/lib/whatsapp";

export function ReserveEventDetailsForm() {
  const [eventType, setEventType] = useState("");
  const [dateVenue, setDateVenue] = useState("");

  const href = useMemo(() => {
    const lines = [
      "Hi Visriva, I would like to reserve a live station.",
      eventType.trim() ? `Event type: ${eventType.trim()}` : null,
      dateVenue.trim() ? `Date & venue: ${dateVenue.trim()}` : null,
    ].filter(Boolean);
    return whatsAppLink(lines.join("\n"));
  }, [eventType, dateVenue]);

  return (
    <form
      className="mx-auto max-w-xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (href) window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      <div>
        <label htmlFor="reserve-event-type" className="mb-1 block text-xs font-semibold uppercase tracking-[.14em] text-[#294937]">
          Event type
        </label>
        <input
          id="reserve-event-type"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          placeholder="Wedding / Corporate / Other"
          className="w-full rounded-xl border border-[#CBDCC7] bg-white p-3 text-[#203F30] focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40"
        />
      </div>
      <div>
        <label htmlFor="reserve-date-venue" className="mb-1 block text-xs font-semibold uppercase tracking-[.14em] text-[#294937]">
          Date &amp; venue
        </label>
        <input
          id="reserve-date-venue"
          value={dateVenue}
          onChange={(e) => setDateVenue(e.target.value)}
          placeholder="Date + venue / area"
          className="w-full rounded-xl border border-[#CBDCC7] bg-white p-3 text-[#203F30] focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40"
        />
      </div>
      <button
        type="submit"
        disabled={!href}
        className="w-full rounded-full border border-[#244936] bg-[#244936] py-3.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#F8F7EF] transition hover:bg-[#163D2C] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue on WhatsApp
      </button>
    </form>
  );
}