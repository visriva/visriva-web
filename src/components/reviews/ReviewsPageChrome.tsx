"use client";

import { BackTrigger, ModernNavbar } from "@/components/framer-ui";

export function ReviewsPageChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ModernNavbar
        title="Client reviews"
        items={[
          { href: "/", label: "Home" },
          { href: "/qr", label: "Event photos" },
          { href: "/quote", label: "Quote" },
        ]}
      />
      <div className="mx-auto max-w-[1100px] px-4 pt-4">
        <BackTrigger />
      </div>
      {children}
    </>
  );
}