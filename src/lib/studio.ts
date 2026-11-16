import "server-only";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase-admin";
import { EMPTY_STUDIO_PAGE_STATE, type StudioPageKey, type StudioPageState } from "@/lib/studio-types";

function parseState(raw: unknown): StudioPageState {
  if (!raw || typeof raw !== "object") return { ...EMPTY_STUDIO_PAGE_STATE };
  const o = raw as Record<string, unknown>;
  return {
    overrides: typeof o.overrides === "object" && o.overrides ? (o.overrides as StudioPageState["overrides"]) : {},
    sectionOrder: Array.isArray(o.sectionOrder) ? (o.sectionOrder as string[]) : [],
    trash: Array.isArray(o.trash) ? (o.trash as StudioPageState["trash"]) : [],
    insertedBlocks: Array.isArray(o.insertedBlocks) ? (o.insertedBlocks as StudioPageState["insertedBlocks"]) : [],
    snapshots: Array.isArray(o.snapshots) ? (o.snapshots as StudioPageState["snapshots"]) : [],
  };
}

export async function getStudioDraft(pageKey: StudioPageKey): Promise<StudioPageState> {
  await connection();
  const supabase = createAdminClient();
  if (!supabase) return { ...EMPTY_STUDIO_PAGE_STATE };
  const { data } = await supabase.from("site_studio_state").select("draft_state").eq("page_key", pageKey).maybeSingle();
  return parseState(data?.draft_state);
}

export async function getStudioPublished(pageKey: StudioPageKey): Promise<StudioPageState> {
  await connection();
  const supabase = createAdminClient();
  if (!supabase) return { ...EMPTY_STUDIO_PAGE_STATE };
  const { data } = await supabase.from("site_studio_state").select("published_state").eq("page_key", pageKey).maybeSingle();
  return parseState(data?.published_state);
}

export async function saveStudioDraft(pageKey: StudioPageKey, state: StudioPageState) {
  await connection();
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase
    .from("site_studio_state")
    .upsert({ page_key: pageKey, draft_state: state, updated_at: new Date().toISOString() }, { onConflict: "page_key" });
  if (error) throw new Error(error.message);
}

export async function publishStudioState(pageKey: StudioPageKey, state: StudioPageState) {
  await connection();
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase
    .from("site_studio_state")
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

  if (pageKey === "home") revalidatePath("/");
  if (pageKey === "qr") revalidatePath("/qr");
  if (pageKey === "reviews") revalidatePath("/reviews");
  if (pageKey === "services") {
    revalidatePath("/photo-booths");
    revalidatePath("/services/photo-booth");
    revalidatePath("/ai-merchandise");
    revalidatePath("/games-vr");
    revalidatePath("/services/magnet-station");
    revalidatePath("/services/tote-tshirt-station");
    revalidatePath("/services/mug-printing");
    revalidatePath("/services/keychain-station");
  }
}