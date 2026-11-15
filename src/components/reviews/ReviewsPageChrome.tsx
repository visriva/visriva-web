"use client";

import { BackTrigger } from "@/components/framer-ui";

/** Page chrome only — no second navbar (global `Navbar` lives in root layout). */
export function ReviewsPageChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto max-w-[1100px] px-4 pt-4">
        <BackTrigger />
      </div>
      {children}
    </>
  );
}