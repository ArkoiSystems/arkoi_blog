import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

import { H1, Badge, Stack, PostCard, TerminalPrompt } from "@/components";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();

  return tags.map((tag) => ({
    tag: tag,
  }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;

  return {
    title: `tags/${tag}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  const allTags = await getAllTags();

  if (posts.length === 0) {
    notFound();
  }

  return (
    <Stack spacing="lg">
      <Stack spacing="sm">
        <H1>Tag: {tag}</H1>
        <div className="mb-4 gap-3 space-y-1 font-mono text-sm">
          <TerminalPrompt
            command={`grep -rl --include="*.md" 'tags:.*"${tag}"' . | wc -l`}
          />
          <div className="text-terminal-green">
            Found {posts.length} {posts.length === 1 ? "match" : "matches"}
          </div>
        </div>
      </Stack>

      <Stack className="rounded border border-terminal-border bg-terminal-surface p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-3 font-mono text-sm">
          <span className="text-terminal-yellow">@</span>
          <span className="text-terminal-text">Available tags:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => (
            <Link key={t} href={`/tags/${t}`}>
              <Badge variant={t === tag ? "green" : "blue"}>{t}</Badge>
            </Link>
          ))}
        </div>
        <div className="mt-2 w-full border-t border-terminal-border pt-2 sm:w-auto">
          <Link href="/">
            <Badge variant="gray">✕ Clear filter</Badge>
          </Link>
        </div>
      </Stack>

      <Stack spacing="sm">
        {posts.map((post) => (
          <div key={post.slug}>
            <PostCard post={post} />
          </div>
        ))}
      </Stack>
    </Stack>
  );
}
