import { ReactNode } from "react";
import Link from "next/link";

import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const BUTTON_VARIANTS = cva(
  "rounded font-mono font-medium inline-block uppercase tracking-wider transition-all",
  {
    variants: {
      variant: {
        primary:
          "bg-terminal-surface hover:bg-terminal-border text-terminal-cyan border border-terminal-cyan hover:shadow-[0_0_10px_currentColor] hover:shadow-terminal-cyan/50",
        secondary:
          "bg-terminal-bg hover:bg-terminal-surface text-terminal-green border border-terminal-green hover:shadow-[0_0_10px_currentColor] hover:shadow-terminal-green/50",
        ghost:
          "bg-transparent hover:bg-terminal-surface text-terminal-text border border-terminal-border hover:border-terminal-cyan",
      },
      size: {
        sm: "px-3 py-1.5 text-xs sm:text-sm",
        md: "px-4 py-2 text-sm sm:text-base",
        lg: "px-6 py-3 text-base sm:text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
);

export interface ButtonProps extends VariantProps<typeof BUTTON_VARIANTS> {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export function Button({
  children,
  href,
  variant,
  size,
  className,
  onClick,
  target,
  rel,
}: ButtonProps) {
  const allClasses = twMerge(BUTTON_VARIANTS({ variant, size }), className);

  if (href) {
    if (href.startsWith("http") || href.startsWith("mailto:")) {
      return (
        <a href={href} target={target} rel={rel} className={allClasses}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={allClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={allClasses}>
      {children}
    </button>
  );
}
