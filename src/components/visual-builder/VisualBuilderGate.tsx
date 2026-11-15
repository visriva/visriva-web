"use client";

import { Suspense } from "react";
import { VisualBuilderProvider } from "@/components/visual-builder/VisualBuilderProvider";
import { StudioGate } from "@/components/studio/StudioGate";

function VisualBuilderInner({ children }: { children: React.ReactNode }) {
  return (
    <VisualBuilderProvider>
      <StudioGate>{children}</StudioGate>
    </VisualBuilderProvider>
  );
}

/** Single gate for live builder — does not duplicate Navbar/Footer (.cursorrules). */
export function VisualBuilderGate({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <VisualBuilderInner>{children}</VisualBuilderInner>
    </Suspense>
  );
}