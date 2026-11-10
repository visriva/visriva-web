"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { GoldBurst } from "@/components/GoldBurst";
import { inr } from "@/lib/format";
import { emptyDraft, quoteMessage, type QuoteDraft } from "@/lib/quote";
import { categoryMeta, countsFromIds, estimateWithLookup, type Service, type ServiceCategory } from "@/lib/services";
import { requirements } from "@/lib/site";
import { whatsAppLink } from "@/lib/whatsapp";
import { isValidIndianMobile } from "@/lib/validation";

const steps = [
  { label: "Experiences", helper: "Choose the stations you want" },
  { label: "Event details", helper: "Tell us about the celebration" },
  { label: "Your details", helper: "Where can we reach you?" },
  { label: "Review", helper: "Check everything before sending" },
] as const;

type QuoteWizardProps = { catalog: Service[]; bookable: Service[] };
type Filter = "all" | ServiceCategory;

const categories: { id: Filter; label: string; description: string }[] = [
  { id: "all", label: "All experiences", description: "Explore the complete collection" },
  { id: "photo-booths", label: "Capture", description: "Portraits, prints and photo moments" },
  { id: "ai-merchandise", label: "Create", description: "Personalised merchandise and keepsakes" },
  { id: "games", label: "Play", description: "VR and interactive guest engagement" },
];

