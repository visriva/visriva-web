import { NextResponse } from "next/server";
import { getStudioDraft, saveStudioDraft } from "@/lib/studio";
import { EMPTY_STUDIO_PAGE_STATE, type StudioPageKey, type StudioPageState } from "@/lib/studio-types";
import { requireAdmin } from "@/lib/require-admin";

const ALLOWED = new Set<StudioPageKey>(["home", "services", "qr", "reviews"]);

function parseKey(raw: string | null): StudioPageKey | null {
  if (!raw || !ALLOWED.has(raw as StudioPageKey)) return null;
  return raw as StudioPageKey;
}

export async function GET(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const pageKey = parseKey(new URL(request.url).searchParams.get("page"));
  if (!pageKey) return NextResponse.json({ error: "Unknown page." }, { status: 400 });
  const state = await getStudioDraft(pageKey);
  return NextResponse.json({ pageKey, state });
}

export async function PATCH(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const body = (await request.json().catch(() => null)) as { pageKey?: string; state?: StudioPageState } | null;
  const pageKey = parseKey(body?.pageKey ?? null);
  if (!pageKey) return NextResponse.json({ error: "Unknown page." }, { status: 400 });
  const state = body?.state ?? EMPTY_STUDIO_PAGE_STATE;
  try {
    await saveStudioDraft(pageKey, state);
    return NextResponse.json({ ok: true, pageKey, state });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}