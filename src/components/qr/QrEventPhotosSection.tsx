"use client";

import { QrEventPhotosFlow } from "@/components/qr/QrEventPhotosFlow";
import type { EventPhotosSettings } from "@/lib/event-galleries-types";

export function QrEventPhotosSection({ initialSettings }: { initialSettings: EventPhotosSettings }) {
  return <QrEventPhotosFlow initialSettings={initialSettings} />;
}