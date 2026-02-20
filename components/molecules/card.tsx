import { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={twMerge(
        "p-4 sm:p-6 bg-terminal-surface border border-terminal-border rounded hover:border-terminal-cyan hover:shadow-[0_0_15px] hover:shadow-terminal-cyan/30 transition-all",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={twMerge("space-y-2", className)}>{children}</div>;
}

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h2
      className={twMerge(
        "font-mono font-bold tracking-tight text-terminal-cyan text-xl sm:text-2xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p
      className={twMerge(
        "font-mono text-terminal-text text-sm sm:text-base",
        className,
      )}
    >
      {children}
    </p>
  );
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={twMerge(
        "flex flex-wrap items-center font-mono text-terminal-gray gap-2 sm:gap-4 text-xs sm:text-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
