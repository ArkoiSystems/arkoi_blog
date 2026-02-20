#!/usr/bin/env tsx

import { getAboutContent } from "../lib/about";
import { getAllPosts } from "../lib/posts";

async function validatePosts(): Promise<boolean> {
  try {
    const posts = await getAllPosts();

    if (!posts || posts.length === 0) {
      console.warn("No posts found");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Posts validation failed:", error);
    return false;
  }
}

async function validateAbout(): Promise<boolean> {
  try {
    const about = await getAboutContent();

    if (!about) {
      console.error("About page not found or invalid");
      return false;
    }

    return true;
  } catch (error) {
    console.error("About page validation failed:", error);
    return false;
  }
}

async function main() {
  console.log("Validating content...");

  const postsValid = await validatePosts();
  const aboutValid = await validateAbout();

  if (postsValid && aboutValid) {
    console.log("All content is valid");
    process.exit(0);
  } else {
    console.error("Content validation failed");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Validation error:", error);
  process.exit(1);
});
