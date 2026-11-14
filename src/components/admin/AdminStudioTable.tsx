"use client";

import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminFloatingSaveBar } from "@/components/admin/AdminFloatingSaveBar";
import type { StudioTable } from "@/lib/studio-tables";

type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "checkbox";
  options?: string[];
  placeholder?: string;
};

type Props = {
  table: StudioTable;
  title: string;
  kicker: string;
  description: string;
  fields: Field[];
  newRow: Record<string, unknown>;
};

export function AdminStudioTable({ table, title, kicker, description, fields, newRow }: Props) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const apiBase = `/api/admin/studio/${table}`;

  async function refresh() {
    setLoading(true);
    const response = await fetch(apiBase);
    const body = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setError(typeof body.error === "string" ? body.error : "Could not load records.");
      return;
    }
    setRows((body.rows ?? []) as Record<string, unknown>[]);
  }

  useEffect(() => {
    void refresh();
  }, [apiBase]);

  function startNew() {
    setDraft({ ...newRow });
    setNotice("");
    setError("");
  }

  async function saveDraft() {
    if (!draft) return;
    setPending(true);
    setError("");
    const response = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(typeof body.error === "string" ? body.error : "Could not create record.");
      return;
    }
    setDraft(null);
    setNotice("Record added.");
    await refresh();
  }

  async function updateRow(id: string, patch: Record<string, unknown>) {
    setPending(true);
    const response = await fetch(`${apiBase}/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(typeof body.error === "string" ? body.error : "Update failed.");
      return;
    }
    if (body.row) setRows((list) => list.map((row) => (row.id === id ? (body.row as Record<string, unknown>) : row)));
  }

  async function removeRow(id: string) {
    if (!confirm("Delete this record?")) return;
    setPending(true);
    const response = await fetch(`${apiBase}/${encodeURIComponent(id)}`, { method: "DELETE" });
    setPending(false);
    if (!response.ok) {
      setError("Delete failed.");
      return;
    }
    setRows((list) => list.filter((row) => row.id !== id));
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="font-royal text-[0.62rem] uppercase tracking-[0.28em] text-gold">{kicker}</p>
        <h1 className="mt-2 font-display text-4xl italic text-cream">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-mist">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={startNew} className="liquid-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-[10px] font-bold uppercase tracking-wider">
          <Plus className="h-4 w-4" aria-hidden />
          Add new
        </button>
      </div>

      {draft ? (
        <NewRecordForm fields={fields} draft={draft} onChange={setDraft} onCancel={() => setDraft(null)} onSave={saveDraft} pending={pending} />
      ) : null}

      {loading ? (
        <p className="text-sm text-mist">
          <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden />
          Loading…
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gold/25">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-emerald/30 font-royal text-[0.58rem] uppercase tracking-[0.16em] text-gold">
              <tr>
                {fields.map((f) => (
                  <th key={f.key} className="px-3 py-3 font-normal">
                    {f.label}
                  </th>
                ))}
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={String(row.id)} className="border-t border-gold/10 align-top">
                  {fields.map((f) => (
                    <td key={f.key} className="px-3 py-3 text-champagne">
                      <FieldControl field={f} value={row[f.key]} onChange={(value) => void updateRow(String(row.id), { [f.key]: value })} />
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <button type="button" disabled={pending} onClick={() => removeRow(String(row.id))} className="text-[10px] uppercase tracking-wider text-gold-2 underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length ? <p className="px-4 py-8 text-center text-mist">No records yet — add your first row above.</p> : null}
        </div>
      )}

      <AdminFloatingSaveBar dirty={Boolean(draft)} pending={pending} notice={notice} error={error} onSave={saveDraft} />
    </div>
  );
}

function FieldControl({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  if (field.type === "checkbox") {
    return <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />;
  }
  if (field.type === "select" && field.options) {
    return (
      <select className="field text-xs" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }
  const inputType = field.type === "number" ? "number" : field.type === "date" ? "date" : "text";
  return (
    <input
      className="field min-h-9 text-xs"
      type={inputType}
      value={value == null ? "" : String(value)}
      placeholder={field.placeholder}
      onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) || 0 : e.target.value)}
    />
  );
}

function NewRecordForm({
  fields,
  draft,
  onChange,
  onCancel,
  onSave,
  pending,
}: {
  fields: Field[];
  draft: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  onCancel: () => void;
  onSave: () => void;
  pending: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gold/30 bg-[#0D2117] p-5">
      <p className="section-kicker">New record</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className="text-sm text-mist">
            {f.label}
            <FieldControl field={f} value={draft[f.key]} onChange={(v) => onChange({ ...draft, [f.key]: v })} />
          </label>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" disabled={pending} onClick={onSave} className="liquid-button rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-wider">
          Save record
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-gold/30 px-5 py-2 text-[10px] uppercase tracking-wider text-mist">
          Cancel
        </button>
      </div>
    </div>
  );
}