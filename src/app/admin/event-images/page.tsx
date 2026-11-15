import { AdminEventImagesClient } from "@/components/admin/AdminEventImagesClient";
import { getEventPhotosSettings, listEventGalleriesAdmin } from "@/lib/event-galleries";

export default async function AdminEventImagesPage() {
  const [settings, rows] = await Promise.all([getEventPhotosSettings(), listEventGalleriesAdmin()]);

  return (
    <main className="px-4 pb-20 pt-6 sm:px-6 lg:px-10 lg:pt-8">
      <div className="mx-auto max-w-[1200px]">
        <AdminEventImagesClient initialSettings={settings} initialRows={rows} />
      </div>
    </main>
  );
}