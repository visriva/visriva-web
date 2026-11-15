"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { StudioCanvasBridge } from "@/components/studio/StudioCanvasBridge";
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
          <motion.div
            className="mx-auto flex min-h-0 flex-1 origin-top flex-col overflow-auto transition-[width,transform] duration-300"
            style={{
              width: studio.canvasWidth,
              transform: `scale(${studio.zoom / 100})`,
            }}
          >
            {children}
          </motion.div>
        </div>
        <StudioInspector />
      </div>
      <StudioCanvasBridge />
    </div>
  );
}