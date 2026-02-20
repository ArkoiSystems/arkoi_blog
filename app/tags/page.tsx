import { Metadata } from "next";
import Link from "next/link";

import { H1, Badge, Stack, TerminalPrompt } from "@/components";
import { getAllTags, getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "tags",
};

export function TagItem({
  tag,
  count,
  index,
}: {
  tag: string;
  count: number;
  index: number;
}) {
  return (
    <Link
      key={tag}
      href={`/tags/${tag}`}
      className="group flex items-center gap-3 rounded border border-terminal-border p-3 transition-all hover:border-terminal-cyan hover:bg-terminal-bg"
    >
      <div className="w-8 shrink-0 text-right text-terminal-gray">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="shrink-0 text-terminal-cyan">│</div>
      <div className="flex-1 text-terminal-text transition-colors group-hover:text-terminal-cyan">
        {tag}
      </div>
      <div className="shrink-0">
        <Badge variant="gray" size="sm">
          {count}
        </Badge>
      </div>
    </Link>
  );
}

export default async function TagsPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  const tagCounts = new Map<string, number>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return (
    <Stack spacing="lg">
      <Stack spacing="sm">
        <H1>Browse by Tag</H1>
        <div className="mb-4 gap-3 space-y-1 font-mono text-sm">
          <TerminalPrompt
            command={`grep -rhoP 'tags:\\s*\\[\\K[^]]+' --include="*.md" . | tr -d ' "' | tr ',' '\\n' | sort -u | wc -l`}
            className="text-terminal-gray"
          />
          <div className="text-terminal-green">
            Found {tags.length} unique {tags.length === 1 ? "tag" : "tags"}
          </div>
        </div>
      </Stack>

      <Stack
        className="rounded border border-terminal-border bg-terminal-surface p-4 font-mono text-sm sm:p-6"
        spacing="sm"
      >
        <div className="mb-4 flex items-center gap-3 font-mono text-sm">
          <span className="text-terminal-yellow">@</span>
          <span className="text-terminal-text">Available tags:</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag, index) => {
            const count = tagCounts.get(tag) || 0;
            return (
              <TagItem key={index} tag={tag} count={count} index={index} />
            );
          })}
        </div>
      </Stack>
    </Stack>
  );
}
