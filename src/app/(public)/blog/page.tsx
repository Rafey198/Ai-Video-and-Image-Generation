import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { PageHero } from "@/components/marketing/PageHero";
import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS } from "@/config/marketing";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Blog — ${SITE_CONFIG.name}`,
  description: "Product updates, guides, and insights from the VireoMorph team.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        badge="Blog"
        title="News & insights"
        subtitle="Product launches, creative guides, and platform updates."
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-border/50 bg-card/40 p-6 shadow-glass backdrop-blur-sm transition-all hover:border-violet-glow/30 hover:shadow-neon-sm sm:p-8"
            >
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

              <h2 className="mt-4 text-2xl font-bold group-hover:text-violet-electric">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
              <p className="mt-4 text-sm text-muted-foreground">By {post.author}</p>

              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex items-center text-sm font-medium text-violet-electric hover:underline"
              >
                Read article
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
