"use client";

import { ChevronDown, ChevronUp, Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  title: string;
  visible: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onToggleVisible: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  children: React.ReactNode;
};

/** Section-level delete / hide / reorder controls for Visual CMS. */
export function SectionWrapper(props: Props) {
  return <AdminSectionShell {...props} />;
}

export function AdminSectionShell({
  title,
  visible,
  canMoveUp,
  canMoveDown,
  onToggleVisible,
  onMoveUp,
  onMoveDown,
  onDelete,
  children,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <section className={`rounded-2xl border bg-[#0D2117] ${visible ? "border-gold/25" : "border-mist/25 opacity-75"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/15 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <p className="font-royal text-[10px] uppercase tracking-[0.22em] text-gold">{title}</p>
          {!visible ? (
            <span className="rounded-full border border-mist/40 px-2 py-0.5 text-[9px] uppercase tracking-wider text-mist">Hidden</span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            title={visible ? "Hide section" : "Show section"}
            onClick={onToggleVisible}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gold/25 text-champagne hover:bg-white/5"
          >
            {visible ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
          </button>
          <button type="button" disabled={!canMoveUp} onClick={onMoveUp} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gold/25 disabled:opacity-30" aria-label="Move up">
            <ChevronUp className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" disabled={!canMoveDown} onClick={onMoveDown} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gold/25 disabled:opacity-30" aria-label="Move down">
            <ChevronDown className="h-4 w-4" aria-hidden />
          </button>
          {confirmDelete ? (
            <span className="flex items-center gap-2">
              <button type="button" onClick={onDelete} className="rounded-full border border-red-400/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-200">
                Confirm delete
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="text-[10px] text-mist">
                Cancel
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gold/25 text-gold-2 hover:bg-red-900/20"
              aria-label="Delete section"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </section>
  );
}