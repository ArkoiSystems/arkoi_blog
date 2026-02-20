import { readFile } from "fs/promises";
import path from "path";

import matter from "gray-matter";
import { z } from "zod";

const ABOUT_FILE_PATH = path.join(process.cwd(), "content/about.md");

export interface About {
  title: string;
  description: string;
  content: string;
}

export const AboutMatterSchema = z.object({
  title: z.string().min(1, "About page must have a title"),
  description: z.string().min(1, "About page must have a description"),
});

export type AboutMatter = z.infer<typeof AboutMatterSchema>;

export async function getAboutContent(): Promise<About | null> {
  try {
    const fileContent = await readFile(ABOUT_FILE_PATH, "utf-8");
    const { data, content } = matter(fileContent);
    const parsed = AboutMatterSchema.parse(data);

    return {
      title: parsed.title,
      description: parsed.description,
      content,
    };
  } catch (error) {
    console.error("Error reading about page:", error);
    return null;
  }
}
