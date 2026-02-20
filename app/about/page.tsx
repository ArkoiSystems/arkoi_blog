import { notFound } from "next/navigation";
import { Metadata } from "next";
import React from "react";

import { H1, Text, Stack, CodeBlock } from "@/components";
import { getAboutContent } from "@/lib/about";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "about",
};

export default async function AboutPage() {
  const about = await getAboutContent();

  if (!about) {
    notFound();
  }

  return (
    <Stack spacing="lg">
      <Stack spacing="sm">
        <H1>{about.title}</H1>
        <Text size="lg">{about.description}</Text>
      </Stack>

      <div className="prose prose-base max-w-none dark:prose-invert sm:prose-lg">
        <ReactMarkdown
          components={{
            pre({ children }) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const child = React.Children.only(children) as any;

              const className = child.props.className || "";
              const match = /language-(\w+)/.exec(className);
              const language = match ? match[1] : "text";

              const code = child.props.children;

              return (
                <CodeBlock language={language}>
                  {String(code).replace(/\n$/, "")}
                </CodeBlock>
              );
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            code({ inline, className, children, ...props }: any) {
              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }

              return <code className={className}>{children}</code>;
            },
          }}
        >
          {about.content}
        </ReactMarkdown>
      </div>
    </Stack>
  );
}
