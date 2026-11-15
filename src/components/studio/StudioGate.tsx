"use client";

import { Suspense } from "react";
import { StudioProShell } from "@/components/studio/StudioProShell";
import { StudioRuntimeProvider, useStudioOptional } from "@/components/studio/StudioRuntimeProvider";
import { VisualBuilderToolbar } from "@/components/visual-builder/VisualBuilderToolbar";
import { StudioRuntimeApplier } from "@/components/studio/StudioRuntimeApplier";

function StudioChrome({ children }: { children: React.ReactNode }) {
  const studio = useStudioOptional();
  if (studio?.isStudioMode) {
    return <StudioProShell>{children}</StudioProShell>;
  }
  return (
    <>
      <VisualBuilderToolbar />
      {children}
    </>
  );
}

/** Wraps the public site — single studio gate (.cursorrules). */
export function StudioGate({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <StudioRuntimeProvider>
        <StudioRuntimeApplier />
        <StudioChrome>{children}</StudioChrome>
      </StudioRuntimeProvider>
    </Suspense>
  );
}