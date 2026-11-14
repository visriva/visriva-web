"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const PANEL_BASE =
  "qr-modal-panel rounded-3xl border-2 border-[#C9A227] bg-[#07291E] p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.85)] sm:p-8";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const shell = (
    <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true" aria-labelledby={ariaLabelledBy}>
      <button
        type="button"
        className="fixed inset-0 z-10 cursor-default bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-label="Close dialog"
      />

      {layout === "scroll" ? (
        <div className="pointer-events-none fixed inset-0 z-20 overflow-y-auto">
          <div className="pointer-events-auto flex min-h-full justify-center p-4 pb-16 pt-14 sm:p-6 sm:pt-16">
            <div
              className={`${PANEL_BASE} relative w-full ${maxWidthClass}`}
              onClick={(e) => e.stopPropagation()}
              role="document"
            >
              <ModalClose onClose={onClose} />
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center p-4 sm:p-6">
          <div
            className={`${PANEL_BASE} pointer-events-auto relative max-h-[min(90svh,920px)] w-full ${maxWidthClass} overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <ModalClose onClose={onClose} />
            {children}
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(shell, document.body);
}

function ModalClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
      aria-label="Close"
    >
      <X className="h-4 w-4" aria-hidden />
    </button>
  );
}