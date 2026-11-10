import { NextResponse } from "next/server";
import { cleanBlock, cleanText } from "@/lib/format";
import { estimateWithLookup } from "@/lib/services";
import { getPublishedCatalog } from "@/lib/services-catalog";
import { createPublicClient } from "@/lib/supabase-public";
import { isValidIndianMobile } from "@/lib/validation";

type Incoming = {
  selected?: Record<string, unknown>;
  eventType?: unknown;
  venue?: unknown;
  city?: unknown;
  eventDate?: unknown;
  startTime?: unknown;
  endTime?: unknown;
  headcount?: unknown;
  name?: unknown;
  company?: unknown;
  phone?: unknown;
  email?: unknown;
  notes?: unknown;
  acceptedTerms?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  let body: Incoming;
  try {
    body = (await request.json()) as Incoming;
  } catch {
    return NextResponse.json({ error: "The brief was not readable." }, { status: 400 });
  }

  if (cleanText(body.website, 200)) {
    return NextResponse.json({ ok: true, saved: false });
  }

  if (body.acceptedTerms !== true) {
    return NextResponse.json(
      { error: "Confirm the advance, GST, and transit terms to send the brief." },
      { status: 400 },
    );
  }

  const eventType = cleanText(body.eventType, 40);
  const venue = cleanText(body.venue, 200);
  const city = cleanText(body.city, 120);
  const contactName = cleanText(body.name, 160);
  const email = cleanText(body.email, 200);
  const phone = cleanText(body.phone, 30);

  if (!eventType) {
    return NextResponse.json({ error: "Choose the event format so we can recommend the right stations." }, { status: 400 });
  }
  if (!venue) {
    return NextResponse.json({ error: "Add the venue name and full event address." }, { status: 400 });
  }
  if (!city) {
    return NextResponse.json({ error: "Add the event city." }, { status: 400 });
  }
  if (!contactName) {
    return NextResponse.json({ error: "Add your name so the studio knows who to contact." }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json({ error: "Add a phone number or an email so the studio can reply." }, { status: 400 });
  }
  if (phone && !isValidIndianMobile(phone)) {
    return NextResponse.json({ error: "Enter a valid Indian mobile number: 10 digits starting with 6–9, optionally with +91." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email does not look complete." }, { status: 400 });
  }
  const eventDate = cleanText(body.eventDate, 10);
  const startTime = cleanText(body.startTime, 5);
  const endTime = cleanText(body.endTime, 5);
  if (eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
    return NextResponse.json({ error: "Use a real event date." }, { status: 400 });
  }
  if ((startTime && !/^\d{2}:\d{2}$/.test(startTime)) || (endTime && !/^\d{2}:\d{2}$/.test(endTime))) {
    return NextResponse.json({ error: "Use a real start and end time." }, { status: 400 });
  }

  const catalog = await getPublishedCatalog();
  const lookup = (id: string) => catalog.getService(id);

  const selected: Record<string, number> = {};
  if (body.selected && typeof body.selected === "object") {
    for (const [id, raw] of Object.entries(body.selected)) {
      const service = lookup(id);
      const quantity = typeof raw === "number" ? raw : Number(raw);
      if (!service || !Number.isFinite(quantity) || quantity <= 0 || quantity > 5000) continue;
      selected[id] = Math.round(quantity);
    }
  }

  const priced = estimateWithLookup(selected, lookup);
  let headcount: number | null = null;
  if (typeof body.headcount === "number" || (typeof body.headcount === "string" && body.headcount.trim())) {
    const parsed = Number(body.headcount);
    if (Number.isFinite(parsed) && parsed > 0 && parsed < 100000) headcount = Math.round(parsed);
  }

  const record = {
    status: "new",
    services: priced.lines,
    venue,
    city,
    event_date: eventDate,
    start_time: startTime,
    end_time: endTime,
    headcount,
    contact_name: contactName,
    company: cleanText(body.company, 160),
    phone,
    email,
    notes: cleanBlock(body.notes, 2000),
    estimated_from: priced.total,
    accepted_terms: true,
    source: "website",
    details: {
      hasCustom: priced.hasCustom,
      eventType,
      selected,
    },
  };

  const supabase = createPublicClient();
  if (!supabase) {
    console.error("Public Supabase connection is not configured.");
    return NextResponse.json({ error: "The enquiry service is temporarily unavailable. Please contact Visriva on WhatsApp." }, { status: 503 });
  }

  const { error } = await supabase.from("leads").insert(record);
  if (error) {
    console.error("Lead insert failed", error.message);
    return NextResponse.json({ error: "We could not save your enquiry. Please try again or contact Visriva on WhatsApp." }, { status: 503 });
  }

  return NextResponse.json({ ok: true, saved: true });
}
