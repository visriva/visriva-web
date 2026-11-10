import { inr } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase-admin";

type Lead = {
  id: string;
  created_at: string;
  status: string;
  services: { name?: string; quantity?: number; amount?: number | null }[] | null;
  venue: string | null;
  city: string | null;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  headcount: number | null;
  contact_name: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  estimated_from: number | null;
};

const when = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export async function AdminLeadsTable() {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const leads = (data ?? []) as Lead[];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 lg:hidden">
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="border border-gold/40 px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-champagne">
            Sign out
          </button>
        </form>
      </div>
      {error ? (
        <p className="mt-8 text-sm text-gold-2">Could not read leads. Check that the migration has been applied.</p>
      ) : null}
      <div className="mt-8 overflow-x-auto border border-gold/25">
        <table className="min-w-[960px] w-full text-left text-sm">
          <thead className="bg-emerald/40 font-royal text-[0.6rem] uppercase tracking-[0.18em] text-gold">
            <tr>
              {["When", "Status", "Contact", "Event", "Stations", "From"].map((heading) => (
                <th key={heading} className="px-4 py-3 font-normal">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.length ? (
              leads.map((lead) => (
                <tr key={lead.id} className="border-t border-gold/15 align-top">
                  <td className="px-4 py-4 text-mist">{when.format(new Date(lead.created_at))}</td>
                  <td className="px-4 py-4 uppercase tracking-wider text-gold">{lead.status}</td>
                  <td className="px-4 py-4 text-cream">
                    <div>{lead.contact_name || "—"}</div>
                    <div className="text-mist">{lead.company}</div>
                    <div>{lead.phone}</div>
                    <div>{lead.email}</div>
                  </td>
                  <td className="px-4 py-4 text-cream">
                    <div>{[lead.venue, lead.city].filter(Boolean).join(", ") || "—"}</div>
                    <div className="text-mist">
                      {[lead.event_date, lead.start_time, lead.end_time].filter(Boolean).join(" · ")}
                    </div>
                    <div className="text-mist">{lead.headcount ? `${lead.headcount} guests` : ""}</div>
                    {lead.notes ? <div className="mt-2 max-w-xs text-champagne/80">{lead.notes}</div> : null}
                  </td>
                  <td className="px-4 py-4 text-cream">
                    {(lead.services ?? []).map((service) => (
                      <div key={`${lead.id}-${service.name}`}>
                        {service.name}
                        {service.quantity ? ` × ${service.quantity}` : ""}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-4 text-gold-2">
                    {lead.estimated_from != null ? inr(Number(lead.estimated_from)) : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-mist">
                  No briefs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
