import { AdminLogin } from "@/components/AdminLogin";
import { isAdmin } from "@/lib/admin-auth";

export async function AdminGate({
  children,
  requireSupabase,
}: {
  children: React.ReactNode;
  requireSupabase?: boolean;
}) {
  if (!process.env.ADMIN_PASSWORD) {
    return (
      <main className="mx-auto max-w-xl px-4 pb-24 pt-36 text-sm leading-relaxed text-mist">
        <h1 className="font-display text-5xl italic text-cream">Admin is locked.</h1>
        <p className="mt-4">Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET, then open this page again.</p>
      </main>
    );
  }

  const allowed = await isAdmin();
  if (!allowed) {
    return (
      <main>
        <AdminLogin />
      </main>
    );
  }

  if (requireSupabase && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <main className="mx-auto max-w-xl px-4 pb-24 pt-36 text-sm text-mist">
        <h1 className="font-display text-5xl italic text-cream">Supabase is not connected.</h1>
        <p className="mt-4">
          Add <code className="text-gold-2">SUPABASE_SERVICE_ROLE_KEY</code> before using data modules.
        </p>
      </main>
    );
  }

  return children;
}
