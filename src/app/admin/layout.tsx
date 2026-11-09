import { connection } from "next/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { isAdmin } from "@/lib/admin-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const showShell = Boolean(process.env.ADMIN_PASSWORD) && (await isAdmin());
  if (!showShell) return children;
  return <AdminShell>{children}</AdminShell>;
}
