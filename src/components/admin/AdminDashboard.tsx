import Link from "next/link";
import { createAdminClient } from "@/lib/supabase-admin";

export async function AdminDashboard() {
  const supabase = createAdminClient();
  let total = 0;
  let fresh = 0;
  let readError = false;

  if (supabase) {
    const { count, error } = await supabase.from("leads").select("*", { count: "exact", head: true });
    if (error) readError = true;
    else total = count ?? 0;

    const { count: newCount, error: newError } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");
    if (!newError) fresh = newCount ?? 0;
  }

  return (
  <>
      <div>
        <p className="font-royal text-[0.68rem] uppercase tracking-[0.28em] text-gold">Overview</p>
        <h1 className="mt-2 font-display text-5xl italic text-cream">Dashboard</h1>
      </div>
      {readError ? (
        <p className="mt-8 text-sm text-gold-2">Could not load lead counts. Confirm the Supabase migration is applied.</p>
      ) : null}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:max-w-xl">
        <div className="border border-gold/25 px-5 py-6">
          <p className="font-royal text-[0.6rem] uppercase tracking-[0.2em] text-gold">All briefs</p>
          <p className="mt-2 font-display text-4xl text-cream">{total}</p>
        </div>
        <div className="border border-gold/25 px-5 py-6">
          <p className="font-royal text-[0.6rem] uppercase tracking-[0.2em] text-gold">New</p>
          <p className="mt-2 font-display text-4xl text-cream">{fresh}</p>
        </div>
      </div>
      <p className="mt-10 text-sm text-mist">
        <Link href="/admin/leads" className="text-gold-2 underline-offset-2 hover:underline">
          Open enquiries & leads
        </Link>
        {" · "}
        Service pages read from Supabase when connected; <code className="text-champagne">services-fallback</code> covers outages.
      </p>
    </>
  );
}
