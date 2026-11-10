import { NextResponse } from "next/server";
import { getPublishedServices } from "@/lib/services-catalog";

export async function GET() {
  const services = await getPublishedServices();
  return NextResponse.json(
    { services },
    {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    },
  );
}
