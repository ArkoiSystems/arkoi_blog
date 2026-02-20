import { Metadata } from "next";

import { ThemeProvider, Header, Container, TerminalPrompt } from "@/components";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "$ cat ./arkoisystems",
    template: "$ cat ./arkoisystems/%s",
  },
  description:
    "ArkoiSystems: Building compilers, kernels, and developer tools from scratch",
  authors: [
    { name: "ArkoiSystems", url: "https://www.arkoisystems.com/" },
    { name: "Timo Behrend", url: "https://www.linkedin.com/in/timo-behrend/" },
  ],
  keywords: [
    "compiler",
    "kernel",
    "systems programming",
    "low-level",
    "diagnostics",
    "tooling",
    "arkoi",
  ],
};

export function RootHeader() {
  return <Header />;
}

export function RootFooter() {
  return (
    <TerminalPrompt
      as={Container}
      command={`echo "ArkoiSystems © ${new Date().getFullYear()} | Built with Next.js, TypeScript, Bun & Tailwind"`}
      className="border-t border-terminal-border text-center text-xs text-terminal-gray sm:text-sm"
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Container as="body" width="lg">
        <ThemeProvider>
          <RootHeader />
          <Container as="main">{children}</Container>
          <RootFooter />
        </ThemeProvider>
      </Container>
    </html>
  );
}