export function QuoteWizard({ catalog, bookable }: QuoteWizardProps) {
  const params = useSearchParams();
  const hydrated = useRef(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<QuoteDraft>(emptyDraft);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ saved: boolean; href: string | null; summary: string } | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const fromQuery = countsFromIds((params.get("services") || "").split(",").filter(Boolean), (id) => bookable.find((service) => service.id === id));
    let next = emptyDraft;
    const stored = sessionStorage.getItem("visriva-quote");
    if (stored) {
      try { next = { ...emptyDraft, ...JSON.parse(stored) }; } catch { next = emptyDraft; }
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
  const selectedCount = Object.keys(draft.selected).length;
  const filteredServices = catalog.filter((service) => {
    const categoryMatch = filter === "all" || service.category === filter;
    const textMatch = `${service.name} ${service.summary}`.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && textMatch;
  });

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
    setDraft((current) => ({ ...current, selected: { ...current.selected, [id]: Math.max(1, Math.min(5000, quantity)) } }));
  }

  function nextStep() {
    setError("");
    if (step === 1) {
      if (!draft.venue.trim()) { setError("Please enter the venue name and full event address."); return; }
      if (!draft.city.trim()) { setError("Please enter the event city."); return; }
    }
    if (step === 2) {
      const phone = draft.phone.trim();
      const email = draft.email.trim();
      if (!draft.name.trim()) { setError("Please enter your name so our team knows who to contact."); return; }
      if (!phone && !email) { setError("Please add a phone number or email address so our team can reply."); return; }
      if (phone && !isValidIndianMobile(phone)) { setError("Enter a valid Indian mobile number: 10 digits starting with 6–9, or include +91. Letters and extensions are not accepted."); return; }
      if (email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { setError("Please check the email address and try again."); return; }
    }
    setStep((value) => Math.min(3, value + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    setError("");
    if (!draft.venue.trim() || !draft.city.trim()) { setError("Add the venue address and city before sending your event request."); setStep(1); return; }
    if (!draft.name.trim()) { setError("Add your name before sending your event request."); setStep(2); return; }
    if (!draft.phone.trim() && !draft.email.trim()) { setError("Add a phone number or email address so our team can reply."); setStep(2); return; }
    if (draft.phone.trim() && !isValidIndianMobile(draft.phone)) { setError("The phone number is not valid. Use a 10-digit Indian mobile number beginning 6–9, optionally with +91."); setStep(2); return; }
    if (draft.email.trim() && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(draft.email.trim())) { setError("Please check the email address and try again."); setStep(2); return; }
    if (!draft.acceptedTerms) { setError("Please confirm the booking terms before sending your request."); return; }
    setSending(true);
    const summary = quoteMessage(draft, priced.lines, priced.total, priced.hasCustom);
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      const payload = (await response.json()) as { saved?: boolean; error?: string };
      if (!response.ok) { setError(payload.error || "We could not send your request. Please try again."); return; }
      const href = whatsAppLink(summary);
      if (href) window.open(href, "_blank", "noopener,noreferrer");
      sessionStorage.removeItem("visriva-quote");
      setDone({ saved: Boolean(payload.saved), href, summary });
    } catch {
      setError("The connection dropped before your request was sent. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <section className="min-h-[80svh] bg-[#E6EFE3] px-5 pb-24 pt-32 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#B8A04D]/25 bg-[#F8F7EF] p-7 shadow-[0_24px_70px_rgba(39,67,48,.09)] sm:p-12">
          <GoldBurst />
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#dcead8] text-2xl text-[#52785b]">✓</div>
          <p className="section-kicker mt-7">Request received</p>
          <h1 className="display-heading mt-3 text-6xl text-[#244936]">Your event brief<br/><em className="gold-gradient">is on its way.</em></h1>
          <p className="mt-6 text-base leading-8 text-[#617768]">{done.saved ? "Your request has been saved for the Visriva team. WhatsApp should also open with a copy of your brief." : "Your brief is ready in WhatsApp. Send that message so the studio receives the details directly."}</p>
          <div className="mt-8 grid gap-3 rounded-2xl bg-[#eaf1e6] p-5 text-sm text-[#4b6652]"><p><strong className="text-[#244936]">What happens next?</strong></p><p>01 · Our team checks the date and the selected stations.</p><p>02 · We share a tailored quote and event plan.</p><p>03 · Your date is confirmed once the advance is received.</p></div>
          {done.href ? <a href={done.href} target="_blank" rel="noreferrer" className="liquid-button mt-8 inline-flex rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[.15em]">Open WhatsApp brief ↗</a> : null}
          <div className="mt-8 flex flex-wrap gap-4"><Link href="/" className="text-sm font-semibold text-[#607768] underline underline-offset-4">Return home</Link><Link href="/gallery" className="text-sm font-semibold text-[#607768] underline underline-offset-4">Explore the gallery</Link></div>
        </div>
      </section>
    );
  }

  const categories: { id: Filter; label: string }[] = [
    { id: "all", label: "All experiences" },
    { id: "photo-booths", label: "Photo booths" },
    { id: "ai-merchandise", label: "AI & merchandise" },
    { id: "games", label: "Games & VR" },
  ];

  return (
    <main id="content" className="min-h-screen bg-[#e6efe3] px-4 pb-24 pt-[112px] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1420px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div><p className="section-kicker">Visriva booking studio</p><h1 className="display-heading mt-2 text-5xl text-[#294937] sm:text-6xl">Let's plan something<br className="hidden sm:block"/><em className="gold-gradient">worth remembering.</em></h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[#667B6B]">Build your event request in a few simple steps. You can review everything before sending, and there is no payment at this stage.</p></div>
          <Link href="/client-requirements" className="rounded-full border border-[#c2d4be] bg-[#f8f7ef]/80 px-5 py-3 text-xs font-semibold text-[#526f5a] transition hover:border-[#a88f3e]">Venue checklist ↗</Link>
        </div>

        <div className="mb-6 rounded-2xl border border-[#B8A04D]/25 bg-[#F8F7EF]/85 p-4 shadow-[0_8px_26px_rgba(39,67,48,.04)] sm:p-5">
          <div className="grid gap-3 sm:grid-cols-4">
            {steps.map((item,index)=>{
              const active=index===step;
              const complete=index<step;
              return <button key={item.label} type="button" onClick={()=>{if(index<step){setStep(index);setError("");}}} disabled={index>step} className={`flex items-center gap-3 rounded-xl p-2 text-left transition ${active?"bg-[#E1EDDC]":complete?"opacity-100":"opacity-55"}`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold ${complete?"bg-[#355b42] text-white":active?"bg-[#b8a04d] text-[#203f30]":"border border-[#c7d8c2] text-[#79907d]"}`}>{complete?"✓":`0${index+1}`}</span>
                <span><span className={`block text-xs font-semibold ${active||complete?"text-[#294937]":"text-[#89988B]"}`}>{item.label}</span><span className="mt-1 block text-[10px] text-[#849386]">{item.helper}</span></span>
              </button>;
            })}
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E1E9DD]"><div className="h-full rounded-full bg-gradient-to-r from-[#0B8054] to-[#B8A04D] transition-all duration-500" style={{width:`${((step+1)/steps.length)*100}%`}}/></div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-[1.75rem] border border-[#D4E0D0] bg-[#F8F7EF] p-5 shadow-[0_20px_60px_rgba(39,67,48,.07)] sm:p-8">
            {step===0 ? <div>
              <div className="wizard-screen flex flex-wrap items-end justify-between gap-4"><div><p className="section-kicker">Step 01 · Experiences</p><h2 className="mt-2 font-display text-4xl text-[#244936] sm:text-5xl">What would you like at your event?</h2><p className="mt-3 text-sm leading-6 text-[#667B6B]">Select one or more stations. You can adjust quantities and review the estimate on the side.</p></div><span className="rounded-full bg-[#e6efe3] px-3 py-2 text-xs text-[#58725d]">{selectedCount} selected</span></div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row"><input className="field" value={search} onChange={(event)=>setSearch(event.target.value)} placeholder="Search experiences..." aria-label="Search experiences"/><div className="flex flex-wrap gap-2">{categories.map((item)=><button key={item.id} type="button" onClick={()=>setFilter(item.id)} className={`rounded-full px-4 py-2.5 text-[10px] font-semibold transition ${filter===item.id?"bg-[#355b42] text-white shadow-md":"border border-[#d4e0d0] bg-white text-[#627768] hover:border-[#a88f3e]"}`}>{item.label}</button>)}</div></div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredServices.map((service)=>{
                  const quantity=draft.selected[service.id]??0;
                  const active=quantity>0;
                  const canBook=service.bookable!==false;
                  return <article key={service.id} className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(39,67,48,.09)] ${active?"border-[#a88f3e] ring-1 ring-[#a88f3e]/25":"border-[#d8e3d4] hover:border-[#b8cdb4]"} ${!canBook?"opacity-65":""}`}>
                    <button type="button" disabled={!canBook} onClick={()=>toggle(service.id)} className="block w-full text-left disabled:cursor-not-allowed">
                      <div className="relative h-36 overflow-hidden bg-[#dce9d8]"><Image src={service.image} alt="" fill sizes="(min-width:1280px) 25vw,(min-width:640px) 50vw,100vw" className="object-cover transition duration-500 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-[#173d2b]/55 to-transparent"/><span className={`absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border text-xs ${active?"border-[#b8a04d] bg-[#b8a04d] text-[#203f30]":"border-white/80 bg-white/65 text-transparent"}`}>✓</span>{!canBook?<span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#607768]">Coming soon</span>:null}</div>
                      <div className="p-4"><span className="text-[9px] font-bold uppercase tracking-[.16em] text-[#9a843a]">{categoryMeta[service.category].label}</span><h3 className="mt-1 font-display text-2xl leading-none text-[#244936]">{service.name}</h3><p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-[#778879]">{service.summary}</p><div className="mt-4 flex items-center justify-between gap-2 border-t border-[#e4ebe0] pt-3"><span className="text-xs font-semibold text-[#405b48]">{service.priceLabel}</span><span className="text-[10px] font-semibold uppercase tracking-wider text-[#9a843a]">{active?"Selected":"Add +"}</span></div></div>
                    </button>
                    {active ? <div className="flex items-center justify-between border-t border-[#e2eadd] bg-[#eef4eb] px-4 py-3"><span className="text-[10px] font-semibold uppercase tracking-wider text-[#617768]">{service.unitLabel??"Stations"}</span><div className="flex items-center gap-3"><button type="button" onClick={()=>setQuantity(service.id,quantity-1)} className="grid h-7 w-7 place-items-center rounded-full border border-[#c2d4be] bg-white text-[#355b42]">−</button><span className="min-w-5 text-center text-sm font-semibold text-[#244936]">{quantity}</span><button type="button" onClick={()=>setQuantity(service.id,quantity+1)} className="grid h-7 w-7 place-items-center rounded-full border border-[#c2d4be] bg-white text-[#355b42]">+</button></div></div>:null}
                  </article>;
                })}
              </div>
              {filteredServices.length===0?<p className="mt-8 rounded-xl bg-[#edf3e9] p-6 text-sm text-[#667B6B]">No experiences match that search. Try a different word or category.</p>:null}
            </div>:null}

            {step===1 ? <div className="wizard-screen">
              <p className="section-kicker">Step 02 · Event details</p><h2 className="mt-2 font-display text-4xl text-[#244936] sm:text-5xl">Tell us about the event.</h2><p className="mt-3 text-sm leading-6 text-[#667B6B]">Share whatever you know right now. Our team can confirm the remaining details with you.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Venue / location" value={draft.venue} onChange={(value)=>setField("venue",value)} placeholder="Venue name or area"/>
                <Field label="City" value={draft.city} onChange={(value)=>setField("city",value)} placeholder="Bengaluru"/>
                <Field label="Event date" type="date" value={draft.eventDate} onChange={(value)=>setField("eventDate",value)}/>
                <Field label="Expected guests" type="number" value={draft.headcount} onChange={(value)=>setField("headcount",value)} placeholder="e.g. 250"/>
                <Field label="Start time" type="time" value={draft.startTime} onChange={(value)=>setField("startTime",value)}/>
                <Field label="End time" type="time" value={draft.endTime} onChange={(value)=>setField("endTime",value)}/>
                <label className="sm:col-span-2 text-xs font-semibold uppercase tracking-[.12em] text-[#597260]">Anything else we should know?<textarea className="field mt-2 min-h-32 resize-y normal-case tracking-normal" value={draft.notes} onChange={(event)=>setField("notes",event.target.value)} placeholder="Theme, audience, event format, branding or special requests..."/></label>
              </div>
              <p className="mt-5 rounded-xl bg-[#edf3e9] p-4 text-xs leading-6 text-[#6b7f6e]">Not sure about every detail? That's absolutely fine. Send the basics and we can help you shape the plan.</p>
            </div>:null}

            {step===2 ? <div className="wizard-screen">
              <p className="section-kicker">Step 03 · Your details</p><h2 className="mt-2 font-display text-4xl text-[#244936] sm:text-5xl">Who should we get in touch with?</h2><p className="mt-3 text-sm leading-6 text-[#667B6B]">We will use these details only to follow up on your event request.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Your name" value={draft.name} onChange={(value)=>setField("name",value)} placeholder="Full name"/>
                <Field label="Company / organisation" value={draft.company} onChange={(value)=>setField("company",value)} placeholder="Company name"/>
                <Field label="Phone number" value={draft.phone} onChange={(value)=>setField("phone",value)} placeholder="+91"/>
                <Field label="Email address" type="email" value={draft.email} onChange={(value)=>setField("email",value)} placeholder="you@company.com"/>
                <label className="hidden">Website<input value={draft.website} onChange={(event)=>setField("website",event.target.value)} tabIndex={-1} autoComplete="off"/></label>
              </div>
              <p className="mt-5 rounded-xl bg-[#edf3e9] p-4 text-xs leading-6 text-[#6b7f6e]">Please provide at least one way for us to reach you—phone or email.</p>
            </div>:null}

            {step===3 ? <div className="wizard-screen">
              <p className="section-kicker">Step 04 · Review your request</p><h2 className="mt-2 font-display text-4xl text-[#244936] sm:text-5xl">One last look.</h2><p className="mt-3 text-sm leading-6 text-[#667B6B]">Check the selections and event information before sending your brief.</p>
              <div className="mt-8 rounded-2xl border border-[#d4e0d0] bg-white p-5">
                <div className="flex items-center justify-between"><h3 className="font-semibold text-[#244936]">Selected experiences</h3><button type="button" onClick={()=>setStep(0)} className="text-xs font-semibold text-[#947d34] underline underline-offset-4">Edit selection</button></div>
                {priced.lines.length ? <ul className="mt-4 divide-y divide-[#e8eee4]">{priced.lines.map((line)=><li key={line.id} className="flex justify-between gap-4 py-3 text-sm"><span className="text-[#536c59]">{line.name} <span className="text-[#849386]">× {line.quantity}</span></span><strong className="text-[#244936]">{line.amount==null?"Custom":inr(line.amount)}</strong></li>)}</ul>:<p className="mt-4 text-sm text-[#718574]">No stations selected yet. You can still send a custom event enquiry.</p>}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <ReviewCard title="Event details" rows={[["Venue",draft.venue],["City",draft.city],["Date",draft.eventDate],["Time",[draft.startTime,draft.endTime].filter(Boolean).join(" – ")],["Guests",draft.headcount]]} onEdit={()=>setStep(1)}/>
                <ReviewCard title="Contact details" rows={[["Name",draft.name],["Company",draft.company],["Phone",draft.phone],["Email",draft.email]]} onEdit={()=>setStep(2)}/>
              </div>
              {draft.notes.trim()?<div className="mt-4 rounded-xl bg-[#edf3e9] p-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#8c7838]">Additional notes</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#526a58]">{draft.notes}</p></div>:null}
              <div className="mt-5 rounded-2xl border border-[#d4e0d0] bg-[#edf3e9] p-5"><p className="font-semibold text-[#244936]">A few booking details</p><ul className="mt-3 space-y-2 text-xs leading-6 text-[#687d6c]">{requirements.slice(0,3).map((item)=><li key={item.title}>• {item.title}</li>)}</ul><Link href="/client-requirements" className="mt-3 inline-block text-xs font-semibold text-[#947d34] underline underline-offset-4">View complete venue checklist ↗</Link></div>
              <label className="mt-5 flex items-start gap-3 rounded-xl border border-[#d8e3d4] bg-white p-4 text-xs leading-6 text-[#637768]"><input type="checkbox" className="mt-1 h-4 w-4 accent-[#a88f3e]" checked={draft.acceptedTerms} onChange={(event)=>setField("acceptedTerms",event.target.checked)}/><span>I understand the 50% non-refundable advance, 18% GST on B2B invoices, and Bengaluru transit charge of ₹2,000–₹4,000. The final quote will confirm applicable charges.</span></label>
            </div>:null}

            {error?<p role="alert" className="mt-6 rounded-xl border border-[#d7b5a5] bg-[#fbefeb] px-4 py-3 text-sm text-[#9a4d37]">{error}</p>:null}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#dce6d8] pt-6">
              {step>0?<button type="button" onClick={()=>{setStep((value)=>value-1);setError("");}} className="rounded-full border border-[#c6d7c1] px-6 py-3.5 text-xs font-semibold text-[#48634f] transition hover:bg-[#edf3e9]">← Back</button>:<span className="text-xs text-[#8a9a8a]">Your progress is saved in this browser.</span>}
              {step<3?<button type="button" onClick={nextStep} className="liquid-button rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[.14em]">Continue to {steps[step+1].label} →</button>:<button type="button" disabled={sending} onClick={submit} className="liquid-button rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[.14em] disabled:cursor-not-allowed disabled:opacity-60">{sending?"Sending your request…":"Send event request ↗"}</button>}
            </div>
          </section>

          <aside className="glass-panel rounded-[1.75rem] p-6 lg:sticky lg:top-28">
            <div className="flex items-start justify-between gap-3"><div><p className="section-kicker">Your event brief</p><h2 className="mt-2 font-display text-3xl text-[#244936]">Your selection</h2></div><span className="grid h-10 w-10 place-items-center rounded-full bg-[#dce9d8] text-[#6d8a6e]">✦</span></div>
            <div className="mt-6 rounded-2xl bg-[#eaf1e6] p-4"><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#7d8d79]">Estimated starting price</p><p className="mt-1 font-display text-5xl text-[#244936]">{inr(priced.total)}</p>{priced.hasCustom?<p className="mt-2 text-xs text-[#8d7838]">Plus custom-priced items</p>:null}<p className="mt-2 text-[10px] leading-5 text-[#7d8d79]">Before GST and applicable transit. Final amount confirmed by our team.</p></div>
            <div className="mt-5"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-[#415f49]">Selected stations</p><span className="text-[10px] text-[#839284]">{selectedCount} items</span></div>
              {priced.lines.length?<ul className="mt-3 space-y-3">{priced.lines.map((line)=><li key={line.id} className="flex justify-between gap-3 text-xs"><span className="leading-5 text-[#657b69]">{line.name}<span className="block text-[10px] text-[#91a091]">Qty {line.quantity}</span></span><span className="whitespace-nowrap font-semibold text-[#355642]">{line.amount==null?"Custom":inr(line.amount)}</span></li>)}</ul>:<p className="mt-3 rounded-xl border border-dashed border-[#c8d9c3] px-4 py-5 text-center text-xs leading-5 text-[#849485]">Your selected stations will appear here.</p>}
            </div>
            <div className="mt-6 border-t border-[#cadbc5] pt-5"><p className="text-xs font-semibold text-[#415f49]">Need a hand?</p><p className="mt-2 text-xs leading-5 text-[#718574]">Not sure what suits your event? Send a partial brief and our team can help shape it.</p><Link href="/client-requirements" className="mt-3 inline-block text-xs font-semibold text-[#947d34] underline underline-offset-4">Check venue requirements ↗</Link></div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({label,value,onChange,type="text",placeholder}:{label:string;value:string;onChange:(value:string)=>void;type?:string;placeholder?:string}) {
  const id=label.toLowerCase().replace(/[^a-z0-9]+/g,"-");
  return <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-[.12em] text-[#597260]">{label}<input id={id} className="field mt-2 normal-case tracking-normal" type={type} value={value} placeholder={placeholder} onChange={(event)=>onChange(event.target.value)}/></label>;
}

function ReviewCard({title,rows,onEdit}:{title:string;rows:[string,string][];onEdit:()=>void}) {
  const visible=rows.filter(([,value])=>value.trim());
  return <article className="rounded-xl border border-[#d4e0d0] bg-white p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold text-[#244936]">{title}</h3><button type="button" onClick={onEdit} className="text-[10px] font-semibold text-[#947d34] underline underline-offset-4">Edit</button></div>{visible.length?<dl className="mt-3 space-y-2">{visible.map(([label,value])=><div key={label} className="flex justify-between gap-3 text-xs"><dt className="text-[#8a9a8a]">{label}</dt><dd className="text-right font-medium text-[#516b57]">{value}</dd></div>)}</dl>:<p className="mt-3 text-xs text-[#88998a]">No details added yet.</p>}</article>;
}
