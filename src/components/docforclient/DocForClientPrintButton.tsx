"use client";

export function DocForClientPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="qr-gold-btn inline-flex min-h-11 items-center rounded-full px-8 py-3 text-xs font-bold uppercase tracking-[0.14em]"
    >
      Print handout
    </button>
  );
}