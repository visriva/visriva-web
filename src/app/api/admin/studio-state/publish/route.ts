import { NextResponse } from "next/server";
import { publishStudioState } from "@/lib/studio";
import { EMPTY_STUDIO_PAGE_STATE, type StudioPageKey, type StudioPageState } from "@/lib/studio-types";
import { requireAdmin } from "@/lib/require-admin";

const ALLOWED = new Set<StudioPageKey>(["home", "services", "qr", "reviews"]);

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const body = (await request.json().catch(() => null)) as { pageKey?: string; state?: StudioPageState } | null;
  const pageKey = body?.pageKey;
  if (!pageKey || !ALLOWED.has(pageKey as StudioPageKey)) {
    return NextResponse.json({ error: "Unknown page." }, { status: 400 });
  }
  const state = body?.state ?? EMPTY_STUDIO_PAGE_STATE;
  try {
    await publishStudioState(pageKey as StudioPageKey, state);
    return NextResponse.json({ ok: true, pageKey });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Publish failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}