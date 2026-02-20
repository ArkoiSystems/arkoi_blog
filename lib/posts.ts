import { readdir, readFile } from "fs/promises";
import path from "path";

import matter from "gray-matter";
import { z } from "zod";

const POSTS_DIRECTORY = path.join(process.cwd(), "content/posts");
// As it's a heavy code blog, we can assume faster speed
const WORDS_PER_MINUTE = 120;

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: Date;
  author: string;
  tags: string[];
  readTime?: number;
  content: string;
  published: boolean;
}

export const PostMatterSchema = z.object({
  title: z.string().min(1, "Post must have a title"),
  description: z.string().min(1, "Post must have a description"),
  date: z.iso.date(),
  author: z.string().min(1, "Post must have an author"),
  tags: z.array(z.string()).optional(),
  readTime: z.number().optional(),
  published: z.boolean().optional(),
});

export type PostMatter = z.infer<typeof PostMatterSchema>;

function createPost(
  slug: string,
  frontmatter: PostMatter,
  content: string,
): Post {
  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: new Date(frontmatter.date),
    author: frontmatter.author,
    tags: frontmatter.tags ?? [],
    readTime: frontmatter.readTime ?? calculateReadTime(content),
    content,
    published: frontmatter.published ?? false,
  };
}

function calculateReadTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / WORDS_PER_MINUTE);
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const allFiles = await readdir(POSTS_DIRECTORY);
    const markdownFiles = allFiles.filter((file) => file.endsWith(".md"));

    const posts: (Post | null)[] = await Promise.all(
      markdownFiles.map(async (file) => {
        const filePath = path.join(POSTS_DIRECTORY, file);
        const fileContent = await readFile(filePath, "utf-8");

        const { data, content } = matter(fileContent);
        const parsed = PostMatterSchema.parse(data);

        if (
          parsed.published === false &&
          process.env.NODE_ENV === "production"
        ) {
          return null;
        }

        const slug = file.replace(/\.md$/, "");
        return createPost(slug, parsed, content);
      }),
    );

    return posts
      .filter((post) => post !== null)
      .sort((first, second) => second.date.getTime() - first.date.getTime());
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(POSTS_DIRECTORY, `${slug}.md`);
    const fileContent = await readFile(filePath, "utf-8");

    const { data, content } = matter(fileContent);
    const parsed = PostMatterSchema.parse(data);

    if (parsed.published === false && process.env.NODE_ENV === "production") {
      return null;
    }

    return createPost(slug, parsed, content);
  } catch (error) {
    console.error(`Error reading post "${slug}":`, error);
    return null;
  }
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}
