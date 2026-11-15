import { NextResponse } from "next/server";
import { getVisualBuilderPublished } from "@/lib/visual-builder";
import { EMPTY_VISUAL_STATE, type VisualBuilderPageKey } from "@/lib/visual-builder-types";

const ALLOWED = new Set<VisualBuilderPageKey>(["home", "services", "qr", "reviews"]);

export async function GET(request: Request) {
  const page = new URL(request.url).searchParams.get("page");
  if (!page || !ALLOWED.has(page as VisualBuilderPageKey)) {
    return NextResponse.json({ state: EMPTY_VISUAL_STATE });
  }
  try {
    const state = await getVisualBuilderPublished(page as VisualBuilderPageKey);
    return NextResponse.json({ pageKey: page, state }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } });
  } catch {
    return NextResponse.json({ state: EMPTY_VISUAL_STATE });
  }
}