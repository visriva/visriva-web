import "server-only";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "visriva_session";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !input) return false;
  return timingSafeEqual(digest(input), digest(expected));
}

export function sessionToken() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!password || !secret) return null;
  return createHmac("sha256", secret).update(`visriva:${password}`).digest("hex");
}

export async function isAdmin() {
  const token = sessionToken();
  if (!token) return false;
  const jar = await cookies();
  const got = jar.get(ADMIN_COOKIE)?.value;
  if (!got || got.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(token));
}
