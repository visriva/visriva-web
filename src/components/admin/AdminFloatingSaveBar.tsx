"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";

type Props = {
  dirty: boolean;
  pending: boolean;
  notice?: string;
  error?: string;
  previewHref?: string;
  onSave: () => void;
};

export function AdminFloatingSaveBar({ dirty, pending, notice, error, previewHref, onSave }: Props) {
  if (!dirty && !pending && !notice && !error) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/30 bg-[#06140F]/95 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 text-sm">
          {dirty ? <p className="text-gold-2">Unsaved changes</p> : null}
          {error ? <p className="text-red-300">{error}</p> : null}
          {!error && notice ? <p className="text-emerald-300">{notice}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {previewHref ? (
            <Link href={previewHref} target="_blank" className="rounded-full border border-gold/35 px-4 py-2 text-[10px] uppercase tracking-wider text-champagne">
              Preview live ↗
            </Link>
          ) : null}
          <button
            type="button"
            disabled={pending || !dirty}
            onClick={onSave}
            className="liquid-button inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            {pending ? "Saving…" : "Save all changes"}
          </button>
        </div>
      </div>
    </div>
  );
}