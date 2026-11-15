import "server-only";
import { connection } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { mergeSiteGlobals, type SiteGlobals } from "@/lib/site-globals-types";
import { EMPTY_VISUAL_STATE, type VisualBuilderPageKey, type VisualBuilderState } from "@/lib/visual-builder-types";

function parseState(raw: unknown): VisualBuilderState {
  if (!raw || typeof raw !== "object") return { ...EMPTY_VISUAL_STATE };
  const o = raw as Record<string, unknown>;
  return {
    texts: typeof o.texts === "object" && o.texts ? (o.texts as Record<string, string>) : {},
    images: typeof o.images === "object" && o.images ? (o.images as VisualBuilderState["images"]) : {},
    home_layout: (o.home_layout as VisualBuilderState["home_layout"]) ?? null,
  };
}

export async function getVisualBuilderDraft(pageKey: VisualBuilderPageKey): Promise<VisualBuilderState> {
  await connection();
  const supabase = createAdminClient();
  if (!supabase) return { ...EMPTY_VISUAL_STATE };
  const { data } = await supabase.from("site_visual_builder").select("draft_state").eq("page_key", pageKey).maybeSingle();
  return parseState(data?.draft_state);
}

export async function saveVisualBuilderDraft(pageKey: VisualBuilderPageKey, state: VisualBuilderState) {
  await connection();
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase
    .from("site_visual_builder")
    .upsert({ page_key: pageKey, draft_state: state, updated_at: new Date().toISOString() }, { onConflict: "page_key" });
  if (error) throw new Error(error.message);
}

export async function publishVisualBuilderDraft(pageKey: VisualBuilderPageKey, state: VisualBuilderState) {
  await connection();
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  if (pageKey === "home") {
    const slug = "home";
    const row: Record<string, unknown> = {
      slug,
      name: "Home",
      status: "published",
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    };
    const fieldMap = [
      "eyebrow",
      "hero_title",
      "hero_accent",
      "hero_description",
      "hero_image",
      "hero_alt",
    ] as const;
    for (const field of fieldMap) {
      const fromText = state.texts[field];
      const fromImage = field === "hero_image" ? state.images.hero_image?.url : undefined;
      if (fromText) row[field] = fromText;
      if (fromImage) row[field] = fromImage;
      if (field === "hero_alt" && state.images.hero_image?.alt) row.hero_alt = state.images.hero_image.alt;
    }
    const { error: pageErr } = await supabase.from("website_pages").upsert(row, { onConflict: "slug" });
    if (pageErr) throw new Error(pageErr.message);

    if (state.home_layout) {
      const { data: globalsRow } = await supabase.from("site_globals").select("content").eq("id", "main").maybeSingle();
      const merged = mergeSiteGlobals(globalsRow?.content);
      const next: SiteGlobals = { ...merged, home_layout: state.home_layout };
      const { error: gErr } = await supabase
        .from("site_globals")
        .upsert({ id: "main", content: next, updated_at: new Date().toISOString() }, { onConflict: "id" });
      if (gErr) throw new Error(gErr.message);
    }
  }

  const { error } = await supabase
    .from("site_visual_builder")
    .upsert(
      {
        page_key: pageKey,
        draft_state: state,
        published_state: state,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "page_key" },
    );
  if (error) throw new Error(error.message);
}