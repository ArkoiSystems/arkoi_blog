"use client";

import { useEffect, useState } from "react";

import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";

const THEME_TOGGLE_VARIANTS = cva(
  "rounded border font-mono p-2 transition-all border-terminal-border bg-terminal-surface",
  {
    variants: {
      state: {
        loading: "text-terminal-text",
        active:
          "text-terminal-cyan hover:border-terminal-cyan hover:shadow-[0_0_10px] hover:shadow-terminal-cyan/40",
      },
    },
    defaultVariants: {
      state: "loading",
    },
  },
);

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  // This pattern is necessary to prevent hydration mismatch with next-themes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!mounted) {
    return (
      <button className={twMerge(THEME_TOGGLE_VARIANTS({ state: "loading" }))}>
        <span className="block h-5 w-5">💡</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={twMerge(THEME_TOGGLE_VARIANTS({ state: "active" }))}
    >
      {theme === "dark" ? (
        <span className="block h-5 w-5">☀</span>
      ) : (
        <span className="block h-5 w-5">🌙</span>
      )}
    </button>
  );
}
