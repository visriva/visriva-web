"use client";

import { useEffect } from "react";
import type { PageLayoutState } from "@/lib/page-section-layout";
import { useVisualBuilderOptional } from "@/components/visual-builder/VisualBuilderProvider";

export function HomeLayoutSeed({ layout }: { layout: PageLayoutState }) {
  const vb = useVisualBuilderOptional();
  useEffect(() => {
    vb?.initHomeLayout(layout);
  }, [layout, vb]);
  return null;
}