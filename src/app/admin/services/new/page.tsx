import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminServiceEditor } from "@/components/admin/AdminServiceEditor";

export const metadata: Metadata = {
  title: "New service",
  robots: { index: false, follow: false },
};

export default function AdminNewServicePage() {
  return (
    <AdminGate requireSupabase>
      <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
        <div className="mx-auto max-w-[1100px]">
          <AdminServiceEditor mode="create" />
        </div>
      </main>
    </AdminGate>
  );
}
