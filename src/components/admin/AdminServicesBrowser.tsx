"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ServiceRow } from "@/lib/service-row";
import type { PublishStatus } from "@/lib/services-types";

const statuses: PublishStatus[] = ["draft", "preview", "published", "archived"];

export function AdminServicesBrowser({ rows }: { rows: ServiceRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PublishStatus | "all">("all");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(rows.map((row) => row.category))).sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (status !== "all" && row.publish_status !== status) return false;
      if (category !== "all" && row.category !== category) return false;
      if (!q) return true;
      return (
        row.id.includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.summary.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q)
      );
    });
  }, [rows, query, status, category]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-royal text-[0.68rem] uppercase tracking-[0.28em] text-gold">Catalogue</p>
          <h1 className="mt-2 font-display text-5xl italic text-cream">Services</h1>
        </div>
        <Link
          href="/admin/services/new"
          className="border border-gold/50 bg-gold/10 px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-cream"
        >
          New service
        </Link>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <input
          className="field"
          placeholder="Search name, id, category…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select className="field" value={status} onChange={(event) => setStatus(event.target.value as PublishStatus | "all")}>
          <option value="all">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 overflow-x-auto border border-gold/25">
        <table className="min-w-[960px] w-full text-left text-sm">
          <thead className="bg-emerald/40 font-royal text-[0.6rem] uppercase tracking-[0.18em] text-gold">
            <tr>
              {["Service", "Category", "Status", "Price", "Sort", ""].map((heading) => (
                <th key={heading} className="px-4 py-3 font-normal">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t border-gold/15 align-top">
                <td className="px-4 py-4 text-cream">
                  <div>{row.name}</div>
                  <div className="text-mist">{row.id}</div>
                  {row.coming_soon ? <span className="text-[0.62rem] uppercase text-gold">Coming soon</span> : null}
                </td>
                <td className="px-4 py-4 text-mist">{row.category}</td>
                <td className="px-4 py-4 uppercase tracking-wider text-gold">{row.publish_status}</td>
                <td className="px-4 py-4 text-gold-2">{row.price_label}</td>
                <td className="px-4 py-4 text-mist">{row.sort_order}</td>
                <td className="px-4 py-4">
                  <Link href={`/admin/services/${row.id}`} className="text-[0.68rem] uppercase tracking-[0.14em] text-champagne underline-offset-2 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {!filtered.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-mist">
                  No services match.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
