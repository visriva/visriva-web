import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminServiceEditor } from "@/components/admin/AdminServiceEditor";
import { createAdminClient } from "@/lib/supabase-admin";
import type { ServiceRow } from "@/lib/service-row";

export const instant = false;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Edit ${id}`, robots: { index: false, follow: false } };
}

export default async function AdminEditServicePage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();
  if (!supabase) notFound();

  const { data } = await supabase.from("services").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <AdminGate requireSupabase>
      <main className="px-4 pb-24 pt-28 sm:px-6 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-[1100px]">
          <AdminServiceEditor mode="edit" initial={data as ServiceRow} />
        </div>
      </main>
    </AdminGate>
  );
}
