import { H1, Text, Stack, PostCard } from "@/components";
import { getAllPosts, Post } from "@/lib/posts";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <Stack spacing="lg">
      <Stack spacing="sm">
        <H1>ArkoiSystems</H1>
        <Text>
          Building compilers, kernels, and developer tools from scratch.
          Exploring systems programming and low-level software development.
        </Text>
      </Stack>

      <Stack spacing="sm">
        {posts.map((post: Post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </Stack>
    </Stack>
  );
}
