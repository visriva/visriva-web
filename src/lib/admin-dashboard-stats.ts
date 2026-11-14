import "server-only";
import { createAdminClient } from "@/lib/supabase-admin";

export type AdminDashboardStats = {
  totalLeads: number;
  newLeads: number;
  qrEntriesThisWeek: number;
  activeServices: number;
  supabaseLive: boolean;
  readError: boolean;
};

export type RecentLeadRow = {
  id: string;
  created_at: string;
  status: string;
  contact_name: string | null;
  company: string | null;
  phone: string | null;
  city: string | null;
  event_date: string | null;
  services: { name?: string; quantity?: number }[] | null;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = createAdminClient();
  if (!supabase) {
    return { totalLeads: 0, newLeads: 0, qrEntriesThisWeek: 0, activeServices: 0, supabaseLive: false, readError: true };
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [totalRes, newRes, qrRes, servicesRes] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("qr_giveaway_entries").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("services").select("*", { count: "exact", head: true }).eq("publish_status", "published"),
  ]);

  const readError = Boolean(totalRes.error || newRes.error);

  return {
    totalLeads: totalRes.count ?? 0,
    newLeads: newRes.count ?? 0,
    qrEntriesThisWeek: qrRes.count ?? 0,
    activeServices: servicesRes.count ?? 0,
    supabaseLive: true,
    readError,
  };
}

export async function getRecentLeads(limit = 8): Promise<RecentLeadRow[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("leads")
    .select("id, created_at, status, contact_name, company, phone, city, event_date, services")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as RecentLeadRow[];
}