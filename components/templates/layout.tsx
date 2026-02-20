import { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const CONTAINER_VARIANTS = cva("mx-auto px-4 py-6 sm:py-8", {
  variants: {
    width: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-7xl",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    width: "full",
  },
});

type ContainerProps<T extends ElementType> = {
  children: ReactNode;
  className?: string;
  as?: T;
} & VariantProps<typeof CONTAINER_VARIANTS> &
  Omit<ComponentPropsWithoutRef<T>, "as">;

export function Container<T extends ElementType = "div">({
  children,
  width,
  className,
  as,
  ...props
}: ContainerProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={twMerge(CONTAINER_VARIANTS({ width }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

const STACK_VARIANTS = cva("", {
  variants: {
    spacing: {
      sm: "space-y-2 sm:space-y-3",
      md: "space-y-4 sm:space-y-6",
      lg: "space-y-6 sm:space-y-8",
    },
  },
  defaultVariants: {
    spacing: "sm",
  },
});

export interface StackProps extends VariantProps<typeof STACK_VARIANTS> {
  children: ReactNode;
  className?: string;
}

export function Stack({ children, spacing, className }: StackProps) {
  return (
    <div className={twMerge(STACK_VARIANTS({ spacing }), className)}>
      {children}
    </div>
  );
}
