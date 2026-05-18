"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import { Skeleton, SkeletonText } from "@/features/layout/Skeleton";

export const CommunityDetailPage = ({ slug }: { slug: string }) => {
  const locale = useLocale();
  const t = useTranslations("community");
  const tc = useTranslations("common");
  const detailQuery = useQuery({
    queryKey: ["community", slug, locale],
    queryFn: () => api.communities.bySlug(slug, locale),
  });

  if (detailQuery.isLoading) {
    return (
      <div className="pt-24 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-6">
            <Skeleton className="w-28 h-28 rounded-2xl" />
            <Skeleton className="h-12 flex-1" />
          </div>
          <div className="pt-8">
            <SkeletonText lines={6} />
          </div>
        </div>
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4">{t("not_found_title")}</h1>
          <Link
            href="/community"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back_to_list")}
          </Link>
        </div>
      </div>
    );
  }

  const community = detailQuery.data;

  return (
    <div className="pt-24 min-h-screen">
      <section className="py-12 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/community"
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back_to_list")}
          </Link>

          <div className="flex items-center gap-6">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-card border border-border overflow-hidden flex-shrink-0">
              <img
                src={community.logoUrl}
                alt={community.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              {community.name}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none text-foreground">
            {community.description
              .split(/\n\n+/)
              .filter(Boolean)
              .map((para, i) => (
                <p
                  key={i}
                  className="text-lg text-muted-foreground leading-relaxed mb-6 whitespace-pre-line"
                >
                  {para}
                </p>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};
