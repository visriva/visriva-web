"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { StudioCanvasBridge } from "@/components/studio/StudioCanvasBridge";
import { StudioProShell } from "@/components/studio/StudioProShell";
import { StudioRuntimeProvider } from "@/components/studio/StudioRuntimeProvider";
import { VisualBuilderToolbar } from "@/components/visual-builder/VisualBuilderToolbar";

function StudioGateInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const studioOn = searchParams.get("studio") === "true" || searchParams.get("studio") === "1";

  if (!studioOn) {
    return (
      <>
        <VisualBuilderToolbar />
        {children}
      </>
    );
  }

  return (
    <StudioRuntimeProvider>
      <StudioProShell>
        {children}
        <StudioCanvasBridge />
      </StudioProShell>
    </StudioRuntimeProvider>
  );
}

/** Pro Studio only loads when ?studio=true — public pages skip studio runtime (no flash). */
export function StudioGate({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <>
          <VisualBuilderToolbar />
          {children}
        </>
      }
    >
      <StudioGateInner>{children}</StudioGateInner>
    </Suspense>
  );
}