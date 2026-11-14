const PREFIX = "visriva_admin_draft_";

export function stashAdminDraft(key: string, data: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify({ savedAt: new Date().toISOString(), data }));
  } catch {
    /* ignore quota */
  }
}

export function readAdminDraft<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data?: T };
    return parsed?.data ?? null;
  } catch {
    return null;
  }
}

export function clearAdminDraft(key: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${PREFIX}${key}`);
  } catch {
    /* ignore */
  }
}