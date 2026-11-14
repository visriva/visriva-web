import { AdminEventImagesClient } from "@/components/admin/AdminEventImagesClient";
import { AdminShell } from "@/components/admin/AdminShell";
import { getEventPhotosSettings, listEventGalleriesAdmin } from "@/lib/event-galleries";

export default async function AdminEventImagesPage() {
  const [settings, rows] = await Promise.all([getEventPhotosSettings(), listEventGalleriesAdmin()]);

  return (
    <AdminShell>
      <AdminEventImagesClient initialSettings={settings} initialRows={rows} />
    </AdminShell>
  );
}