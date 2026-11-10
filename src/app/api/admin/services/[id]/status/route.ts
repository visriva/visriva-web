import { NextResponse } from "next/server";
import type { PublishStatus } from "@/lib/services-types";
import { requireAdmin } from "@/lib/require-admin";
import { setServicePublishStatus } from "@/lib/admin-service-mutate";

type Context = { params: Promise<{ id: string }> };

const allowed: PublishStatus[] = ["draft", "preview", "published", "archived"];

export async function POST(request: Request, context: Context) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const { id } = await context.params;

  const body = (await request.json().catch(() => null)) as { publish_status?: unknown } | null;
  const publish_status = String(body?.publish_status ?? "") as PublishStatus;
  if (!allowed.includes(publish_status)) {
    return NextResponse.json({ error: "Invalid publish status." }, { status: 400 });
  }

  const result = await setServicePublishStatus(id, publish_status);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ service: result.data });
}
