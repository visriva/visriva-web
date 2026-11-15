"use client";

import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import { useVisualBuilderOptional } from "@/components/visual-builder/VisualBuilderProvider";

export function VisualSection({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  const vb = useVisualBuilderOptional();
  if (!vb?.isEditMode || vb.pageKey !== "home") {
    return <>{children}</>;
  }

  const hidden = vb.state.home_layout?.sections.find((s) => s.id === id)?.visible === false;

  return (
    <div className={`group relative ${hidden ? "opacity-45" : ""}`} data-vb-section={id}>
      <div className="pointer-events-none absolute inset-x-0 top-2 z-[9990] flex justify-center opacity-0 transition group-hover:opacity-100">
        <div className="pointer-events-auto flex flex-wrap items-center gap-1 rounded-full border border-[#C9A227]/50 bg-[#04150F]/95 px-2 py-1 shadow-xl">
          <span className="px-2 text-[9px] font-bold uppercase tracking-wider text-[#E5C158]">{label}</span>
          <IconBtn label="Hide" onClick={() => vb.toggleSection(id)}>
            {hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </IconBtn>
          <IconBtn label="Move up" onClick={() => vb.moveSectionUp(id)}>
            <ArrowUp className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn label="Move down" onClick={() => vb.moveSectionDown(id)}>
            <ArrowDown className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn label="Delete" onClick={() => vb.deleteSectionById(id)}>
            <Trash2 className="h-3.5 w-3.5 text-red-300" />
          </IconBtn>
          <IconBtn label="Copy anchor" onClick={() => void navigator.clipboard?.writeText(`${window.location.origin}/#${id}`)}>
            <Copy className="h-3.5 w-3.5" />
          </IconBtn>
        </div>
      </div>
      <div className="rounded-sm outline-dashed outline-0 transition group-hover:outline-1 group-hover:outline-[#C9A227]/45">{children}</div>
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="grid h-8 w-8 place-items-center rounded-full text-[#E6DEC8] hover:bg-white/10">
      {children}
    </button>
  );
}