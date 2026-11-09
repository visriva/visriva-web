import "server-only";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

export async function requireAdmin() {
  if (!(await isAdmin())) {
    return { response: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }
  return { response: null as null };
}
