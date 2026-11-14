import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { getAdminDashboardStats, getRecentLeads } from "@/lib/admin-dashboard-stats";

function waLink(phone: string | null) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

function stationsLabel(services: { name?: string; quantity?: number }[] | null) {
  if (!services?.length) return "—";
  return services
    .map((s) => (s.quantity ? `${s.name ?? "Station"} ×${s.quantity}` : s.name ?? "Station"))
    .join(", ");
}

const when = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

export async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getAdminDashboardStats(), getRecentLeads(10)]);

  const kpis = [
    { label: "Total enquiries", value: stats.totalLeads, badge: stats.readError ? "—" : "All briefs", gold: false },
    { label: "New unread leads", value: stats.newLeads, badge: "Needs reply", gold: true },
    { label: "QR entries this week", value: stats.qrEntriesThisWeek, badge: "Giveaway", gold: false },
    { label: "Live services", value: stats.activeServices, badge: "Published", gold: false },
  ];

  const launch = [
    { href: "/admin/website", title: "Edit homepage hero & photos", kicker: "Website CMS" },
    { href: "/admin/qr", title: "Manage /qr giveaway & form", kicker: "QR giveaway" },
    { href: "/admin/services/new", title: "Add new service station", kicker: "Services" },
    { href: "/admin/services", title: "Upload event gallery photos", kicker: "Services & media" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="font-royal text-[0.68rem] uppercase tracking-[0.28em] text-gold">Executive overview</p>
        <h1 className="mt-2 font-display text-5xl italic text-cream">Dashboard</h1>
      </div>

      {stats.readError ? (
        <p className="rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-gold-2">
          Could not load live KPIs. Confirm Supabase migrations for leads and services are applied.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`rounded-2xl border px-5 py-6 ${kpi.gold ? "border-gold/50 bg-gold/10" : "border-gold/25 bg-[#0D2117]/80"}`}
          >
            <p className="font-royal text-[0.6rem] uppercase tracking-[0.2em] text-gold">{kpi.label}</p>
            <p className={`mt-2 font-display text-4xl ${kpi.gold ? "text-gold-2" : "text-cream"}`}>{kpi.value}</p>
            <span className="mt-3 inline-block rounded-full border border-gold/30 px-2 py-0.5 text-[9px] uppercase tracking-wider text-mist">
              {kpi.badge}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="overflow-hidden rounded-2xl border border-gold/25 bg-[#0D2117]/60">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 px-4 py-4 sm:px-6">
            <div>
              <p className="font-royal text-[0.6rem] uppercase tracking-[0.2em] text-gold">Pipeline</p>
              <h2 className="font-display text-2xl italic text-cream">Recent enquiries</h2>
            </div>
            <Link href="/admin/leads" className="text-xs text-champagne underline underline-offset-2">
              View all leads ↗
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-emerald/30 font-royal text-[0.58rem] uppercase tracking-[0.16em] text-gold">
                <tr>
                  {["Client", "Event", "Stations", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.length ? (
                  recent.map((lead) => {
                    const wa = waLink(lead.phone);
                    return (
                      <tr key={lead.id} className="border-t border-gold/10 align-top">
                        <td className="px-4 py-4 text-cream">
                          <div>{lead.contact_name || "—"}</div>
                          <div className="text-mist">{lead.company}</div>
                        </td>
                        <td className="px-4 py-4 text-mist">
                          {lead.event_date ? when.format(new Date(lead.event_date)) : "—"}
                          {lead.city ? <span className="block text-xs">{lead.city}</span> : null}
                        </td>
                        <td className="px-4 py-4 text-champagne">{stationsLabel(lead.services)}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-full border border-gold/35 px-2.5 py-1 text-[10px] uppercase tracking-wider text-gold">
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {wa ? (
                            <a
                              href={wa}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-champagne hover:bg-white/5"
                            >
                              <MessageCircle className="h-3.5 w-3.5 text-gold" aria-hidden />
                              WhatsApp
                            </a>
                          ) : (
                            <span className="text-xs text-mist">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-mist">
                      No enquiries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-gold/25 bg-[#0D2117]/60 px-5 py-4">
            <p className="font-royal text-[0.6rem] uppercase tracking-[0.2em] text-gold">Quick launchpad</p>
            <h2 className="mt-1 font-display text-2xl italic text-cream">Studio actions</h2>
          </div>
          {launch.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex items-start gap-3 rounded-2xl border border-gold/20 bg-[#0D2117]/80 p-5 transition hover:border-gold/45 hover:bg-white/[0.03]"
            >
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-mist">{card.kicker}</p>
                <p className="mt-1 text-sm font-medium text-cream group-hover:text-champagne">{card.title}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}