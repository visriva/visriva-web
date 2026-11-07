import { LuxuryInteractivePlatform } from "@/components/luxury/LuxuryInteractivePlatform";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Live engagement studio — compose your floor",
  "Interactive Visriva rate card, floor simulator, and instant WhatsApp quote for photo booths, AI merch, and VR across Bengaluru.",
  "/live",
);

export default function LivePlatformPage() {
  return (
    <div id="content" className="min-h-screen">
      <LuxuryInteractivePlatform />
    </div>
  );
}
