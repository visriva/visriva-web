import { estimate, type EstimateLine } from "@/lib/services";

export type QuoteDraft = {
  selected: Record<string, number>;
  eventType: string;
  venue: string;
  city: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  headcount: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  notes: string;
  acceptedTerms: boolean;
  website: string;
};

export const emptyDraft: QuoteDraft = {
  selected: {},
  eventType: "",
  venue: "",
  city: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  headcount: "",
  name: "",
  company: "",
  phone: "",
  email: "",
  notes: "",
  acceptedTerms: false,
  website: "",
};

export function quoteMessage(draft: QuoteDraft, lines: EstimateLine[], total: number, hasCustom: boolean) {
  const row = (label: string, value: string) => (value.trim() ? `${label}: ${value.trim()}` : null);
  const serviceBlock = lines.length
    ? lines
        .map((line) => {
          const qty = line.unitLabel
            ? `${line.quantity} ${line.unitLabel}`
            : line.quantity > 1
              ? `${line.quantity} stations`
              : "1 station";
          const amount = line.amount == null ? line.priceLabel : `from ₹${line.amount.toLocaleString("en-IN")}`;
          return `• ${line.name} — ${qty} — ${amount}`;
        })
        .join("\n")
    : "• Not chosen yet";

  return [
    "New Visriva quote request",
    "",
    "Services",
    serviceBlock,
    "",
    hasCustom
      ? `Starting from: ₹${total.toLocaleString("en-IN")} plus custom lines`
      : `Starting from: ₹${total.toLocaleString("en-IN")}`,
    "Before tax. 18% GST on B2B invoices. Bengaluru transit ₹2,000–₹4,000. 50% non-refundable advance to hold the date.",
    "",
    "Event",
    row("Format", draft.eventType),
    row("Venue", draft.venue),
    row("City", draft.city),
    row("Date", draft.eventDate),
    row("Start", draft.startTime),
    row("End", draft.endTime),
    row("Headcount", draft.headcount),
    "",
    "Contact",
    row("Name", draft.name),
    row("Company", draft.company),
    row("Phone", draft.phone),
    row("Email", draft.email),
    row("Notes", draft.notes),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function draftEstimate(draft: QuoteDraft) {
  return estimate(draft.selected);
}
