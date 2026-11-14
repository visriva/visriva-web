import { AdminNav } from "@/components/admin/AdminNav";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] bg-[linear-gradient(180deg,#06140F_0%,#0A1A14_40%,#06140F_100%)] text-cream lg:flex">
      <AdminNav />
      <div className="min-w-0 flex-1">
        <AdminTopBar />
        {children}
      </div>
    </div>
  );
}