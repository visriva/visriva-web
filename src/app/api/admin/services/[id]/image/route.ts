import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { uploadServiceImage } from "@/lib/admin-service-mutate";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Context) {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  const { id } = await context.params;

  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  }

  const result = await uploadServiceImage(id, file);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ image_path: result.image_path });
}
