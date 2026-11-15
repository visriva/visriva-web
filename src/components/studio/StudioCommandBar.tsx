"use client";

import Link from "next/link";
import { ChevronDown, Grid3x3, History, Monitor, Smartphone, Tablet, Zap } from "lucide-react";
import { useState } from "react";
import { STUDIO_PAGES } from "@/lib/studio-types";
import { useStudio } from "@/components/studio/StudioRuntimeProvider";

export function StudioCommandBar() {
  const studio = useStudio();
  const [historyOpen, setHistoryOpen] = useState(false);
  const page = STUDIO_PAGES.find((p) => p.key === studio.pageKey);

  return (
    <header data-studio-ui className="flex h-[3.25rem] shrink-0 items-center justify-between gap-2 border-b border-[#C9A227]/40 bg-[#041812] px-3 text-white sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <span className="hidden shrink-0 rounded-full border border-[#C9A227]/50 bg-[#07261C] px-2.5 py-1 text-[10px] font-bold text-[#E5C158] sm:inline">
          🎨 Pro Visual Studio
        </span>
        <details className="relative">
          <summary className="flex cursor-pointer list-none items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E6DEC8]">
            {page?.label ?? "Page"} <ChevronDown className="h-3 w-3" />
          </summary>
          <div className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border border-[#C9A227]/40 bg-[#041A13] p-1 shadow-2xl">
            {STUDIO_PAGES.map((p) => (
              <Link key={p.key} href={p.href} className="block rounded-lg px-3 py-2 text-xs text-[#E6DEC8] hover:bg-white/10 hover:text-[#E5C158]">
                {p.label}
              </Link>
            ))}
          </div>
        </details>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <BpBtn active={studio.viewport === "desktop"} onClick={() => studio.setViewport("desktop")} icon={<Monitor className="h-3 w-3" />} label="Desktop 1440" />
        <BpBtn active={studio.viewport === "tablet"} onClick={() => studio.setViewport("tablet")} icon={<Tablet className="h-3 w-3" />} label="Tablet 768" />
        <BpBtn active={studio.viewport === "mobile"} onClick={() => studio.setViewport("mobile")} icon={<Smartphone className="h-3 w-3" />} label="iPhone 390" />
        {[75, 100, 125].map((z) => (
          <button
            key={z}
            type="button"
            onClick={() => studio.setZoom(z)}
            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${studio.zoom === z ? "bg-[#C9A227] text-[#041812]" : "border border-white/15 text-[#E6DEC8]"}`}
          >
            {z}%
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button type="button" disabled={!studio.canUndo} onClick={studio.undo} className="rounded-full border border-white/15 px-2 py-1 text-[10px] font-semibold text-[#E6DEC8] disabled:opacity-40">
          ↶ Undo
        </button>
        <button type="button" disabled={!studio.canRedo} onClick={studio.redo} className="rounded-full border border-white/15 px-2 py-1 text-[10px] font-semibold text-[#E6DEC8] disabled:opacity-40">
          ↷ Redo
        </button>
        <div className="relative">
          <button type="button" onClick={() => setHistoryOpen((v) => !v)} className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-1 text-[10px] font-semibold text-[#E6DEC8]">
            <History className="h-3 w-3" /> History
          </button>
          {historyOpen ? (
            <div className="absolute right-0 top-full z-50 mt-1 max-h-64 w-56 overflow-y-auto rounded-xl border border-[#C9A227]/40 bg-[#041A13] p-1 shadow-2xl">
              {studio.state.snapshots.length ? (
                studio.state.snapshots.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      studio.jumpToSnapshot(s.id);
                      setHistoryOpen(false);
                    }}
                    className="block w-full rounded-lg px-2 py-2 text-left text-[10px] text-[#E6DEC8] hover:bg-white/10"
                  >
                    {s.label}
                    <span className="mt-0.5 block text-[9px] text-mist">{new Date(s.createdAt).toLocaleString()}</span>
                  </button>
                ))
              ) : (
                <p className="px-2 py-2 text-[10px] text-mist">Save a snapshot from the inspector.</p>
              )}
            </div>
          ) : null}
        </div>
        <button type="button" onClick={() => studio.setXRay(!studio.xRay)} className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${studio.xRay ? "border-[#2EE6D6]/60 text-[#2EE6D6]" : "border-white/15 text-[#E6DEC8]"}`}>
          X-Ray
        </button>
        <button type="button" onClick={() => studio.setGridGuides(!studio.gridGuides)} className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${studio.gridGuides ? "border-[#E5C158]/60 text-[#E5C158]" : "border-white/15 text-[#E6DEC8]"}`}>
          <Grid3x3 className="h-3 w-3" /> Grid
        </button>
        <button type="button" disabled={studio.saving} onClick={() => void studio.saveDraft()} className="rounded-full border border-white/15 px-2 py-1 text-[10px] font-semibold text-[#E6DEC8]">
          {studio.saving ? "Saving…" : "Save draft"}
        </button>
        <button
          type="button"
          disabled={studio.publishing}
          onClick={() => void studio.publish()}
          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#C9A227] to-[#E5C158] px-3 py-1.5 text-[10px] font-bold uppercase text-[#041812] disabled:opacity-50"
        >
          <Zap className="h-3 w-3" /> Publish live
        </button>
        <Link
          href="/"
          onClick={() => {
            if (typeof window !== "undefined") localStorage.removeItem("visriva-studio-mode");
          }}
          className="rounded-full border border-white/20 px-2 py-1 text-[10px] font-semibold text-[#E6DEC8]"
        >
          Exit studio
        </Link>
      </div>
    </header>
  );
}

function BpBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hidden items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold sm:inline-flex ${active ? "bg-[#C9A227]/25 text-[#E5C158]" : "border border-white/12 text-[#E6DEC8]"}`}
    >
      {icon} {label}
    </button>
  );
}