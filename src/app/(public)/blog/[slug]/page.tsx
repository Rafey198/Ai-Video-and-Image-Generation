import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/config/marketing";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: `Blog — ${SITE_CONFIG.name}` };

  return {
    title: `${post.title} — ${SITE_CONFIG.name}`,
    description: post.excerpt,
  };
}

function renderContent(content: string) {
  return content.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-8 text-xl font-bold">
          {block.replace("## ", "")}
        </h2>
      );
    }

    const parts = block.split(/(\[[^\]]+\]\([^)]+\))/g);
    return (
      <p key={i} className="mt-4 leading-relaxed text-muted-foreground">
        {parts.map((part, j) => {
          const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (match) {
            return (
              <Link
                key={j}
                href={match[2]}
                className="text-violet-electric hover:underline"
              >
                {match[1]}
              </Link>
            );
          }
          return part;
        })}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <article className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to blog
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="violet">{post.category}</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-muted-foreground">By {post.author}</p>

        <div className="prose prose-invert mt-10 max-w-none">{renderContent(post.content)}</div>
      </div>
    </article>
  );
}
