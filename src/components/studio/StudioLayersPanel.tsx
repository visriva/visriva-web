"use client";

import { Eye, EyeOff, Layers, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { StudioBlockKind, StudioLayerNode } from "@/lib/studio-types";
import { useStudio } from "@/components/studio/StudioRuntimeProvider";

const BLOCKS: { kind: StudioBlockKind; label: string }[] = [
  { kind: "heading", label: "Text heading" },
  { kind: "paragraph", label: "Paragraph" },
  { kind: "gold-button", label: "Liquid gold button" },
  { kind: "image-card", label: "Universal image card" },
  { kind: "flip-card", label: "Framer flip card" },
  { kind: "category-bar", label: "Bouncy category bar" },
  { kind: "pricing-card", label: "Pricing tier card" },
  { kind: "faq", label: "FAQ accordion" },
  { kind: "whatsapp-cta", label: "WhatsApp CTA banner" },
  { kind: "review-card", label: "Google review card" },
  { kind: "html-embed", label: "Custom HTML / iframe" },
];

export function StudioLayersPanel() {
  const studio = useStudio();
  const [tab, setTab] = useState<"layers" | "add">("layers");

  return (
    <aside data-studio-ui className="flex w-72 shrink-0 flex-col border-r border-[#C9A227]/30 bg-[#03150F] text-[#E6DEC8]">
      <div className="flex border-b border-white/10 text-[10px] font-bold uppercase tracking-wider">
        <TabBtn active={tab === "layers"} onClick={() => setTab("layers")} icon={<Layers className="h-3 w-3" />} label="Layers" />
        <TabBtn active={tab === "add"} onClick={() => setTab("add")} icon={<Plus className="h-3 w-3" />} label="Add" />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {tab === "layers" ? (
          <>
            <p className="mb-2 text-[10px] uppercase tracking-[.2em] text-[#C9A227]">Live page tree</p>
            <LayerTree nodes={studio.layers} selectedId={studio.selectedId} onSelect={studio.selectById} depth={0} />
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="mb-2 text-[10px] uppercase tracking-[.2em] text-[#C9A227]">♻️ Deleted bin</p>
              {studio.state.trash.length ? (
                studio.state.trash.map((t) => (
                  <button
                    key={t.studioId}
                    type="button"
                    onClick={() => studio.restoreFromTrash(t.studioId)}
                    className="mb-1 flex w-full items-center justify-between rounded-lg border border-red-400/20 bg-red-950/20 px-2 py-1.5 text-left text-[10px] hover:border-[#C9A227]/40"
                  >
                    <span className="truncate">{t.label ?? t.studioId}</span>
                    <span className="text-[#E5C158]">Restore</span>
                  </button>
                ))
              ) : (
                <p className="text-[10px] text-mist">No deleted items.</p>
              )}
            </div>
          </>
        ) : (
          <div className="grid gap-1.5">
            {BLOCKS.map((b) => (
              <button
                key={b.kind}
                type="button"
                onClick={() => studio.insertBlock(b.kind)}
                className="rounded-xl border border-[#806B2D]/35 bg-[#0A1F16]/80 px-3 py-2.5 text-left text-xs transition hover:border-[#C9A227] hover:text-[#E5C158]"
              >
                + {b.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 py-3 ${active ? "bg-[#07261C] text-[#E5C158]" : "text-mist"}`}
    >
      {icon} {label}
    </button>
  );
}

function LayerTree({
  nodes,
  selectedId,
  onSelect,
  depth,
}: {
  nodes: StudioLayerNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  depth: number;
}) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((n) => (
        <li key={n.studioId}>
          <button
            type="button"
            onClick={() => onSelect(n.studioId)}
            className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] ${selectedId === n.studioId ? "bg-[#C9A227]/20 text-[#E5C158]" : "hover:bg-white/5"}`}
            style={{ paddingLeft: 8 + depth * 12 }}
          >
            <span className="truncate">{n.label}</span>
            <span className="ml-auto text-[9px] text-mist">{n.rect ? `${n.rect.width}×${n.rect.height}` : n.tag}</span>
          </button>
          {n.children.length ? <LayerTree nodes={n.children} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} /> : null}
        </li>
      ))}
    </ul>
  );
}
