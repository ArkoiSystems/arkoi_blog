import { ElementType, ComponentPropsWithoutRef } from "react";

import { twMerge } from "tailwind-merge";

type TerminalPromptProps<T extends ElementType> = {
  command: string;
  className?: string;
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function TerminalPrompt<T extends ElementType = "p">({
  command,
  className,
  as,
  ...props
}: TerminalPromptProps<T>) {
  const Component = as || "p";

  return (
    <Component className={twMerge("font-mono", className)} {...props}>
      <span className="text-terminal-prompt">$</span> {command}
    </Component>
  );
}
