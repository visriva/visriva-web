export const WHATSAPP_GREETING =
  "Hello Visriva. I am planning a corporate event in Bengaluru and would like to discuss stations, timing, and a quote.";

export function whatsAppNumber() {
  return (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
}

export function whatsAppLink(text: string) {
  const number = whatsAppNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
