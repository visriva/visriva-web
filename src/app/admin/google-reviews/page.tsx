import { AdminGoogleReviewsClient } from "@/components/admin/AdminGoogleReviewsClient";
import { AdminShell } from "@/components/admin/AdminShell";
import { getGoogleReviewSettings } from "@/lib/google-review";

export default async function AdminGoogleReviewsPage() {
  const settings = await getGoogleReviewSettings();

  return (
    <AdminShell>
      <main className="px-4 pb-20 pt-6 sm:px-6 lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-[1200px]">
          <AdminGoogleReviewsClient initial={settings} />
        </div>
      </main>
    </AdminShell>
  );
}