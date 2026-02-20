import { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

export interface BadgeListProps {
  children: ReactNode;
  className?: string;
}

export function BadgeList({ children, className }: BadgeListProps) {
  return (
    <div className={twMerge("flex flex-wrap gap-1.5 sm:gap-2", className)}>
      {children}
    </div>
  );
}
