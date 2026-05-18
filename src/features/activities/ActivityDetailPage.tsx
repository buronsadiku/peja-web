"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Calendar, Clock, Phone, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import { useFormatDate } from "@/lib/i18n/useFormatDate";
import { Skeleton, SkeletonText } from "@/features/layout/Skeleton";
import { MeetingPointMap } from "./components/MeetingPointMap";

const formatTime = (t: string) => t.slice(0, 5);

export const ActivityDetailPage = ({ slug }: { slug: string }) => {
  const locale = useLocale();
  const fmt = useFormatDate();
  const formatDate = (date: string) =>
    fmt(new Date(date + "T00:00:00"), {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const t = useTranslations("activities");
  const tc = useTranslations("common");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const detailQuery = useQuery({
    queryKey: ["activity", slug, locale],
    queryFn: () => api.activities.bySlug(slug, locale),
  });

  if (detailQuery.isLoading) {
    return (
      <div className="pt-24 min-h-screen">
        <Skeleton className="h-80 w-full rounded-none" />
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <div className="pt-6">
            <SkeletonText lines={4} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Activity not found.</p>
          <Link
            href="/activities"
            className="text-primary hover:underline"
          >
            Back to activities
          </Link>
        </div>
      </div>
    );
  }

  const activity = detailQuery.data;
  const cover = activity.coverImageUrl;
  const otherImages = activity.images.filter((i) => i.url !== cover);

  return (
    <div className="pt-24 min-h-screen bg-background">
      {cover ? (
        <section className="relative h-[60vh] overflow-hidden">
          <img
            src={cover}
            alt={activity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-5xl w-full px-6 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary px-3 py-1 rounded-full mb-4">
              {activity.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
              {activity.name}
            </h1>
          </div>
        </section>
      ) : (
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary px-3 py-1 rounded-full mb-4">
              {activity.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-4">
              {activity.name}
            </h1>
          </div>
        </section>
      )}

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/activities"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back_all")}
          </Link>

          {activity.description ? (
            <div className="bg-card border border-border rounded-2xl p-8 mb-10">
              <h2 className="text-2xl font-black mb-4">{t("about_activity")}</h2>
              <p className="text-lg text-muted-foreground whitespace-pre-line">
                {activity.description}
              </p>
            </div>
          ) : null}

          {activity.contactPhone1 || activity.contactPhone2 ? (
            <div className="bg-card border border-border rounded-2xl p-6 mb-10">
              <h2 className="text-xl font-black mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" /> {t("contact")}
              </h2>
              <div className="flex flex-wrap gap-4">
                {activity.contactPhone1 ? (
                  <a
                    href={`tel:${activity.contactPhone1.replace(/\s+/g, "")}`}
                    className="text-lg font-bold text-primary hover:underline"
                  >
                    {activity.contactPhone1}
                  </a>
                ) : null}
                {activity.contactPhone2 ? (
                  <a
                    href={`tel:${activity.contactPhone2.replace(/\s+/g, "")}`}
                    className="text-lg font-bold text-primary hover:underline"
                  >
                    {activity.contactPhone2}
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          {otherImages.length > 0 ? (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">{t("gallery")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {otherImages.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="relative h-48 rounded-xl overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {activity.occurrences.length > 0 ? (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">{t("schedule")}</h2>
              <div className="space-y-4">
                {activity.occurrences.map((o) => (
                  <div
                    key={o.occurrenceId}
                    className="bg-card border border-border rounded-2xl p-6 grid md:grid-cols-2 gap-6"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <p className="font-bold">
                          {formatDate(o.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <p>
                          {formatTime(o.startTime)} – {formatTime(o.endTime)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <p>
                          {o.seatsLeft <= 0 ? (
                            <span className="text-destructive font-bold">
                              Full
                            </span>
                          ) : (
                            <>
                              <span className="text-primary font-bold">
                                {o.seatsLeft}
                              </span>{" "}
                              of {o.capacity} spots left
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <MeetingPointMap
                      latitude={o.latitude}
                      longitude={o.longitude}
                      address={o.address}
                      meetingPoint={o.meetingPoint}
                      location={o.location}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-black mb-3">Want to join?</h2>
            <p className="text-muted-foreground mb-6">
              Register now to secure your spot for this activity.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/50"
            >
              Register
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {lightboxIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          <img
            src={otherImages[lightboxIndex].url}
            alt={otherImages[lightboxIndex].alt}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
          />
        </div>
      ) : null}
    </div>
  );
};
