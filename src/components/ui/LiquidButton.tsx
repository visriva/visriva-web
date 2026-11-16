"use client";

import Link from "next/link";
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LiquidButtonLabel } from "@/components/ui/LiquidButtonLabel";
import { cn } from "@/lib/utils";

type CommonProps = {
  className?: string;
  children: ReactNode;
  /** `gradient` = site `.liquid-button` gold gradient; `solid` = flat gold pill; `dark` = #041A13 + gold hover fill */
  variant?: "gradient" | "solid" | "dark";
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    external?: boolean;
  };

export type LiquidButtonProps = ButtonProps | LinkProps;

const variantClass: Record<NonNullable<CommonProps["variant"]>, string> = {
  gradient:
    "liquid-button group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-[0.14em]",
  solid:
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#D4AF37] px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#041A13] transition-colors hover:bg-[#e8c96a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]",
  dark:
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-[#D4AF37]/40 bg-[#041A13] px-8 py-4 font-medium tracking-wide text-white shadow-lg transition-all duration-300 hover:border-[#D4AF37]",
};

function DarkFill() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 z-0 -translate-y-full bg-[#D4AF37] transition-transform duration-300 ease-in-out group-hover:translate-y-0"
    />
  );
}

export const LiquidButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, LiquidButtonProps>(
  function LiquidButton(props, ref) {
    const { className, children, variant = "gradient", ...rest } = props;
    const base = variantClass[variant];

    const content = (
      <>
        {variant === "dark" ? <DarkFill /> : null}
        <span className={variant === "dark" ? "relative z-10" : undefined}>
          <LiquidButtonLabel>{children}</LiquidButtonLabel>
        </span>
      </>
    );

    if ("href" in props && props.href) {
      const { href, external } = props;
      if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(base, className)}
            {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {content}
          </a>
        );
      }

      return (
        <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cn(base, className)} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {content}
        </Link>
      );
    }

    const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={buttonProps.type ?? "button"}
        className={cn(base, className)}
        {...buttonProps}
      >
        {content}
      </button>
    );
  },
);

LiquidButton.displayName = "LiquidButton";