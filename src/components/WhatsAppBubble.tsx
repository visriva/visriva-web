import { WHATSAPP_GREETING, whatsAppLink } from "@/lib/whatsapp";

export function WhatsAppBubble() {
  const href = whatsAppLink(WHATSAPP_GREETING);

  return (
  <a
    href={href ?? "/quote"}
    target={href ? "_blank" : undefined}
    rel={href ? "noreferrer" : undefined}
    className="whatsapp-bubble group fixed bottom-5 right-4 z-40 flex items-center justify-center rounded-full border-2 border-[#C9A227] bg-[#07291E] text-[#E5C158] shadow-2xl transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(201,162,39,.35)] md:bottom-6 md:right-6 md:gap-3 md:rounded-full md:border md:border-[#CBDCC7] md:bg-[#F8F7EF]/95 md:px-4 md:py-3 md:text-[#244936]"
    aria-label="WhatsApp Visriva"
  >
    <span className="relative grid h-[3.25rem] w-[3.25rem] place-items-center md:h-9 md:w-9 md:rounded-full md:bg-[#DCE9D8]">
      <span className="absolute inset-0 animate-ping rounded-full border border-[#C9A227]/40 opacity-40 md:hidden" aria-hidden />
      <WhatsAppGlyph className="h-6 w-6 fill-current md:h-4 md:w-4 md:text-[#947D34]" />
    </span>
    <span className="hidden text-left md:block">
      <span className="block text-[.58rem] font-semibold uppercase tracking-[.18em] text-[#947D34]">Talk to the team</span>
      <span className="block text-sm font-medium text-[#244936]">WhatsApp</span>
    </span>
  </a>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Zm5.76 14.02c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.2-1.16-1.54-1.16-2.94 0-1.4.73-2.08 1-2.36.24-.26.64-.38.86-.38.22 0 .42.01.6.02.2.01.45-.06.7.54.26.62.88 2.14.96 2.3.08.16.12.34.02.54-.1.2-.16.34-.3.52-.14.18-.3.4-.12.58.16.28.72 1.18 1.54 1.92 1.06.94 1.96 1.24 2.24 1.38.28.14.44.12.6-.08.16-.2.7-.82.88-1.1.18-.28.38-.22.64-.14.26.08 1.64.78 1.92.92.28.14.46.2.52.32.08.12.08.68-.16 1.36Z" />
    </svg>
  );
}