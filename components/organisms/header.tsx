"use client";

import { useState } from "react";
import Link from "next/link";

import { TerminalPrompt, ThemeToggle } from "@/components";

const NAV_ITEMS = [
  { href: "/", label: "ls -la /" },
  { href: "/tags", label: "grep tags" },
  { href: "/about", label: "cat about" },
  { href: "/rss.xml", label: "cat rss.xml" },
] as const;

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

function NavLink({ href, label, onClick, className = "" }: NavLinkProps) {
  return (
    <TerminalPrompt
      as={Link}
      href={href}
      className={`font-mono text-terminal-text transition-colors hover:text-terminal-cyan ${className}`}
      onClick={onClick}
      command={label}
    />
  );
}

interface MenuIconProps {
  isOpen: boolean;
}

function MenuIcon({ isOpen }: MenuIconProps) {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {isOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <header className="border-b border-terminal-border bg-terminal-bg">
      <nav className="mx-auto flex items-center justify-between px-4 py-3 sm:py-4">
        <TerminalPrompt
          as={Link}
          href="/"
          command="./arkoisystems"
          className="font-mono text-lg font-bold text-terminal-green transition-colors hover:text-terminal-cyan sm:text-xl"
        />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 sm:gap-4 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              className="text-sm sm:text-base"
            />
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="rounded border border-terminal-border bg-terminal-surface p-2 text-terminal-cyan transition-colors hover:border-terminal-cyan"
            aria-label="Toggle menu"
          >
            <MenuIcon isOpen={mobileMenuOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-terminal-border bg-terminal-surface transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex flex-col gap-3 px-4 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              onClick={closeMobileMenu}
              className="py-2 text-sm"
            />
          ))}
        </div>
      </div>
    </header>
  );
}
