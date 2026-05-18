"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import { Skeleton, SkeletonText } from "@/features/layout/Skeleton";
import type { Community } from "@/lib/api/types";

const CommunityCard = ({
  community,
  readMoreLabel,
}: {
  community: Community;
  readMoreLabel: string;
}) => {
  const truncated = community.description.length > 220;

  return (
    <Link
      href={`/community/${community.slug}`}
      className="bg-card border border-border rounded-2xl p-6 hover:border-primary transition-all flex flex-col group cursor-pointer"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-background border border-border overflow-hidden flex-shrink-0">
          <img
            src={community.logoUrl}
            alt={community.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors">
          {community.name}
        </h3>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
        {community.description}
      </p>

      {truncated ? (
        <span className="mt-4 text-sm font-bold text-primary inline-flex items-center gap-1 self-start group-hover:gap-2 transition-all">
          {readMoreLabel} <ArrowRight className="w-4 h-4" />
        </span>
      ) : null}
    </Link>
  );
};

export const CommunityPage = () => {
  const locale = useLocale();
  const t = useTranslations("community");
  const tc = useTranslations("common");
  const communitiesQuery = useQuery({
    queryKey: ["communities", locale],
    queryFn: () => api.communities.list(locale),
  });

  const communities = communitiesQuery.data ?? [];

  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            {t("title_a")} <span className="text-primary">{t("title_b")}</span>
          </h1>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          {communitiesQuery.isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <Skeleton className="h-6 flex-1" />
                  </div>
                  <SkeletonText lines={3} />
                </div>
              ))}
            </div>
          ) : communitiesQuery.isError ? (
            <p className="text-center text-destructive">{t("load_error")}</p>
          ) : communities.length === 0 ? (
            <p className="text-center text-muted-foreground">{t("empty")}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((c) => (
                <CommunityCard
                  key={c.id}
                  community={c}
                  readMoreLabel={tc("read_more")}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
