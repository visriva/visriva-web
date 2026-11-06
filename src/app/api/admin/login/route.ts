import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, passwordMatches, sessionToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Unreadable request." }, { status: 400 });
  }

  const token = sessionToken();
  if (!token || !passwordMatches(password)) {
    return NextResponse.json({ error: "That password does not match." }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 12,
  });

  return NextResponse.json({ ok: true });
}
