import type { Metadata } from "next";
import { QrExperience } from "@/components/qr/QrExperience";
import { formatPhoneDisplay, resolveQrWhatsAppFromContent } from "@/lib/qr-content-types";
import { getQrPageContent } from "@/lib/qr-content";
import { getQrPageSettings, resolveQrWhatsAppDigits } from "@/lib/qr-page";
import { whatsAppNumber } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getQrPageContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: { canonical: "/qr" },
    robots: { index: true, follow: true },
  };
}

export default async function QrPage() {
  const [content, settings] = await Promise.all([getQrPageContent(), getQrPageSettings()]);

  const fallbackDigits = resolveQrWhatsAppDigits(settings) || whatsAppNumber();
  const digits = resolveQrWhatsAppFromContent(content, fallbackDigits);
  const message = content.whatsapp.prefilled_message;
  const whatsappHref = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  const phoneDisplay = formatPhoneDisplay(digits, content.whatsapp.phone_display_hint);

  return <QrExperience content={content} settings={settings} whatsappHref={whatsappHref} phoneDisplay={phoneDisplay} />;
}