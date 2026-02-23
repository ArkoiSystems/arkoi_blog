import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

import {
  H1,
  Badge,
  BadgeList,
  Stack,
  CodeBlock,
  Container,
} from "@/components";
import { getAllPosts, getPost } from "@/lib/posts";
import ReactMarkdown from "react-markdown";

export interface PostPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const post = await getPost(slugPath);

  if (!post) {
    return {};
  }

  return {
    title: post.slug,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date.toISOString(),
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: `/api/og?slug=${encodeURIComponent(post.slug)}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [
        {
          url: `/api/og?slug=${encodeURIComponent(post.slug)}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const post = await getPost(slugPath);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <Stack spacing="lg">
        <Stack spacing="sm">
          <H1>{post.title}</H1>
          <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-terminal-gray sm:gap-4 sm:text-base">
            <span className="whitespace-nowrap">
              {post.date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              • {post.readTime} min read • {post.author}
            </span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <BadgeList>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags/${tag}`}>
                  <Badge>{tag}</Badge>
                </Link>
              ))}
            </BadgeList>
          )}
        </Stack>

        <Container className="prose prose-base dark:prose-invert sm:prose-lg">
          <ReactMarkdown
            components={{
              pre({ children }) {
                const child = React.Children.only(
                  children,
                ) as React.ReactElement<{
                  className?: string;
                  children: React.ReactNode;
                }>;

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
              code({
                inline,
                className,
                children,
                ...props
              }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
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
            {post.content}
          </ReactMarkdown>
        </Container>
      </Stack>
    </article>
  );
}
