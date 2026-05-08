"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const NewsDetailPage = ({ slug }: { slug: string }) => {
  const postQuery = useQuery({
    queryKey: ["news", slug],
    queryFn: () => api.news.bySlug(slug),
  });

  if (postQuery.isLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (postQuery.isError || !postQuery.data) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Post not found.</p>
          <Link href="/news" className="text-primary hover:underline">
            Back to news
          </Link>
        </div>
      </div>
    );
  }

  const post = postQuery.data;

  return (
    <div className="pt-24 min-h-screen bg-background">
      <article className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> All news
          </Link>

          <div className="flex items-center gap-3 mb-4">
            {post.pinned ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase bg-primary/20 text-primary px-2 py-1 rounded-full">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {formatDate(post.publishedAt)}
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-8">{post.title}</h1>

          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full rounded-2xl mb-8"
            />
          ) : null}

          <div className="prose prose-invert max-w-none text-lg leading-relaxed whitespace-pre-line">
            {post.body}
          </div>
        </div>
      </article>
    </div>
  );
};
