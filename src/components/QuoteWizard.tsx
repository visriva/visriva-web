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

const occasionOptions = [
  { id: "corporate", label: "Corporate & conferences", description: "Offsites, town halls, conferences and employee days" },
  { id: "celebration", label: "Weddings & celebrations", description: "Weddings, birthdays and private gatherings" },
  { id: "brand", label: "Brand activations", description: "Launches, expos and customer engagement" },
  { id: "family", label: "Family & kids days", description: "Family days, school events and children celebrations" },
] as const;

const occasionRecommendations: Record<string, string[]> = {
  corporate: ["unlimited-dslr", "ai-station", "vr-station", "ai-photo-booth", "vr-engagement", "tote-100"],
  celebration: ["unlimited-dslr", "roaming-booth", "ai-photo-booth", "fridge-magnets", "tote-100"],
  brand: ["ai-photo-booth", "vr-engagement", "ai-station", "dtf-tees", "tote-100", "pvc-cards"],
  family: ["unlimited-ipad", "ai-photo-booth", "vr-engagement", "catch-baton", "buzz-wire"],
};
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
  const selectedCount = Object.values(draft.selected).reduce((sum, quantity) => sum + quantity, 0);
  const recommendedIds = occasionRecommendations[draft.eventType] ?? [];
  const filteredServices = catalog.filter((service) => {
    const categoryMatch = filter === "all" || service.category === filter;
    const textMatch = (service.name + " " + service.summary).toLowerCase().includes(search.toLowerCase());
    return categoryMatch && textMatch;
  }).sort((a, b) => Number(recommendedIds.includes(b.id)) - Number(recommendedIds.includes(a.id)));

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
    if (step === 0 && !draft.eventType) {
      setError("Choose the type of celebration first so we can guide your station selection.");
      return;
    }
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
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please check the email address and try again."); return; }
    }
    setStep((value) => Math.min(3, value + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    setError("");
    if (!draft.eventType) { setError("Choose your event format before sending your request."); setStep(0); return; }
    if (!draft.venue.trim() || !draft.city.trim()) { setError("Add the venue address and city before sending your event request."); setStep(1); return; }
    if (!draft.name.trim()) { setError("Add your name before sending your event request."); setStep(2); return; }
    if (!draft.phone.trim() && !draft.email.trim()) { setError("Add a phone number or email address so our team can reply."); setStep(2); return; }
    if (draft.phone.trim() && !isValidIndianMobile(draft.phone)) { setError("The phone number is not valid. Use a 10-digit Indian mobile number beginning 6–9, optionally with +91."); setStep(2); return; }
    if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) { setError("Please check the email address and try again."); setStep(2); return; }
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
            {step===0 ? <div className="wizard-screen">
              <div className="relative overflow-hidden rounded-[1.65rem] bg-[#203F30] px-6 py-7 text-[#F8F7EF] shadow-[0_22px_60px_rgba(32,63,48,.16)] sm:px-8 sm:py-9">
                <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#B8A04D]/20 blur-3xl"/>
                <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                  <div className="max-w-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#D8C47B]">01 / Design your guest experience</p>
                    <h2 className="mt-3 font-display text-4xl leading-[.95] sm:text-5xl">What should guests<br/><em className="text-[#D8C47B]">remember?</em></h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-[#E1E9DD]/80">Build a thoughtful mix for your celebration. Start with the kind of moment you want to create, then add the stations that fit.</p>
                  </div>
                  <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#D8C47B] text-lg text-[#203F30]">✦</span>
                    <span><span className="block text-2xl font-semibold tabular-nums">{selectedCount}</span><span className="block text-[9px] font-semibold uppercase tracking-[.16em] text-white/65">Stations selected</span></span>
                  </div>
                </div>
                <div className="relative mt-7">
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-[.18em] text-[#E1D39B]">First, tell us about your occasion</p>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {occasionOptions.map((item,index)=>{
                      const active=draft.eventType===item.id;
                      return <button key={item.id} type="button" onClick={()=>setField("eventType",item.id)} aria-pressed={active} className={"rounded-xl border p-3 text-left transition-all duration-200 " + (active ? "border-[#D8C47B] bg-[#F8F7EF] text-[#203F30] shadow-[0_8px_22px_rgba(0,0,0,.12)]" : "border-white/15 bg-white/[.06] text-white/85 hover:border-white/40 hover:bg-white/10")}>
                        <span className="flex items-center justify-between gap-2"><span className="text-[11px] font-semibold">{item.label}</span><span className="text-[#D8C47B]">{["◈","✧","✳","❋"][index]}</span></span>
                        <span className={"mt-1 block text-[9px] leading-4 " + (active ? "text-[#657768]" : "text-white/55")}>{item.description}</span>
                      </button>;
                    })}
                  </div>
                </div>
                <div className="relative mt-7 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {categories.map((item,index)=>{
                    const active=filter===item.id;
                    return <button key={item.id} type="button" onClick={()=>setFilter(item.id)} aria-pressed={active} className={"rounded-xl border px-4 py-3 text-left transition-all duration-200 " + (active ? "border-[#D8C47B] bg-[#F8F7EF] text-[#203F30] shadow-[0_8px_22px_rgba(0,0,0,.12)]" : "border-white/15 bg-white/[.06] text-white/85 hover:border-white/40 hover:bg-white/10")}>
                      <span className="flex items-center justify-between"><span className="text-[9px] font-bold uppercase tracking-[.18em]">{item.label}</span><span className="text-sm text-[#D8C47B]">{["✧","◎","✳","↗"][index]}</span></span>
                      <span className={"mt-1 block text-[10px] leading-4 " + (active ? "text-[#657768]" : "text-white/55")}>{item.description}</span>
                    </button>;
                  })}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#947D34]">The station collection</p><p className="mt-1 text-sm text-[#627768]">Choose any combination. You can adjust quantities before you send your brief.</p></div>
                <label className="relative block w-full md:max-w-[300px]">
                  <span className="sr-only">Search experiences</span>
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8C9B8C]">⌕</span>
                  <input className="field !rounded-full !bg-white !py-3 !pl-10 text-sm" value={search} onChange={(event)=>setSearch(event.target.value)} placeholder="Search booths, AI, VR…"/>
                </label>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {filteredServices.map((service,index)=>{
                  const quantity=draft.selected[service.id]??0;
                  const active=quantity>0;
                  const canBook=service.bookable!==false;
                  return <article key={service.id} className={"group relative overflow-hidden rounded-[1.4rem] border bg-[#FFFEF8] transition-all duration-300 " + (active ? "border-[#A88F3E] shadow-[0_15px_42px_rgba(39,67,48,.13)] ring-1 ring-[#A88F3E]/30" : "border-[#D7E2D3] shadow-[0_10px_30px_rgba(39,67,48,.045)] hover:-translate-y-1 hover:border-[#B8CBB4] hover:shadow-[0_18px_44px_rgba(39,67,48,.1)]") + (!canBook ? " opacity-60" : "")}>
                    <div className="relative h-48 overflow-hidden bg-[#DCE9D8]">
                      <Image src={service.image} alt={service.name} fill sizes="(min-width:1536px) 30vw,(min-width:768px) 45vw,100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#142F23]/75 via-[#142F23]/10 to-transparent"/>
                      <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-[#F8F7EF]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.16em] text-[#355642]">{categoryMeta[service.category].label}</span>
                      {recommendedIds.includes(service.id)&&draft.eventType?<span className="absolute right-4 top-4 rounded-full border border-[#F5E7B4]/80 bg-[#D8C47B] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-[#203F30]">Suggested</span>:null}
                      {active?<span className="absolute right-4 top-14 grid h-8 w-8 place-items-center rounded-full border border-[#F5E7B4] bg-[#D8C47B] text-sm font-bold text-[#203F30]">✓</span>:null}
                      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
                        <div><p className="text-[9px] font-semibold uppercase tracking-[.18em] text-[#E7D899]">Visriva experience {String(index+1).padStart(2,"0")}</p><h3 className="mt-1 font-display text-3xl leading-none sm:text-[2rem]">{service.name}</h3></div>
                        {service.comingSoon||!canBook?<span className="rounded-full bg-white/90 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#526B58]">Coming soon</span>:null}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="min-h-[3.25rem] text-sm leading-6 text-[#667B6B]">{service.summary}</p>
                      <div className="mt-4 rounded-xl bg-[#F0F4EC] px-4 py-3">
                        <p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#947D34]">The guest moment</p>
                        <p className="mt-1 text-xs leading-5 text-[#425F4B]">“{service.guestMoment}”</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {service.includes.slice(0,2).map((item)=><span key={item} className="rounded-full border border-[#E0E8DC] bg-white px-3 py-1.5 text-[9px] font-medium text-[#6C806F]">{item}</span>)}
                      </div>
                      <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#E3EAE0] pt-4">
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-[.15em] text-[#8B9B8C]">Starting investment</p>
                          <p className="mt-1 font-display text-2xl leading-none text-[#294937]">{service.priceLabel}</p>
                          <p className="mt-2 text-[9px] text-[#8A9A8A]">{service.footprint}</p>
                        </div>
                        {active?
                          <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#C9D9C4] bg-[#EFF4EB] p-1">
                            <button type="button" aria-label={"Remove one " + service.name} onClick={()=>quantity<=1?toggle(service.id):setQuantity(service.id,quantity-1)} className="grid h-8 w-8 place-items-center rounded-full bg-white text-base text-[#355642] shadow-sm transition hover:bg-[#E3ECDF]">−</button>
                            <span className="min-w-5 text-center text-sm font-semibold tabular-nums text-[#294937]">{quantity}</span>
                            <button type="button" aria-label={"Add one " + service.name} onClick={()=>setQuantity(service.id,quantity+1)} className="grid h-8 w-8 place-items-center rounded-full bg-[#294937] text-base text-white shadow-sm transition hover:bg-[#42654A]">+</button>
                          </div>
                        :
                          <button type="button" disabled={!canBook} onClick={()=>toggle(service.id)} className="liquid-button shrink-0 rounded-full px-5 py-3 text-[9px] font-bold uppercase tracking-[.13em] disabled:cursor-not-allowed disabled:opacity-50">Add station +</button>
                        }
                      </div>
                    </div>
                  </article>;
                })}
              </div>
              {filteredServices.length===0?<p className="mt-8 rounded-xl bg-[#edf3e9] p-6 text-sm text-[#667B6B]">No experiences match that search. Try another term or category.</p>:null}
              <p className="mt-5 text-center text-[10px] leading-5 text-[#89978A]">Prices are starting estimates before GST and applicable transit. Custom experiences are confirmed after we review your event brief.</p>
            </div>:null}

            {step===1 ? <div className="wizard-screen">
              <p className="section-kicker">Step 02 · Event details</p><h2 className="mt-2 font-display text-4xl text-[#244936] sm:text-5xl">Tell us about the event.</h2><p className="mt-3 text-sm leading-6 text-[#667B6B]">Share whatever you know right now. Our team can confirm the remaining details with you.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Venue / full event address" value={draft.venue} onChange={(value)=>setField("venue",value)} placeholder="Venue name, street, area and landmark" required/>
                <Field label="Event city" value={draft.city} onChange={(value)=>setField("city",value)} placeholder="Bengaluru" required/>
                <Field label="Event date" type="date" value={draft.eventDate} onChange={(value)=>setField("eventDate",value)}/>
                <Field label="Expected guests" type="number" value={draft.headcount} onChange={(value)=>setField("headcount",value)} placeholder="e.g. 250"/>
                <Field label="Start time" type="time" value={draft.startTime} onChange={(value)=>setField("startTime",value)}/>
                <Field label="End time" type="time" value={draft.endTime} onChange={(value)=>setField("endTime",value)}/>
                <label className="sm:col-span-2 text-xs font-semibold uppercase tracking-[.12em] text-[#597260]">Anything else we should know?<textarea className="field mt-2 min-h-32 resize-y normal-case tracking-normal" value={draft.notes} onChange={(event)=>setField("notes",event.target.value)} placeholder="Theme, audience, event format, branding or special requests..."/></label>
              </div>
              <p className="mt-5 rounded-xl bg-[#edf3e9] p-4 text-xs leading-6 text-[#6b7f6e]">Venue address and city are required so we can plan crew travel, power and station setup. You can leave the date or timings blank if they are not confirmed yet.</p>
            </div>:null}

            {step===2 ? <div className="wizard-screen">
              <p className="section-kicker">Step 03 · Your details</p><h2 className="mt-2 font-display text-4xl text-[#244936] sm:text-5xl">Who should we get in touch with?</h2><p className="mt-3 text-sm leading-6 text-[#667B6B]">We will use these details only to follow up on your event request.</p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Your name" value={draft.name} onChange={(value)=>setField("name",value)} placeholder="Full name" required/>
                <Field label="Company / organisation" value={draft.company} onChange={(value)=>setField("company",value)} placeholder="Company name"/>
                <Field label="Mobile number" value={draft.phone} onChange={(value)=>setField("phone",value)} type="tel" inputMode="tel" placeholder="+91 98765 43210"/>
                <Field label="Email address" type="email" value={draft.email} onChange={(value)=>setField("email",value)} placeholder="you@company.com"/>
                <label className="hidden">Website<input value={draft.website} onChange={(event)=>setField("website",event.target.value)} tabIndex={-1} autoComplete="off"/></label>
              </div>
              <p className="mt-5 rounded-xl bg-[#edf3e9] p-4 text-xs leading-6 text-[#6b7f6e]">Enter your name and at least one contact method. Mobile numbers must be a valid 10-digit Indian mobile number starting with 6–9, optionally with +91. A number containing letters or an incomplete number will be rejected, even when an email is also provided.</p>
            </div>:null}

            {step===3 ? <div className="wizard-screen">
              <p className="section-kicker">Step 04 · Review your request</p><h2 className="mt-2 font-display text-4xl text-[#244936] sm:text-5xl">One last look.</h2><p className="mt-3 text-sm leading-6 text-[#667B6B]">Check the selections and event information before sending your brief.</p>
              <div className="mt-8 rounded-2xl border border-[#d4e0d0] bg-white p-5">
                <div className="flex items-center justify-between"><h3 className="font-semibold text-[#244936]">Selected experiences</h3><button type="button" onClick={()=>setStep(0)} className="text-xs font-semibold text-[#947d34] underline underline-offset-4">Edit selection</button></div>
                {priced.lines.length ? <ul className="mt-4 divide-y divide-[#e8eee4]">{priced.lines.map((line)=><li key={line.id} className="flex justify-between gap-4 py-3 text-sm"><span className="text-[#536c59]">{line.name} <span className="text-[#849386]">× {line.quantity}</span></span><strong className="text-[#244936]">{line.amount==null?"Custom":inr(line.amount)}</strong></li>)}</ul>:<p className="mt-4 text-sm text-[#718574]">No stations selected yet. You can still send a custom event enquiry.</p>}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <ReviewCard title="Event details" rows={[["Format",occasionOptions.find((item)=>item.id===draft.eventType)?.label ?? ""],["Venue",draft.venue],["City",draft.city],["Date",draft.eventDate],["Time",[draft.startTime,draft.endTime].filter(Boolean).join(" – ")],["Guests",draft.headcount]]} onEdit={()=>setStep(1)}/>
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

function Field({label,value,onChange,type="text",placeholder,required=false,inputMode}:{label:string;value:string;onChange:(value:string)=>void;type?:string;placeholder?:string;required?:boolean;inputMode?:"text"|"tel"|"email"|"numeric"}) {
  const id=label.toLowerCase().replace(/[^a-z0-9]+/g,"-");
  return <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-[.12em] text-[#597260]">{label}{required?<span className="ml-1 text-[#A66B43]">*</span>:null}<input id={id} className="field mt-2 normal-case tracking-normal" type={type} inputMode={inputMode} required={required} value={value} placeholder={placeholder} onChange={(event)=>onChange(event.target.value)}/></label>;
}

function ReviewCard({title,rows,onEdit}:{title:string;rows:[string,string][];onEdit:()=>void}) {
  const visible=rows.filter(([,value])=>value.trim());
  return <article className="rounded-xl border border-[#d4e0d0] bg-white p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold text-[#244936]">{title}</h3><button type="button" onClick={onEdit} className="text-[10px] font-semibold text-[#947d34] underline underline-offset-4">Edit</button></div>{visible.length?<dl className="mt-3 space-y-2">{visible.map(([label,value])=><div key={label} className="flex justify-between gap-3 text-xs"><dt className="text-[#8a9a8a]">{label}</dt><dd className="text-right font-medium text-[#516b57]">{value}</dd></div>)}</dl>:<p className="mt-3 text-xs text-[#88998a]">No details added yet.</p>}</article>;
}
