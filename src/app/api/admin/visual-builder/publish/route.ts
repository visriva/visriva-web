import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { publishVisualBuilderDraft } from "@/lib/visual-builder";
import { EMPTY_VISUAL_STATE, type VisualBuilderPageKey, type VisualBuilderState } from "@/lib/visual-builder-types";
import { requireAdmin } from "@/lib/require-admin";

const ALLOWED = new Set<VisualBuilderPageKey>(["home", "services", "qr", "reviews"]);

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;

  const body = (await request.json().catch(() => null)) as {
    pageKey?: string;
    state?: VisualBuilderState;
  } | null;

  const pageKey = body?.pageKey;
  if (!pageKey || !ALLOWED.has(pageKey as VisualBuilderPageKey)) {
    return NextResponse.json({ error: "Unknown page." }, { status: 400 });
  }

  const state = body?.state ?? EMPTY_VISUAL_STATE;

  try {
    await publishVisualBuilderDraft(pageKey as VisualBuilderPageKey, state);

    if (pageKey === "home") {
      revalidateTag("website-pages", "max");
      revalidateTag("website-page-home", "max");
      revalidateTag("site-globals", "max");
      revalidatePath("/");
    }
    if (pageKey === "qr") revalidatePath("/qr");
    if (pageKey === "reviews") revalidatePath("/reviews");
    if (pageKey === "services") {
      revalidatePath("/photo-booths");
      revalidatePath("/ai-merchandise");
      revalidatePath("/games-vr");
    }

    return NextResponse.json({ ok: true, pageKey });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Publish failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}