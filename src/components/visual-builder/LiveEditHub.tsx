"use client";

import Link from "next/link";
import { Palette, PenLine, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useVisualBuilder } from "@/components/visual-builder/VisualBuilderProvider";
import { STUDIO_PAGES } from "@/lib/studio-types";

const TIPS = [
  "Click any gold dashed text to edit inline.",
  "Click a station image to upload a new photo (1000×1200 px cards).",
  "Hover a section to hide, reorder, or restore it.",
  "Use Pro Studio for full-page click-to-edit on any element.",
];

export function LiveEditHub() {
  const vb = useVisualBuilder();
  const [open, setOpen] = useState(false);
  if (!vb.isAdmin || !vb.editorOn) return null;

  const studioHref = STUDIO_PAGES.find((p) => p.key === vb.pageKey)?.href ?? "/?studio=true";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-4 z-[10001] inline-flex items-center gap-2 rounded-full border border-[#C9A227]/55 bg-[#04150F]/95 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#E5C158] shadow-2xl backdrop-blur-xl"
      >
        <PenLine className="h-3.5 w-3.5" /> Live edit guide
      </button>
      {open ? (
        <div className="fixed inset-0 z-[10002] bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <aside
            className="absolute bottom-0 left-0 right-0 max-h-[85svh] overflow-y-auto rounded-t-[1.5rem] border border-[#C9A227]/40 bg-[#04150F] p-6 sm:left-4 sm:right-auto sm:top-16 sm:max-w-md sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-2xl text-[#E5C158]">Edit this page live</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs leading-6 text-[#E6DEC8]">
              <strong className="text-[#E5C158]">Classic builder</strong> (current): inline text & images on Hero, Experiences, and Featured stations.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-[#B9C4B3]">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-[#C9A227]" />
                  {tip}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-2">
              <Link
                href={studioHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C9A227] to-[#E5C158] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#041812]"
              >
                <Palette className="h-3.5 w-3.5" /> Open Pro Visual Studio
              </Link>
              <Link href="/admin/website" className="rounded-full border border-[#C9A227]/35 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-[#E6DEC8]">
                Website CMS (forms)
              </Link>
              <Link href="/admin/services" className="rounded-full border border-white/15 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-[#E6DEC8]">
                Services & categories
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
