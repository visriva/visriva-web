import { NextResponse } from "next/server";
import { getStudioPublished } from "@/lib/studio";
import type { StudioPageKey } from "@/lib/studio-types";
import { EMPTY_STUDIO_PAGE_STATE } from "@/lib/studio-types";

const ALLOWED = new Set<StudioPageKey>(["home", "services", "qr", "reviews"]);

export async function GET(request: Request) {
  const page = new URL(request.url).searchParams.get("page");
  if (!page || !ALLOWED.has(page as StudioPageKey)) {
    return NextResponse.json({ state: EMPTY_STUDIO_PAGE_STATE }, { headers: { "Cache-Control": "public, s-maxage=30" } });
  }
  try {
    const state = await getStudioPublished(page as StudioPageKey);
    return NextResponse.json({ pageKey: page, state }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } });
  } catch {
    return NextResponse.json({ state: EMPTY_STUDIO_PAGE_STATE });
  }
}