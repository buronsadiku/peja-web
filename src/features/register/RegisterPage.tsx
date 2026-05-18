"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { api, ApiClientError } from "@/lib/api/client";
import { computeDisabledReasons } from "./lib/conflicts";
import { ActivityCheckboxItem } from "./components/ActivityCheckboxItem";
import { DayPicker } from "./components/DayPicker";

type FormState = {
  email: string;
  fullName: string;
  phone: string;
  festivalDayId: string | null;
  selectedIds: Set<string>;
  responsibilityAccepted: boolean;
  commitmentAccepted: boolean;
};

const initialForm: FormState = {
  email: "",
  fullName: "",
  phone: "",
  festivalDayId: null,
  selectedIds: new Set(),
  responsibilityAccepted: false,
  commitmentAccepted: false,
};

export const RegisterPage = () => {
  const locale = useLocale();
  const t = useTranslations("register");
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submittedSummary, setSubmittedSummary] = useState<{
    date: string;
    activities: string[];
  } | null>(null);
  const lookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const datesQuery = useQuery({
    queryKey: ["festival-days"],
    queryFn: () => api.activities.festivalDays(),
  });

  const activitiesQuery = useQuery({
    queryKey: ["activities", form.festivalDayId, locale],
    queryFn: () =>
      api.activities.list(form.festivalDayId ?? undefined, locale),
    enabled: !!form.festivalDayId,
  });

  const lookupMutation = useMutation({
    mutationFn: (email: string) => api.registrations.lookup(email),
    onSuccess: (data) => {
      if (!data) return;
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || data.fullName,
        phone: prev.phone || data.phone,
      }));
    },
  });

  const submitMutation = useMutation({
    mutationFn: api.registrations.create,
    onSuccess: (data) => {
      setSubmittedSummary({ date: data.date, activities: data.activities });
      setForm((prev) => ({
        ...initialForm,
        email: prev.email,
        fullName: prev.fullName,
        phone: prev.phone,
      }));
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const activities = activitiesQuery.data ?? [];
  const disabledReasons = useMemo(
    () => computeDisabledReasons(activities, form.selectedIds),
    [activities, form.selectedIds],
  );

  useEffect(() => {
    return () => {
      if (lookupTimer.current) clearTimeout(lookupTimer.current);
    };
  }, []);

  const onEmailBlur = () => {
    if (lookupTimer.current) clearTimeout(lookupTimer.current);
    if (!form.email || !form.email.includes("@")) return;
    lookupTimer.current = setTimeout(() => {
      lookupMutation.mutate(form.email);
    }, 100);
  };

  const onSelectDay = (festivalDayId: string) => {
    setForm((prev) => ({
      ...prev,
      festivalDayId,
      selectedIds: new Set(),
    }));
  };

  const toggleActivity = (id: string, next: boolean) => {
    setForm((prev) => {
      const ids = new Set(prev.selectedIds);
      if (next) ids.add(id);
      else ids.delete(id);
      return { ...prev, selectedIds: ids };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !form.festivalDayId ||
      !form.responsibilityAccepted ||
      !form.commitmentAccepted ||
      form.selectedIds.size === 0
    ) {
      return;
    }
    submitMutation.mutate({
      email: form.email,
      fullName: form.fullName,
      phone: form.phone,
      festivalDayId: form.festivalDayId,
      occurrenceIds: Array.from(form.selectedIds),
      responsibilityAccepted: true,
      notifyIfAbsent: false,
    });
  };

  if (submittedSummary) {
    return (
      <div className="pt-24 min-h-screen bg-background">
        <section className="py-32 px-4">
          <div className="max-w-2xl mx-auto text-center bg-card border border-primary rounded-3xl p-12 shadow-2xl shadow-primary/20">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-primary">{t("registered_title")}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t("registered_body", { date: submittedSummary.date })}
            </p>
            <ul className="text-left bg-background border border-border rounded-xl p-6 mb-8">
              {submittedSummary.activities.map((a) => (
                <li key={a} className="py-1">
                  • {a}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSubmittedSummary(null)}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all"
            >
              {t("register_another")}
            </button>
          </div>
        </section>
      </div>
    );
  }

  const submitError = submitMutation.error;
  const submitErrorMessage =
    submitError instanceof ApiClientError
      ? "message" in submitError.payload
        ? submitError.payload.message
        : t("submission_failed")
      : submitError
        ? t("submission_failed_retry")
        : null;

  return (
    <div className="pt-24 min-h-screen bg-background">
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-primary">{t("hero_a")}</span> {t("hero_b")}
          </h1>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <h2 className="text-3xl font-black mb-8">{t("step_select_day")}</h2>
            {datesQuery.isLoading ? (
              <p className="text-muted-foreground mb-8">
                {t("loading_dates")}
              </p>
            ) : (
              <div className="mb-10">
                <DayPicker
                  days={datesQuery.data ?? []}
                  selectedId={form.festivalDayId}
                  onChange={onSelectDay}
                />
              </div>
            )}

            <h2 className="text-3xl font-black mb-8">
              {t("step_personal_info")}
            </h2>

            <div className="mb-6">
              <label htmlFor="email" className="block mb-3 text-lg">
                {t("email_label")} <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                id="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value.trim() })
                }
                onBlur={onEmailBlur}
                className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-lg"
                placeholder={t("email_placeholder")}
              />
              {lookupMutation.data ? (
                <p className="text-xs text-primary mt-2">
                  {t("email_autofilled")}
                </p>
              ) : null}
            </div>

            <div className="mb-6">
              <label htmlFor="name" className="block mb-3 text-lg">
                {t("name_label")} <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-lg"
                placeholder={t("name_placeholder")}
              />
            </div>

            <div className="mb-8">
              <label htmlFor="phone" className="block mb-3 text-lg">
                {t("phone_label")} <span className="text-primary">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-lg"
                placeholder={t("phone_placeholder")}
              />
            </div>

            <div className="border-t border-border pt-8 mb-8">
              <h2 className="text-3xl font-black mb-6">
                {t("step_select_activities")}
              </h2>
              {!form.festivalDayId ? (
                <p className="text-muted-foreground">{t("pick_day_first")}</p>
              ) : activitiesQuery.isLoading ? (
                <p className="text-muted-foreground">
                  {t("loading_activities")}
                </p>
              ) : activities.length === 0 ? (
                <p className="text-muted-foreground">{t("no_activities")}</p>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <ActivityCheckboxItem
                      key={activity.occurrenceId}
                      activity={activity}
                      checked={form.selectedIds.has(activity.occurrenceId)}
                      disabledReason={disabledReasons.get(activity.occurrenceId)}
                      onToggle={toggleActivity}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border pt-8 mb-8">
              <h2 className="text-3xl font-black mb-6">{t("step_terms")}</h2>

              <label className="flex items-start gap-4 p-5 bg-background border-2 border-border rounded-xl cursor-pointer hover:border-primary transition-all mb-4 group">
                <input
                  type="checkbox"
                  required
                  checked={form.responsibilityAccepted}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      responsibilityAccepted: e.target.checked,
                    })
                  }
                  className="w-5 h-5 mt-1 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <div className="flex-1">
                  <p className="font-bold text-lg group-hover:text-primary transition-colors mb-2">
                    {t("liability_title")}{" "}
                    <span className="text-primary">*</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("liability_body")}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-5 bg-background border-2 border-border rounded-xl cursor-pointer hover:border-primary transition-all mb-4 group">
                <input
                  type="checkbox"
                  required
                  checked={form.commitmentAccepted}
                  onChange={(e) =>
                    setForm({ ...form, commitmentAccepted: e.target.checked })
                  }
                  className="w-5 h-5 mt-1 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <div className="flex-1">
                  <p className="font-bold text-lg group-hover:text-primary transition-colors mb-2">
                    {t("commitment_title")}{" "}
                    <span className="text-primary">*</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("commitment_body")}
                  </p>
                </div>
              </label>

            </div>

            {submitErrorMessage ? (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-xl">
                <p className="text-destructive font-bold">
                  {submitErrorMessage}
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={
                submitMutation.isPending ||
                !form.festivalDayId ||
                form.selectedIds.size === 0 ||
                !form.responsibilityAccepted ||
                !form.commitmentAccepted
              }
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-5 rounded-xl text-xl font-bold hover:shadow-2xl hover:shadow-primary/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
            >
              {submitMutation.isPending ? t("submitting") : t("submit")}
              <Check className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

            <p className="text-sm text-muted-foreground text-center mt-6">
              {t("terms_consent")}{" "}
              <a href="#" className="text-primary hover:underline">
                {t("terms_link")}
              </a>{" "}
              {t("terms_and")}{" "}
              <a href="#" className="text-primary hover:underline">
                {t("privacy_link")}
              </a>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};
