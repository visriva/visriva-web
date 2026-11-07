import { BookingProvider } from "@/components/booking/BookingContext";
import { BookingTray } from "@/components/booking/BookingTray";
import { LuxuryInteractivePlatform } from "@/components/luxury/LuxuryInteractivePlatform";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Visriva Live Station — corporate event stations Bengaluru",
  "Compose photo booths, AI merch, VR, and games on one floor. Transparent rates, live floor simulator, and instant WhatsApp quotes across Bengaluru.",
  "/",
);

export default function HomePage() {
  return (
    <BookingProvider>
      <div className="min-h-screen pb-24">
        <LuxuryInteractivePlatform />
      </div>
      <BookingTray />
    </BookingProvider>
  );
}
