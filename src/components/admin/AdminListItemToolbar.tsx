"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

export function AdminListItemToolbar({
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 flex-col gap-1">
      <button type="button" disabled={index === 0} onClick={onMoveUp} className="rounded border border-gold/25 p-1 disabled:opacity-30" aria-label="Move up">
        <ChevronUp className="h-3.5 w-3.5" aria-hidden />
      </button>
      <button type="button" disabled={index >= total - 1} onClick={onMoveDown} className="rounded border border-gold/25 p-1 disabled:opacity-30" aria-label="Move down">
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </button>
      <button type="button" onClick={onRemove} className="rounded border border-gold/25 p-1 text-gold-2 hover:bg-red-900/20" aria-label="Remove">
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}