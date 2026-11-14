import type { Metadata } from "next";
import { QrExperience } from "@/components/qr/QrExperience";
import { QR_SOFT_COPY_MESSAGE } from "@/lib/qr-constants";
import { getQrPageSettings, resolveQrWhatsAppDigits } from "@/lib/qr-page";

export const metadata: Metadata = {
  title: "Weekly Giveaway | Visriva QR",
  description:
    "Enter Visriva's weekly hamper giveaway after your live station visit. Tag @visriva.co, submit in 30 seconds, or request your soft copy on WhatsApp.",
  alternates: { canonical: "/qr" },
  robots: { index: true, follow: true },
};

export default async function QrPage() {
  const settings = await getQrPageSettings();
  const digits = resolveQrWhatsAppDigits(settings);
  const whatsappHref = `https://wa.me/${digits}?text=${encodeURIComponent(QR_SOFT_COPY_MESSAGE)}`;

  return <QrExperience settings={settings} whatsappDigits={digits} whatsappHref={whatsappHref} />;
}