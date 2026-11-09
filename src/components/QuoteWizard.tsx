"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { GoldBurst } from "@/components/GoldBurst";
import { inr } from "@/lib/format";
import { emptyDraft, quoteMessage, type QuoteDraft } from "@/lib/quote";
import { categoryMeta, countsFromIds, estimateWithLookup, type Service, type ServiceCategory } from "@/lib/services";
import { requirements } from "@/lib/site";
import { whatsAppLink } from "@/lib/whatsapp";

const steps = ["Services", "Event", "Contact", "Review"] as const;

type QuoteWizardProps = {
  catalog: Service[];
  bookable: Service[];
};

export function QuoteWizard({ catalog, bookable }: QuoteWizardProps) {
  const params = useSearchParams();
  const hydrated = useRef(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<QuoteDraft>(emptyDraft);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ saved: boolean; href: string | null; summary: string } | null>(null);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const fromQuery = countsFromIds((params.get("services") || "").split(",").filter(Boolean), (id) =>
      bookable.find((service) => service.id === id),
    );
    let next = emptyDraft;
    const stored = sessionStorage.getItem("visriva-quote");
    if (stored) {
      try {
        next = { ...emptyDraft, ...JSON.parse(stored) };
      } catch {
        next = emptyDraft;
      }
    }
    if (Object.keys(fromQuery).length) next = { ...next, selected: fromQuery };
    setDraft(next);
  }, [params, bookable]);

  useEffect(() => {
    if (!hydrated.current || done) return;
    sessionStorage.setItem("visriva-quote", JSON.stringify(draft));
  }, [draft, done]);

  const lookup = useMemo(() => {
    const map = new Map(bookable.map((service) => [service.id, service]));
    return (id: string) => map.get(id);
  }, [bookable]);

  const priced = useMemo(() => estimateWithLookup(draft.selected, lookup), [draft.selected, lookup]);

  function setField<K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function toggle(id: string) {
    setDraft((current) => {
      const selected = { ...current.selected };
      if (selected[id]) delete selected[id];
      else {
        const service = bookable.find((item) => item.id === id);
        if (!service || service.bookable === false) return current;
        selected[id] = service.unitPrice ? 100 : 1;
      }
      return { ...current, selected };
    });
  }

  function setQuantity(id: string, quantity: number) {
    setDraft((current) => ({
      ...current,
      selected: { ...current.selected, [id]: Math.max(1, Math.min(5000, quantity)) },
    }));
  }

  function nextStep() {
    setError("");
    if (step === 2) {
      const phone = draft.phone.trim();
      const email = draft.email.trim();
      if (!phone && !email) {
        setError("Add a phone or an email so the studio can reply.");
        return;
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("That email does not look complete.");
        return;
      }
    }
    setStep((value) => Math.min(3, value + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    setError("");
    if (!draft.acceptedTerms) {
      setError("Confirm the advance, GST, and transit terms to send the brief.");
      return;
    }
    setSending(true);
    const summary = quoteMessage(draft, priced.lines, priced.total, priced.hasCustom);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const payload = (await response.json()) as { saved?: boolean; error?: string };
      if (!response.ok) {
        setError(payload.error || "The brief could not be sent. Check the fields and try again.");
        setSending(false);
        return;
      }
      const href = whatsAppLink(summary);
      if (href) window.open(href, "_blank", "noopener,noreferrer");
      sessionStorage.removeItem("visriva-quote");
      setDone({ saved: Boolean(payload.saved), href, summary });
    } catch {
      setError("The network dropped the brief. Try once more.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <section className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
        <GoldBurst />
        <p className="font-royal text-[0.68rem] uppercase tracking-[0.32em] text-gold">Received</p>
        <h1 className="mt-4 font-display text-6xl italic leading-none text-cream">The brief is in motion.</h1>
        <p className="mt-6 text-base leading-relaxed text-mist/85">
          {done.saved
            ? "The studio has the lead, marked new. WhatsApp should be open with the same summary. Send it if the window is waiting."
            : "WhatsApp has the summary. Send that message so the studio receives every line directly."}
        </p>
        <ol className="mt-8 space-y-3 text-sm text-champagne">
          <li>1. A producer checks the date and the stations.</li>
          <li>2. You receive a formal quote. The figure on this site is a start, before tax.</li>
          <li>3. A 50% non-refundable advance holds the crew.</li>
        </ol>
        {done.href ? (
          <a href={done.href} target="_blank" rel="noreferrer" className="mt-8 inline-flex bg-gold px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-deep">
            Open the WhatsApp brief
          </a>
        ) : null}
        <pre className="mt-10 whitespace-pre-wrap border border-gold/25 bg-deep p-5 text-sm leading-relaxed text-champagne">
          {done.summary}
        </pre>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-[1500px] gap-10 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-12 lg:px-10">
      <div className="lg:col-span-8">
        <p className="font-royal text-[0.68rem] uppercase tracking-[0.32em] text-gold">Quote / Book</p>
        <h1 className="mt-3 font-display text-5xl italic leading-none text-cream sm:text-6xl">Tell us the floor.</h1>
        <ol className="mt-8 grid grid-cols-4 gap-2">
          {steps.map((label, index) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => index < step && setStep(index)}
                className={`w-full border-t-2 pt-3 text-left font-royal text-[0.58rem] uppercase tracking-[0.18em] ${
                  index <= step ? "border-gold text-gold" : "border-gold/20 text-mist/50"
                }`}
              >
                0{index + 1} {label}
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          {step === 0 ? (
            <div className="space-y-8">
              {(Object.keys(categoryMeta) as ServiceCategory[]).map((category) => (
                <div key={category}>
                  <h2 className="font-royal text-[0.64rem] uppercase tracking-[0.26em] text-gold">
                    {categoryMeta[category].label}
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {catalog
                      .filter((service) => service.category === category)
                      .map((service) => {
                        const quantity = draft.selected[service.id];
                        const active = Boolean(quantity);
                        const canBook = service.bookable !== false;
                        return (
                          <article key={service.id} className={`border p-3 ${active ? "border-gold bg-gold/10" : "border-gold/25"} ${!canBook ? "opacity-70" : ""}`}>
                            <button
                              type="button"
                              disabled={!canBook}
                              onClick={() => toggle(service.id)}
                              className="grid w-full grid-cols-[88px_1fr] gap-3 text-left disabled:cursor-not-allowed"
                            >
                              <span
                                className="h-20 bg-cover bg-center grayscale"
                                style={{ backgroundImage: `linear-gradient(to top, rgba(4,21,16,0.2), rgba(4,21,16,0.05)), url(${service.image})` }}
                                role="img"
                                aria-label=""
                              />
                              <span>
                                <span className="block text-sm text-cream">{service.name}</span>
                                <span className="mt-1 block text-xs text-gold-2">{service.priceLabel}</span>
                                {!canBook ? (
                                  <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.14em] text-mist">Coming soon</span>
                                ) : null}
                              </span>
                            </button>
                            {active ? (
                              <label className="mt-3 flex items-center justify-between gap-3 text-xs text-mist">
                                {service.unitLabel ? `Number of ${service.unitLabel}` : "Stations"}
                                <input
                                  className="field w-24 py-2"
                                  type="number"
                                  min={1}
                                  value={quantity}
                                  onChange={(event) => setQuantity(service.id, Number(event.target.value))}
                                />
                              </label>
                            ) : null}
                          </article>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Venue" value={draft.venue} onChange={(value) => setField("venue", value)} />
              <Field label="City" value={draft.city} onChange={(value) => setField("city", value)} placeholder="Bengaluru" />
              <Field label="Date" type="date" value={draft.eventDate} onChange={(value) => setField("eventDate", value)} />
              <Field label="Headcount" type="number" value={draft.headcount} onChange={(value) => setField("headcount", value)} />
              <Field label="Start" type="time" value={draft.startTime} onChange={(value) => setField("startTime", value)} />
              <Field label="End" type="time" value={draft.endTime} onChange={(value) => setField("endTime", value)} />
              <label className="sm:col-span-2 text-sm text-mist">
                Notes
                <textarea className="field mt-2 min-h-32" value={draft.notes} onChange={(event) => setField("notes", event.target.value)} />
              </label>
              <p className="sm:col-span-2 text-sm text-mist/70">Every field on this step can stay blank. Send what you know.</p>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={draft.name} onChange={(value) => setField("name", value)} />
              <Field label="Company" value={draft.company} onChange={(value) => setField("company", value)} />
              <Field label="Phone" value={draft.phone} onChange={(value) => setField("phone", value)} />
              <Field label="Email" type="email" value={draft.email} onChange={(value) => setField("email", value)} />
              <p className="sm:col-span-2 text-sm text-mist/70">Phone or email is the only line we need in order to reply.</p>
              <label className="hidden">
                Website
                <input value={draft.website} onChange={(event) => setField("website", event.target.value)} tabIndex={-1} autoComplete="off" />
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <Review draft={draft} />
              <div className="border border-gold/25 p-5">
                <h2 className="font-display text-3xl italic text-cream">Your venue provides</h2>
                <ul className="mt-4 space-y-2 text-sm text-mist/85">
                  {requirements.map((item) => (
                    <li key={item.title}>{item.title}</li>
                  ))}
                </ul>
                <a href="/client-requirements" className="mt-4 inline-block link-gold text-sm text-gold">
                  Open the full checklist
                </a>
              </div>
              <label className="flex items-start gap-3 text-sm leading-relaxed text-champagne">
                <input
                  type="checkbox"
                  className="mt-1 accent-[#c9a227]"
                  checked={draft.acceptedTerms}
                  onChange={(event) => setField("acceptedTerms", event.target.checked)}
                />
                I understand the 50% advance is non-refundable, 18% GST applies on B2B invoices, and Bengaluru transit is ₹2,000–₹4,000.
              </label>
            </div>
          ) : null}
        </div>

        {error ? <p className="mt-6 text-sm text-gold-2">{error}</p> : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((value) => value - 1)} className="border border-gold/40 px-6 py-3.5 text-[0.72rem] uppercase tracking-[0.2em] text-champagne">
              Back
            </button>
          ) : null}
          {step < 3 ? (
            <button type="button" onClick={nextStep} className="bg-gold px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-deep">
              Continue
            </button>
          ) : (
            <button type="button" disabled={sending} onClick={submit} className="bg-gold px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-deep disabled:opacity-60">
              {sending ? "Sending" : "Send the brief"}
            </button>
          )}
        </div>
      </div>

      <aside className="h-max border border-gold/30 bg-deep/80 p-6 lg:sticky lg:top-28 lg:col-span-4">
        <p className="font-royal text-[0.62rem] uppercase tracking-[0.24em] text-gold">Starting from</p>
        <p className="mt-2 font-display text-5xl italic text-cream">{inr(priced.total)}</p>
        {priced.hasCustom ? <p className="mt-2 text-sm text-champagne">Plus lines that are quoted to the run.</p> : null}
        <ul className="mt-6 space-y-3 text-sm text-mist/85">
          {priced.lines.length ? (
            priced.lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-4">
                <span>{line.name}</span>
                <span>{line.amount == null ? "Custom" : inr(line.amount)}</span>
              </li>
            ))
          ) : (
            <li>No stations yet. You can still send a partial brief.</li>
          )}
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-mist/60">
          Before 18% GST. Bengaluru transit is ₹2,000–₹4,000. A 50% non-refundable advance holds the date.
        </p>
      </aside>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label htmlFor={id} className="text-sm text-mist">
      {label}
      <input id={id} className="field mt-2" type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Review({ draft }: { draft: QuoteDraft }) {
  const rows = [
    ["Venue", draft.venue],
    ["City", draft.city],
    ["Date", draft.eventDate],
    ["Start", draft.startTime],
    ["End", draft.endTime],
    ["Headcount", draft.headcount],
    ["Name", draft.name],
    ["Company", draft.company],
    ["Phone", draft.phone],
    ["Email", draft.email],
    ["Notes", draft.notes],
  ].filter(([, value]) => value.trim());

  return (
    <dl className="border border-gold/25">
      {rows.length ? (
        rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 border-b border-gold/15 px-4 py-3 last:border-b-0 sm:grid-cols-[140px_1fr]">
            <dt className="font-royal text-[0.6rem] uppercase tracking-[0.18em] text-gold">{label}</dt>
            <dd className="text-sm text-cream">{value}</dd>
          </div>
        ))
      ) : (
        <p className="px-4 py-4 text-sm text-mist">No event details yet. The stations and your contact line are enough to begin.</p>
      )}
    </dl>
  );
}
