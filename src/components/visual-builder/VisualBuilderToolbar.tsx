"use client";

import Link from "next/link";
import { ChevronDown, Monitor, Smartphone } from "lucide-react";
import { useState } from "react";
import { VISUAL_BUILDER_PAGES } from "@/lib/visual-builder-types";
import { useVisualBuilder } from "@/components/visual-builder/VisualBuilderProvider";
import { LiveEditHub } from "@/components/visual-builder/LiveEditHub";

export function VisualBuilderToolbar() {
  const vb = useVisualBuilder();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!vb.isAdmin || !vb.editorOn) return null;

  const current = VISUAL_BUILDER_PAGES.find((p) => p.key === vb.pageKey);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[10000] flex h-12 items-center justify-between border-b border-[#C9A227]/50 bg-[#04150F] px-3 text-white shadow-2xl sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="shrink-0 rounded-full border border-[#C9A227]/40 bg-[#07261C] px-2 py-0.5 text-[10px] font-bold text-[#E5C158]">
            ✨ Live Visual Builder
          </span>
          <details className="relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-full border border-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E6DEC8]">
              {current?.label ?? "Page"} <ChevronDown className="h-3 w-3" />
            </summary>
            <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-[#C9A227]/40 bg-[#041A13] p-1 shadow-2xl">
              {VISUAL_BUILDER_PAGES.map((page) => (
                <Link key={page.key} href={page.href} className="block rounded-lg px-3 py-2 text-xs text-[#E6DEC8] hover:bg-white/10 hover:text-[#E5C158]">
                  {page.label}
                </Link>
              ))}
            </div>
          </details>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <ToggleBtn active={vb.viewport === "desktop"} onClick={() => vb.setViewport("desktop")} label="Desktop">
            <Monitor className="h-3.5 w-3.5" /> Desktop
          </ToggleBtn>
          <ToggleBtn active={vb.viewport === "mobile"} onClick={() => vb.setViewport("mobile")} label="Mobile preview">
            <Smartphone className="h-3.5 w-3.5" /> Mobile
          </ToggleBtn>
          <ToolbarBtn disabled={!vb.canUndo} onClick={vb.undo}>
            ↶ Undo
          </ToolbarBtn>
          <ToolbarBtn disabled={!vb.canRedo} onClick={vb.redo}>
            ↷ Redo
          </ToolbarBtn>
          <ToolbarBtn onClick={() => setDrawerOpen(true)}>+ Add / Restore</ToolbarBtn>
          <Link
            href="/?studio=true"
            className="hidden rounded-full border border-[#2EE6D6]/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#2EE6D6] hover:bg-white/5 sm:inline-flex"
          >
            Pro studio
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#E6DEC8]">
            <input type="checkbox" checked={!vb.previewMode} onChange={(e) => vb.setPreviewMode(!e.target.checked)} className="accent-[#C9A227]" />
            Edit
          </label>
          <button
            type="button"
            disabled={vb.publishing}
            onClick={() => void vb.publish()}
            className="rounded-full bg-gradient-to-r from-[#C9A227] to-[#E5C158] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#051C15] disabled:opacity-60 sm:px-4"
          >
            {vb.publishing ? "Publishing…" : "Publish live"}
          </button>
        </div>
      </div>
      <LiveEditHub />
      {drawerOpen ? (
        <RestoreDrawer
          archived={vb.state.home_layout?.archived ?? []}
          onClose={() => setDrawerOpen(false)}
          onRestore={(id) => vb.restoreSectionById(id)}
        />
      ) : null}
    </>
  );
}

function ToggleBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${active ? "bg-[#C9A227]/25 text-[#E5C158]" : "text-[#E6DEC8] hover:bg-white/10"}`}
    >
      {children}
    </button>
  );
}

function ToolbarBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E6DEC8] hover:bg-white/10 disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function RestoreDrawer({
  archived,
  onClose,
  onRestore,
}: {
  archived: { id: string; visible: boolean; order: number }[];
  onClose: () => void;
  onRestore: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[10001] bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <aside className="absolute right-0 top-12 h-[calc(100%-3rem)] w-[min(100%,360px)] border-l border-[#C9A227]/40 bg-[#04150F] p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-xl text-[#E5C158]">Restore sections</h2>
        <p className="mt-2 text-xs text-[#E6DEC8]">Bring back homepage sections you removed in this draft.</p>
        <ul className="mt-4 space-y-2">
          {archived.length ? (
            archived.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => onRestore(s.id)} className="w-full rounded-xl border border-[#C9A227]/35 px-3 py-2 text-left text-sm text-[#E6DEC8] hover:bg-white/5">
                  {s.id}
                </button>
              </li>
            ))
          ) : (
            <li className="text-sm text-[#B9C4B3]">No archived sections in this draft.</li>
          )}
        </ul>
      </aside>
    </div>
  );
}