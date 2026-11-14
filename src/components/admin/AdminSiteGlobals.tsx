"use client";

import { useState } from "react";
import type { SiteGlobals, SiteStat } from "@/lib/site-globals-types";

const input = "field mt-2";

export function AdminSiteGlobals({ initial }: { initial: SiteGlobals }) {
  const [globals, setGlobals] = useState(initial);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function patch<K extends keyof SiteGlobals>(key: K, value: SiteGlobals[K]) {
    setGlobals((g) => ({ ...g, [key]: value }));
  }

  function patchStat(index: number, field: keyof SiteStat, value: string | number) {
    setGlobals((g) => {
      const stats = [...g.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...g, stats };
    });
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setNotice("");
    const response = await fetch("/api/admin/site-globals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ globals }),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(typeof body.error === "string" ? body.error : "Could not save globals.");
      return;
    }
    if (body.globals) setGlobals(body.globals as SiteGlobals);
    setNotice("Footer & stats saved — live site updated.");
  }

  return (
    <form onSubmit={save} className="mt-10 space-y-6 rounded-2xl border border-gold/20 bg-[#0D2117] p-5 sm:p-7">
      <p className="section-kicker">Site-wide · Footer & social proof</p>
      <p className="text-sm text-mist">Edits every footer block and homepage stat counter labels/values (when wired on the homepage).</p>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-mist md:col-span-2">
          Footer brand blurb
          <textarea className={`${input} min-h-24`} value={globals.footer_blurb} onChange={(e) => patch("footer_blurb", e.target.value)} />
        </label>
        <label className="text-sm text-mist">
          Tagline
          <input className={input} value={globals.footer_tagline} onChange={(e) => patch("footer_tagline", e.target.value)} />
        </label>
        <label className="text-sm text-mist">
          Location badge
          <input className={input} value={globals.footer_badge} onChange={(e) => patch("footer_badge", e.target.value)} />
        </label>
        <label className="text-sm text-mist md:col-span-2">
          Studio location
          <input className={input} value={globals.footer_location} onChange={(e) => patch("footer_location", e.target.value)} />
        </label>
        <label className="text-sm text-mist md:col-span-2">
          GST / billing note
          <textarea className={`${input} min-h-20`} value={globals.footer_gst_note} onChange={(e) => patch("footer_gst_note", e.target.value)} />
        </label>
        <label className="text-sm text-mist">
          Instagram handle
          <input className={input} placeholder="@visriva.co" value={globals.instagram_handle} onChange={(e) => patch("instagram_handle", e.target.value)} />
        </label>
        <label className="text-sm text-mist">
          Instagram URL
          <input className={input} value={globals.instagram_url} onChange={(e) => patch("instagram_url", e.target.value)} />
        </label>
        <label className="text-sm text-mist">
          LinkedIn URL
          <input className={input} value={globals.linkedin_url} onChange={(e) => patch("linkedin_url", e.target.value)} />
        </label>
        <label className="text-sm text-mist">
          Public email
          <input className={input} value={globals.email} onChange={(e) => patch("email", e.target.value)} />
        </label>
        <label className="text-sm text-mist md:col-span-2">
          Copyright line
          <input className={input} value={globals.footer_copyright} onChange={(e) => patch("footer_copyright", e.target.value)} />
        </label>
        <label className="text-sm text-mist md:col-span-2">
          Footer closing line
          <input className={input} value={globals.footer_rights_line} onChange={(e) => patch("footer_rights_line", e.target.value)} />
        </label>
      </div>

      <div className="space-y-3">
        <p className="font-royal text-[10px] uppercase tracking-wider text-gold">Stat counters</p>
        {globals.stats.map((stat, i) => (
          <div key={i} className="grid gap-2 rounded-xl border border-gold/15 p-3 md:grid-cols-3">
            <input className="field" placeholder="Label" value={stat.label} onChange={(e) => patchStat(i, "label", e.target.value)} />
            <input className="field" type="number" placeholder="Value" value={stat.value} onChange={(e) => patchStat(i, "value", Number(e.target.value) || 0)} />
            <input className="field" placeholder="Suffix" value={stat.suffix} onChange={(e) => patchStat(i, "suffix", e.target.value)} />
          </div>
        ))}
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-300">{notice}</p> : null}
      <button type="submit" disabled={pending} className="liquid-button rounded-full px-7 py-3 text-xs font-bold uppercase tracking-wider disabled:opacity-50">
        {pending ? "Saving…" : "Save footer & stats ↗"}
      </button>
    </form>
  );
}