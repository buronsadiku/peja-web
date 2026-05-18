"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import { SkeletonGrid } from "@/features/layout/Skeleton";
import type {
  GalleryImage,
  GallerySection as Section,
} from "@/lib/api/types";
import { GalleryItem } from "./components/GalleryItem";
import { Lightbox } from "./components/Lightbox";
import {
  SectionFilterBar,
  type SectionFilter,
} from "./components/SectionFilterBar";

const PAGE_LIMIT = 30;

const sections: Section[] = ["live", "workshops", "adventures", "food"];

export const GalleryPage = () => {
  const t = useTranslations("gallery");
  const [filter, setFilter] = useState<SectionFilter>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const galleryQuery = useInfiniteQuery({
    queryKey: ["gallery", "infinite", filter],
    queryFn: ({ pageParam }) =>
      api.gallery.list({
        section: filter === "all" ? undefined : filter,
        page: pageParam,
        limit: PAGE_LIMIT,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const items = useMemo<GalleryImage[]>(
    () => galleryQuery.data?.pages.flatMap((p) => p.data) ?? [],
    [galleryQuery.data],
  );

  const total = galleryQuery.data?.pages[0]?.pagination.total ?? 0;

  const countsQueries = useQuery({
    queryKey: ["gallery", "counts"],
    queryFn: async () => {
      const all = await api.gallery.list({ limit: 1, page: 1 });
      const perSection = await Promise.all(
        sections.map(async (s) => {
          const res = await api.gallery.list({
            section: s,
            limit: 1,
            page: 1,
          });
          return [s, res.pagination.total] as const;
        }),
      );
      return {
        all: all.pagination.total,
        ...Object.fromEntries(perSection),
      } as Record<SectionFilter, number>;
    },
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = galleryQuery;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleOpen = (entry: GalleryImage) => {
    const idx = items.findIndex((i) => i.id === entry.id);
    if (idx >= 0) setLightboxIndex(idx);
  };

  return (
    <div className="pt-24 min-h-screen bg-background">
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            {t("hero_a")} <span className="text-primary">{t("hero_b")}</span>
          </h1>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionFilterBar
            filter={filter}
            onChange={setFilter}
            counts={(countsQueries.data ?? {}) as Record<SectionFilter, number>}
          />

          {galleryQuery.isLoading ? (
            <SkeletonGrid count={12} itemClass="h-64 rounded-2xl" />
          ) : galleryQuery.isError ? (
            <p className="text-center text-destructive">
              Failed to load gallery.
            </p>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No photos in this section yet.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((entry) => (
                  <GalleryItem
                    key={entry.id}
                    entry={entry}
                    onClick={() => handleOpen(entry)}
                  />
                ))}
              </div>

              <div ref={sentinelRef} className="h-10" />

              {galleryQuery.isFetchingNextPage ? (
                <p className="text-center text-muted-foreground py-8">
                  Loading more…
                </p>
              ) : !galleryQuery.hasNextPage && items.length > 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  Showing all {total} photos
                </p>
              ) : null}
            </>
          )}
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Be Part of the Next Story
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join us and create your own memories
          </p>
          <Link
            href="/register"
            className="bg-primary text-primary-foreground px-12 py-4 rounded-full text-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/50"
          >
            Register Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {lightboxIndex !== null ? (
        <Lightbox
          images={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </div>
  );
};
