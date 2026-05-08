"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Pin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";

const PAGE_LIMIT = 12;

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const NewsPage = () => {
  const [page, setPage] = useState(1);

  const newsQuery = useQuery({
    queryKey: ["news", page],
    queryFn: () => api.news.list({ page, limit: PAGE_LIMIT }),
  });

  const posts = newsQuery.data?.data ?? [];
  const pagination = newsQuery.data?.pagination;

  return (
    <div className="pt-24 min-h-screen bg-background">
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            FESTIVAL <span className="text-primary">NEWS</span>
          </h1>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Announcements, updates, and live posts from the festival team.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {newsQuery.isLoading ? (
            <p className="text-center text-muted-foreground">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No news yet. Check back soon.
            </p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all group"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    {post.imageUrl ? (
                      <div className="h-48 md:h-full overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    ) : null}
                    <div
                      className={`p-6 ${post.imageUrl ? "md:col-span-2" : "md:col-span-3"}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {post.pinned ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase bg-primary/20 text-primary px-2 py-1 rounded-full">
                            <Pin className="w-3 h-3" /> Pinned
                          </span>
                        ) : null}
                        <p className="text-sm text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </p>
                      </div>
                      <h2 className="text-2xl font-black group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground line-clamp-3">
                        {post.body}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 ? (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="w-12 h-12 rounded-full bg-card border border-border hover:border-primary disabled:opacity-30 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <p className="text-muted-foreground text-sm">
                {pagination.page} / {pagination.totalPages}
              </p>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.totalPages}
                className="w-12 h-12 rounded-full bg-card border border-border hover:border-primary disabled:opacity-30 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};
