"use client";

import { Plus } from "lucide-react";

type Props = {
  archived: { id: string; label: string }[];
  onRestore: (id: string) => void;
};

export function AdminRestoreSectionsDrawer({ archived, onRestore }: Props) {
  if (!archived.length) return null;

  return (
    <div className="rounded-2xl border border-dashed border-gold/35 bg-emerald/10 p-5">
      <p className="font-royal text-[10px] uppercase tracking-[0.24em] text-gold">Restore deleted sections</p>
      <p className="mt-1 text-xs text-mist">Bring back a section without losing its saved copy.</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {archived.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onRestore(item.id)}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-[#0D2117] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-champagne hover:border-gold"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}