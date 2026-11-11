import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase-admin";

const allowed = new Set(["home", "photo-booths", "ai-merchandise", "games-vr", "about", "gallery", "rate-card", "client-requirements", "quote"]);
const fields = ["name", "status", "eyebrow", "hero_title", "hero_accent", "hero_description", "hero_image", "hero_alt", "intro_title", "intro_copy", "closing_title", "closing_copy", "seo_title", "seo_description", "og_image"] as const;

export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { data, error } = await supabase.from("website_pages").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pages: data });
}

export async function PATCH(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const slug = String(body?.slug ?? "");
  if (!allowed.has(slug)) return NextResponse.json({ error: "Unknown page." }, { status: 400 });
  if (body?.status !== "draft" && body?.status !== "published") {
    return NextResponse.json({ error: "Invalid publishing status." }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim().slice(0, 100);
  if (!name) return NextResponse.json({ error: "Page name is required." }, { status: 400 });

  const row: Record<string, unknown> = {
    slug,
    name,
    status: body.status,
    updated_at: new Date().toISOString(),
  };

  for (const field of fields) {
    if (field === "name" || field === "status") continue;
    row[field] = String(body?.[field] ?? "").trim().slice(
      0,
      field === "seo_description" || field === "hero_description" || field === "intro_copy" || field === "closing_copy" ? 2000 : 5000,
    );
  }

  if (body.status === "published") row.published_at = new Date().toISOString();

  const supabase = createAdminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const { data, error } = await supabase.from("website_pages").upsert(row, { onConflict: "slug" }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const path = slug === "home" ? "/" : `/${slug}`;
  revalidateTag("website-pages", "max");
  revalidateTag(`website-page-${slug}`, "max");
  revalidatePath(path);
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ page: data });
}
