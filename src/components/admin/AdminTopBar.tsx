import { createAdminClient } from "@/lib/supabase-admin";

export async function AdminTopBar() {
  const supabase = createAdminClient();
  const live = Boolean(supabase && process.env.SUPABASE_SERVICE_ROLE_KEY);

  return (
    <div className="border-b border-gold/15 bg-ink/60 px-4 py-3 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
        <p className="font-royal text-[0.6rem] uppercase tracking-[0.22em] text-mist">Executive command center</p>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
            live ? "border-emerald-400/40 bg-emerald-900/30 text-emerald-200" : "border-gold/40 bg-gold/10 text-gold-2"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${live ? "bg-emerald-400" : "bg-gold"}`} aria-hidden />
          {live ? "Supabase live & synced" : "Supabase not connected"}
        </span>
      </div>
    </div>
  );
}