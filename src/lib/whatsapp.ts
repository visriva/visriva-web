export const WHATSAPP_GREETING =
  "Hello Visriva. I am planning a corporate event in Bengaluru and would like to discuss stations, timing, and a quote.";

/** Studio WhatsApp (digits only); env wins in production */
const DEFAULT_WHATSAPP_DIGITS = "918884484828";

export function whatsAppNumber() {
  const fromEnv = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
    /\D/g,
    "",
  );
  return fromEnv || DEFAULT_WHATSAPP_DIGITS;
}

export function whatsAppLink(text: string) {
  const number = whatsAppNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
