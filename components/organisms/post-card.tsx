import Link from "next/link";

import { Post } from "@/lib/posts";
import {
  Card,
  CardTitle,
  CardDescription,
  CardFooter,
  BadgeList,
  Badge,
} from "@/components";

export interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <div className="space-y-3">
        <Link href={`/posts/${post.slug}`} className="group">
          <CardTitle className="group-hover:terminal-glow group-hover:text-terminal-green">
            {post.title}
          </CardTitle>
        </Link>
        <Link href={`/posts/${post.slug}`}>
          <CardDescription>{post.description}</CardDescription>
        </Link>
        <CardFooter>
          <time dateTime={post.date.toDateString()}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.readTime && (
            <span className="whitespace-nowrap">
              • {post.readTime} min read
            </span>
          )}
          {post.tags && post.tags.length > 0 && (
            <BadgeList>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags/${tag}`}>
                  <Badge>{tag}</Badge>
                </Link>
              ))}
            </BadgeList>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}
