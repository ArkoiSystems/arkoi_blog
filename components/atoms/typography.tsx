import { ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export interface HeadingProps {
  children: ReactNode;
  className?: string;
}

export function H1({ children, className }: HeadingProps) {
  return (
    <h1
      className={twMerge(
        "font-mono font-bold tracking-tight text-terminal-green text-3xl sm:text-4xl lg:text-5xl",
        className,
      )}
    >
      <span className="text-terminal-prompt">&gt;</span> {children}
    </h1>
  );
}

export function H2({ children, className }: HeadingProps) {
  return (
    <h2
      className={twMerge(
        "font-mono font-bold tracking-tight text-terminal-cyan text-2xl sm:text-3xl lg:text-4xl",
        className,
      )}
    >
      <span className="text-terminal-prompt">&gt;&gt;</span> {children}
    </h2>
  );
}

export function H3({ children, className }: HeadingProps) {
  return (
    <h3
      className={twMerge(
        "font-mono font-bold tracking-tight text-terminal-yellow text-xl sm:text-2xl lg:text-3xl",
        className,
      )}
    >
      <span className="text-terminal-prompt">&gt;&gt;&gt;</span> {children}
    </h3>
  );
}

const TEXT_VARIANTS = cva("font-mono text-terminal-text", {
  variants: {
    size: {
      base: "text-base sm:text-lg",
      sm: "text-sm sm:text-base",
      lg: "text-lg sm:text-xl",
      xl: "text-xl sm:text-2xl",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

export interface TextProps extends VariantProps<typeof TEXT_VARIANTS> {
  children: ReactNode;
  className?: string;
}

export function Text({ children, className, size }: TextProps) {
  return (
    <p className={twMerge(TEXT_VARIANTS({ size }), className)}>{children}</p>
  );
}
