"use client";

import type { ReactNode } from "react";
import { useVisualBuilderOptional } from "@/components/visual-builder/VisualBuilderProvider";

/** Live-edit toolbar offset only — keeps <main id="content"> on the server layout. */
export function EditMainPad({ children }: { children: ReactNode }) {
  const vb = useVisualBuilderOptional();
  const editPad = vb?.isAdmin && vb?.editorOn ? "pt-12" : "";

  return <div className={`flex w-full flex-col ${editPad}`}>{children}</div>;
}