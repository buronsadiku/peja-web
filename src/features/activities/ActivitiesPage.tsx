"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Calendar, LayoutGrid } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api/client";
import { useFormatDate } from "@/lib/i18n/useFormatDate";
import { SkeletonCard } from "@/features/layout/Skeleton";
import { DayFilterBar } from "./components/DayFilterBar";
import { DaySection } from "./components/DaySection";
import { TimelineView } from "./components/TimelineView";


const titleCase = (v: string) =>
  v
    .split(/[-_\s]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

type ViewMode = "cards" | "timeline";

export const ActivitiesPage = () => {
  const locale = useLocale();
  const formatDate = useFormatDate();
  const t = useTranslations("activities");
  const tc = useTranslations("common");
  const [dayFilter, setDayFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [view, setView] = useState<ViewMode>("cards");

  const activitiesQuery = useQuery({
    queryKey: ["activities", locale],
    queryFn: () => api.activities.list(undefined, locale),
  });

  const daysQuery = useQuery({
    queryKey: ["festival-days"],
    queryFn: () => api.activities.festivalDays(),
  });

  const categoriesQuery = useQuery({
    queryKey: ["activity-categories", locale],
    queryFn: () => api.activities.categories(locale),
  });

  const activities = activitiesQuery.data ?? [];
  const days = daysQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const labelFor = (value: string) =>
    categories.find((c) => c.value === value)?.label ?? titleCase(value);

  const filtered = useMemo(
    () =>
      activities.filter(
        (a) => categoryFilter === "all" || a.category === categoryFilter,
      ),
    [activities, categoryFilter],
  );

  const dayButtons = useMemo(() => {
    const buttons = [
      { value: "all", label: t("all_days"), count: filtered.length },
    ];
    for (const day of days) {
      buttons.push({
        value: day.id,
        label:
          day.label ??
          formatDate(new Date(day.date + "T00:00:00"), { weekday: "long" }),
        count: filtered.filter((a) => a.festivalDayId === day.id).length,
      });
    }
    return buttons;
  }, [filtered, days, t, formatDate]);

  const presentCategories = useMemo(() => {
    const set = new Set<string>();
    for (const a of activities) set.add(a.category);
    const ordered = categories
      .filter((c) => set.has(c.value))
      .map((c) => c.value);
    const orderedSet = new Set(ordered);
    const extras = Array.from(set).filter((v) => !orderedSet.has(v));
    return [...ordered, ...extras];
  }, [activities, categories]);

  return (
    <div className="pt-24 min-h-screen">
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

      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          {activitiesQuery.isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : activitiesQuery.isError ? (
            <p className="text-center text-destructive">{t("load_error")}</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                <p className="text-xs uppercase text-muted-foreground tracking-wider">
                  {t("categories")}
                </p>
                <div className="inline-flex bg-card border border-border rounded-full p-1">
                  <button
                    onClick={() => setView("cards")}
                    className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                      view === "cards"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" /> {t("cards")}
                  </button>
                  <button
                    onClick={() => setView("timeline")}
                    className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                      view === "timeline"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Calendar className="w-4 h-4" /> {t("timeline")}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    categoryFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary"
                  }`}
                >
                  {t("all")} ({activities.length})
                </button>
                {presentCategories.map((cat) => {
                  const count = activities.filter(
                    (a) => a.category === cat,
                  ).length;
                  const active = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {labelFor(cat)} ({count})
                    </button>
                  );
                })}
              </div>

              <DayFilterBar
                filter={dayFilter}
                onChange={setDayFilter}
                buttons={dayButtons}
              />

              {view === "timeline" ? (
                <TimelineView
                  activities={filtered}
                  days={days}
                  selectedDayId={dayFilter === "all" ? null : dayFilter}
                />
              ) : (
                days.map((day) => {
                  if (dayFilter !== "all" && dayFilter !== day.id) return null;
                  const dayActivities = filtered.filter(
                    (a) => a.festivalDayId === day.id,
                  );
                  return (
                    <DaySection
                      key={day.id}
                      date={day.date}
                      label={day.label}
                      activities={dayActivities}
                    />
                  );
                })
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            {t("ready_title")}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t("ready_subtitle")}
          </p>
          <Link
            href="/register"
            className="bg-primary text-primary-foreground px-12 py-4 rounded-full text-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/50"
          >
            {tc("register_now")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
