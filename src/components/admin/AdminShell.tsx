import { AdminMainColumn } from "@/components/admin/AdminLayoutClient";
import { AdminSidebar } from "@/components/admin/AdminNav";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { createAdminClient } from "@/lib/supabase-admin";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const supabase = createAdminClient();
  const live = Boolean(supabase && process.env.SUPABASE_SERVICE_ROLE_KEY);

  return (
    <div className="min-h-[100svh] bg-[linear-gradient(180deg,#06140F_0%,#0A1A14_40%,#06140F_100%)] text-cream lg:flex">
      <AdminSidebar />
      <AdminMainColumn live={live}>
        <AdminTopBar live={live} />
        {children}
      </AdminMainColumn>
    </div>
  );
}