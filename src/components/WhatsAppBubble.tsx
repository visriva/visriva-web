import { WHATSAPP_GREETING, whatsAppLink } from "@/lib/whatsapp";

export function WhatsAppBubble() {
  const href = whatsAppLink(WHATSAPP_GREETING);

  return (
    <a
      href={href ?? "/quote"}
      target={href ? "_blank" : undefined}
      rel={href ? "noreferrer" : undefined}
      className="whatsapp-bubble fixed bottom-5 right-4 z-[78] flex items-center gap-3 border border-gold/50 bg-emerald/95 px-4 py-3 text-cream shadow-2xl backdrop-blur-md transition hover:border-gold hover:bg-emerald sm:bottom-8 sm:right-8"
      aria-label="WhatsApp Visriva"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/60 text-gold">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Zm5.76 14.02c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.2-1.16-1.54-1.16-2.94 0-1.4.73-2.08 1-2.36.24-.26.64-.38.86-.38.22 0 .42.01.6.02.2.01.45-.06.7.54.26.62.88 2.14.96 2.3.08.16.12.34.02.54-.1.2-.16.34-.3.52-.14.18-.3.4-.42.54-.14.14-.28.3-.12.58.16.28.72 1.18 1.54 1.92 1.06.94 1.96 1.24 2.24 1.38.28.14.44.12.6-.08.16-.2.7-.82.88-1.1.18-.28.38-.22.64-.14.26.08 1.64.78 1.92.92.28.14.46.2.52.32.08.12.08.68-.16 1.36Z" />
        </svg>
      </span>
      <span>
        <span className="block font-royal text-[0.58rem] uppercase tracking-[0.22em] text-gold">
          Studio
        </span>
        <span className="block text-sm">WhatsApp</span>
      </span>
    </a>
  );
}
