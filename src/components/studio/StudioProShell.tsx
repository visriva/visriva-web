"use client";

import { useEffect } from "react";
import { StudioCommandBar } from "@/components/studio/StudioCommandBar";
import { StudioInspector } from "@/components/studio/StudioInspector";
import { StudioLayersPanel } from "@/components/studio/StudioLayersPanel";
import { useStudio } from "@/components/studio/StudioRuntimeProvider";

export function StudioProShell({ children }: { children: React.ReactNode }) {
  const studio = useStudio();

  useEffect(() => {
    if (!studio.isStudioMode) return;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        studio.undo();
      }
      if (mod && (e.key === "Z" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        studio.redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [studio]);

  if (!studio.isStudioMode) return <>{children}</>;

  return (
    <div data-studio-ui className="fixed inset-0 z-[12000] flex flex-col bg-[#020A08]">
      <StudioCommandBar />
      <div className="flex min-h-0 flex-1">
        <StudioLayersPanel />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#06140F]">
          <div
            className="mx-auto flex min-h-0 w-full flex-1 flex-col overflow-auto transition-[max-width] duration-300"
            style={{ maxWidth: studio.canvasWidth, fontSize: `${studio.zoom}%` }}
          >
            {children}
          </div>
        </div>
        <StudioInspector />
      </div>
    </div>
  );
}