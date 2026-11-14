"use client";

import { Suspense } from "react";
import { QrEventPhotosFlow } from "@/components/qr/QrEventPhotosFlow";
import type { EventPhotosSettings } from "@/lib/event-galleries-types";

export function QrEventPhotosSection({ initialSettings }: { initialSettings: EventPhotosSettings }) {
  return (
    <Suspense fallback={null}>
      <QrEventPhotosFlow initialSettings={initialSettings} />
    </Suspense>
  );
}