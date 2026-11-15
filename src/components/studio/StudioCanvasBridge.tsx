"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { describeElement, elementStudioId, findEditableAtPoint, hydrateStudioIds } from "@/lib/studio-dom";
import { useStudio } from "@/components/studio/StudioRuntimeProvider";

export function StudioCanvasBridge() {
  const studio = useStudio();
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!studio.isStudioMode) return;
    const root = document.getElementById("content");
    if (!root) return;
    hydrateStudioIds(root);
    studio.refreshLayers();

    const onMove = (e: MouseEvent) => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const target = findEditableAtPoint(e.clientX, e.clientY, root);
        studio.setHoverElement(target);
      });
    };

    const onClick = (e: MouseEvent) => {
      const target = findEditableAtPoint(e.clientX, e.clientY, root);
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      const id = elementStudioId(target);
      const { tag, label } = describeElement(target);
      studio.patchOverride({ studioId: id, tag, label, text: target.textContent ?? undefined });
      studio.selectById(id);
    };

    const onScroll = () => {
      if (studio.selectedEl) studio.setHoverElement(studio.selectedEl);
    };

    root.addEventListener("mousemove", onMove, { passive: true });
    root.addEventListener("click", onClick, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [studio]);

  if (!studio.isStudioMode) return null;
  return <StudioCanvasOverlays />;
}

function StudioCanvasOverlays() {
  const studio = useStudio();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const hover = studio.hoverEl;
  const hoverRect = hover?.getBoundingClientRect();
  const selectedRect = studio.selectedEl?.getBoundingClientRect();
  const xRayRect = selectedRect ?? hoverRect;

  return createPortal(
    <div data-studio-ui className="pointer-events-none fixed inset-0 z-[15000]">
      {studio.gridGuides ? (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,162,39,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.25) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      ) : null}
      {studio.xRay && xRayRect && hover ? (
        <SelectionFrame
          rect={xRayRect}
          kind={describeElement(studio.selectedEl ?? hover).kind}
          selected={Boolean(studio.selectedId)}
        />
      ) : null}
    </div>,
    document.body,
  );
}

function SelectionFrame({ rect, kind, selected }: { rect: DOMRect; kind: string; selected: boolean }) {
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);
  return (
    <>
      <motion.div
        className="absolute rounded-sm"
        layout={false}
        style={{
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          boxShadow: selected ? "inset 0 0 0 2px #E5C158" : "inset 0 0 0 1px #2EE6D6",
        }}
      />
      <div
        className="absolute rounded-md border border-[#2EE6D6]/40 bg-[#041812]/92 px-2 py-1 font-mono text-[10px] text-[#2EE6D6] shadow-lg"
        style={{ left: rect.left, top: Math.max(8, rect.top - 26) }}
      >
        {kind} • {w} × {h} px
      </div>
      {selected ? <ResizeHandles rect={rect} /> : null}
    </>
  );
}

function ResizeHandles({ rect }: { rect: DOMRect }) {
  const points = [
    [rect.left, rect.top],
    [rect.right, rect.top],
    [rect.left, rect.bottom],
    [rect.right, rect.bottom],
    [rect.left + rect.width / 2, rect.top],
    [rect.left + rect.width / 2, rect.bottom],
    [rect.left, rect.top + rect.height / 2],
    [rect.right, rect.top + rect.height / 2],
  ];
  return (
    <>
      {points.map(([x, y], i) => (
        <span
          key={i}
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E5C158] bg-[#07261C]"
          style={{ left: x, top: y }}
        />
      ))}
    </>
  );
}