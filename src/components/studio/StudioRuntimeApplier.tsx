"use client";

import { useEffect } from "react";
import { applyPublishedState } from "@/lib/studio-dom";
import type { StudioPageState } from "@/lib/studio-types";
import { useStudioOptional } from "@/components/studio/StudioRuntimeProvider";

/** Applies published DOM overrides on every page load (zero-shift after hydration). */
export function StudioRuntimeApplier() {
  const studio = useStudioOptional();
  useEffect(() => {
    if (!studio || studio.isStudioMode) return;
    const root = document.getElementById("content");
    if (!root) return;
    applyPublishedState(root, studio.state, "desktop");
  }, [studio, studio?.state, studio?.isStudioMode]);
  return null;
}