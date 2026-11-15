import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Pro Visual Studio", robots: { index: false, follow: false } };

/** Launches the full-screen public studio shell (admin session required on target URL). */
export default function AdminStudioLauncherPage() {
  redirect("/?studio=true");
}