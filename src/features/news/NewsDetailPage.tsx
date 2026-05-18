"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { ArrowLeft, Pin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import { useFormatDate } from "@/lib/i18n/useFormatDate";
import { Skeleton, SkeletonText } from "@/features/layout/Skeleton";

export const NewsDetailPage = ({ slug }: { slug: string }) => {
  const locale = useLocale();
  const fmt = useFormatDate();
  const formatDate = (s: string) =>
    fmt(new Date(s), {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const postQuery = useQuery({
    queryKey: ["news", slug, locale],
    queryFn: () => api.news.bySlug(slug, locale),
  });

  if (postQuery.isLoading) {
    return (
      <div className="pt-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-72 w-full rounded-2xl" />
          <SkeletonText lines={6} />
        </div>
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
