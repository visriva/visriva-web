"use client";

import { MessageCircle, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { inr } from "@/lib/format";

export type AdminLead = {
  id: string;
  created_at: string;
  status: string;
  services: { name?: string; quantity?: number }[] | null;
  venue: string | null;
  city: string | null;
  event_date: string | null;
  contact_name: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  estimated_from: number | null;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "confirmed", label: "Booked" },
  { value: "closed", label: "Closed" },
];

const when = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export function AdminLeadsClient({ initial }: { initial: AdminLead[] }) {
  const [leads, setLeads] = useState(initial);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (!q) return true;
      const blob = [lead.contact_name, lead.company, lead.phone, lead.email, lead.city, lead.venue].filter(Boolean).join(" ").toLowerCase();
      return blob.includes(q);
    });
  }, [leads, query, statusFilter]);

  async function updateStatus(id: string, status: string) {
    setPendingId(id);
    const response = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setPendingId(null);
    if (!response.ok) return;
    const body = await response.json();
    if (body.lead) setLeads((rows) => rows.map((row) => (row.id === id ? (body.lead as AdminLead) : row)));
  }

  async function removeLead(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    setPendingId(id);
    const response = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, { method: "DELETE" });
    setPendingId(null);
    if (response.ok) setLeads((rows) => rows.filter((row) => row.id !== id));
  }

  function waLink(phone: string | null) {
    const digits = (phone ?? "").replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-royal text-[0.62rem] uppercase tracking-[0.28em] text-gold">CRM pipeline</p>
          <h1 className="mt-2 font-display text-4xl italic text-cream">Enquiries & leads</h1>
        </div>
        <a href="/api/admin/leads/export" className="liquid-button rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-wider">
          Export CSV ↗
        </a>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="flex min-h-11 min-w-[220px] flex-1 items-center gap-2 rounded-full border border-gold/30 bg-[#0D2117] px-4 text-sm text-mist">
          <Search className="h-4 w-4 text-gold" aria-hidden />
          <input className="w-full bg-transparent outline-none" placeholder="Search name, company, phone…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <select className="field min-h-11 min-w-[160px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gold/25">
        <table className="min-w-[960px] w-full text-left text-sm">
          <thead className="bg-emerald/40 font-royal text-[0.6rem] uppercase tracking-[0.18em] text-gold">
            <tr>
              {["When", "Status", "Contact", "Event", "From", ""].map((h) => (
                <th key={h} className="px-4 py-3 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => {
              const wa = waLink(lead.phone);
              return (
                <tr key={lead.id} className="border-t border-gold/10 align-top">
                  <td className="px-4 py-4 text-mist">{when.format(new Date(lead.created_at))}</td>
                  <td className="px-4 py-4">
                    <select className="field text-xs uppercase tracking-wider" disabled={pendingId === lead.id} value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value)}>
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-cream">
                    <div>{lead.contact_name || "—"}</div>
                    <div className="text-mist">{lead.company}</div>
                    <div>{lead.phone}</div>
                    <div className="text-mist">{lead.email}</div>
                  </td>
                  <td className="px-4 py-4 text-mist">
                    {[lead.venue, lead.city].filter(Boolean).join(", ") || "—"}
                    <MotionHint date={lead.event_date} />
                  </td>
                  <td className="px-4 py-4 text-gold-2">{lead.estimated_from != null ? inr(lead.estimated_from) : "—"}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {wa ? (
                        <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-gold/40 px-3 py-1.5 text-[10px] uppercase tracking-wider text-champagne">
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                          WhatsApp
                        </a>
                      ) : null}
                      <button type="button" disabled={pendingId === lead.id} onClick={() => removeLead(lead.id)} className="rounded-full border border-gold/30 p-2 text-gold-2 hover:bg-red-900/20" aria-label="Delete lead">
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length ? <p className="px-4 py-10 text-center text-mist">No leads match your filters.</p> : null}
      </div>
    </div>
  );
}

function MotionHint({ date }: { date: string | null }) {
  if (!date) return null;
  return <span className="mt-1 block text-xs">{date}</span>;
}