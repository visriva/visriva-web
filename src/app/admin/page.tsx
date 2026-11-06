import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminScreen } from "@/components/AdminScreen";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-[70svh]" />}>
      <AdminScreen />
    </Suspense>
  );
}
