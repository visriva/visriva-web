"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** centered dialog vs scrollable full-page sheet */
  layout?: "center" | "scroll";
  maxWidthClass?: string;
  ariaLabelledBy?: string;
};

export function QrLuxuryModal({
  open,
  onClose,
  children,
  layout = "center",
  maxWidthClass = "max-w-lg",
  ariaLabelledBy,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const shell =
    layout === "scroll" ? (
      <div className="fixed inset-0 z-[9999] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby={ariaLabelledBy}>
        <div className="fixed inset-0 z-10 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} aria-hidden />
        <div className="relative z-20 flex min-h-full justify-center p-4 pb-16 pt-14 sm:p-6 sm:pt-16">
          <div
            className={`qr-modal-panel w-full ${maxWidthClass} rounded-3xl border-2 border-[#C9A227] bg-[#07291E] p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:p-8`}
          >
            <ModalClose onClose={onClose} />
            {children}
          </div>
        </div>
      </div>
    ) : (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby={ariaLabelledBy}>
        <div className="fixed inset-0 z-10 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} aria-hidden />
        <div
          className={`qr-modal-panel relative z-20 max-h-[min(90svh,920px)] w-full ${maxWidthClass} overflow-y-auto rounded-3xl border-2 border-[#C9A227] bg-[#07291E] p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:p-8`}
        >
          <ModalClose onClose={onClose} />
          {children}
        </div>
      </div>
    );

  return createPortal(shell, document.body);
}

function ModalClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-white/80 transition hover:bg-white/20 hover:text-white"
      aria-label="Close"
    >
      <X className="h-4 w-4" aria-hidden />
    </button>
  );
}