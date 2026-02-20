import { ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const BADGE_VARIANTS = cva(
  "inline-block whitespace-nowrap rounded font-mono font-medium uppercase tracking-wider cursor-pointer transition-all bg-terminal-surface border hover:shadow-[0_0_8px]",
  {
    variants: {
      variant: {
        blue: "text-terminal-cyan border-terminal-cyan hover:shadow-terminal-cyan/40",
        gray: "text-terminal-gray border-terminal-gray hover:text-terminal-text hover:border-terminal-text",
        green:
          "text-terminal-green border-terminal-green hover:shadow-terminal-green/40",
        red: "text-terminal-red border-terminal-red hover:shadow-terminal-red/40",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 sm:px-3 py-1 text-xs sm:text-sm",
      },
    },
    defaultVariants: {
      variant: "blue",
      size: "md",
    },
  },
);

export interface BadgeProps extends VariantProps<typeof BADGE_VARIANTS> {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, variant, size, className }: BadgeProps) {
  return (
    <span className={twMerge(BADGE_VARIANTS({ variant, size }), className)}>
      {children}
    </span>
  );
}
