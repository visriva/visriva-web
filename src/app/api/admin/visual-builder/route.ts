import { NextResponse } from "next/server";
import { getVisualBuilderDraft, saveVisualBuilderDraft } from "@/lib/visual-builder";
import { EMPTY_VISUAL_STATE, type VisualBuilderPageKey, type VisualBuilderState } from "@/lib/visual-builder-types";
import { requireAdmin } from "@/lib/require-admin";

const ALLOWED = new Set<VisualBuilderPageKey>(["home", "services", "qr", "reviews"]);

function parseKey(raw: string | null): VisualBuilderPageKey | null {
  if (!raw || !ALLOWED.has(raw as VisualBuilderPageKey)) return null;
  return raw as VisualBuilderPageKey;
}

export async function GET(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const pageKey = parseKey(new URL(request.url).searchParams.get("page"));
  if (!pageKey) return NextResponse.json({ error: "Unknown page." }, { status: 400 });

  const state = await getVisualBuilderDraft(pageKey);
  return NextResponse.json({ pageKey, state });
}

export async function PATCH(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = (await request.json().catch(() => null)) as {
    pageKey?: string;
    state?: VisualBuilderState;
  } | null;

  const pageKey = parseKey(body?.pageKey ?? null);
  if (!pageKey) return NextResponse.json({ error: "Unknown page." }, { status: 400 });

  const state = body?.state ?? EMPTY_VISUAL_STATE;
  try {
    await saveVisualBuilderDraft(pageKey, state);
    return NextResponse.json({ ok: true, pageKey, state });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}