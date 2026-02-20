"use client";

import { useEffect, useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme } from "next-themes";

export interface CodeBlockProps {
  language: string;
  children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // This pattern is necessary to prevent hydration mismatch with next-themes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Prevent hydration mismatch from next-themes
  if (!mounted) {
    return (
      <div className="my-4 rounded border border-terminal-border bg-terminal-surface p-4 font-mono text-sm">
        {children}
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="
        group my-4 overflow-hidden rounded
        bg-terminal-surface
        border border-terminal-border
        transition-all
        hover:border-terminal-cyan
        hover:shadow-[0_0_15px_rgba(0,255,255,0.25)]
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-terminal-border bg-terminal-bg px-4 py-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-terminal-gray">
          {language === "text" ? "plaintext" : language}
        </span>

        <button
          onClick={handleCopy}
          className="
            rounded border border-terminal-border
            bg-terminal-surface
            px-2.5 py-1
            font-mono text-xs text-terminal-text
            transition-all duration-200
            hover:border-terminal-cyan hover:text-terminal-cyan
            focus-visible:border-terminal-cyan
            focus-visible:outline-none
            active:scale-95
          "
          aria-label="Copy code"
        >
          {copied ? (
            <span className="text-terminal-green">✓ Copied</span>
          ) : (
            "Copy"
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto rounded">
        <SyntaxHighlighter
          language={language}
          style={isDark ? vscDarkPlus : vs}
          PreTag="pre" // restores default monospace behavior
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.7",
            overflowX: "auto", // ensures horizontal scrolling
          }}
          codeTagProps={{
            style: {
              fontFamily: "JetBrains Mono, monospace",
              color:
                language === "text" ? "var(--color-terminal-text)" : undefined,
            },
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
