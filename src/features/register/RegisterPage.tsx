"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { api, ApiClientError } from "@/lib/api/client";
import { computeDisabledReasons } from "./lib/conflicts";
import { ActivityCheckboxItem } from "./components/ActivityCheckboxItem";
import { DayPicker } from "./components/DayPicker";

type FormState = {
  email: string;
  fullName: string;
  phone: string;
  date: string | null;
  selectedIds: Set<string>;
  responsibilityAccepted: boolean;
  notifyIfAbsent: boolean;
  commitmentAccepted: boolean;
};

const initialForm: FormState = {
  email: "",
  fullName: "",
  phone: "",
  date: null,
  selectedIds: new Set(),
  responsibilityAccepted: false,
  notifyIfAbsent: false,
  commitmentAccepted: false,
};

export const RegisterPage = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submittedSummary, setSubmittedSummary] = useState<{
    date: string;
    activities: string[];
  } | null>(null);
  const lookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const datesQuery = useQuery({
    queryKey: ["festival-dates"],
    queryFn: () => api.activities.dates(),
  });

  const activitiesQuery = useQuery({
    queryKey: ["activities", form.date],
    queryFn: () => api.activities.list(form.date ?? undefined),
    enabled: !!form.date,
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

  const onSelectDate = (date: string) => {
    setForm((prev) => ({ ...prev, date, selectedIds: new Set() }));
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
      !form.date ||
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
      date: form.date,
      occurrenceIds: Array.from(form.selectedIds),
      responsibilityAccepted: true,
      notifyIfAbsent: form.notifyIfAbsent,
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
              <span className="text-primary">REGISTERED!</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              You&apos;re in for {submittedSummary.date}. A confirmation email
              is on its way.
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
              Register Another Day
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
        : "Submission failed."
      : submitError
        ? "Submission failed. Try again."
        : null;

  return (
    <div className="pt-24 min-h-screen bg-background">
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-primary">REGISTER</span> NOW
          </h1>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <p className="text-xl text-muted-foreground">
            One registration per email per day. Choose your day, then your
            activities.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <h2 className="text-3xl font-black mb-8">1. Select Day</h2>
            {datesQuery.isLoading ? (
              <p className="text-muted-foreground mb-8">Loading dates…</p>
            ) : (
              <div className="mb-10">
                <DayPicker
                  dates={datesQuery.data ?? []}
                  selected={form.date}
                  onChange={onSelectDate}
                />
              </div>
            )}

            <h2 className="text-3xl font-black mb-8">2. Personal Information</h2>

            <div className="mb-6">
              <label htmlFor="email" className="block mb-3 text-lg">
                Email Address <span className="text-primary">*</span>
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
                placeholder="your@email.com"
              />
              {lookupMutation.data ? (
                <p className="text-xs text-primary mt-2">
                  Auto-filled from prior registration. Edit if needed.
                </p>
              ) : null}
            </div>

            <div className="mb-6">
              <label htmlFor="name" className="block mb-3 text-lg">
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-lg"
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-8">
              <label htmlFor="phone" className="block mb-3 text-lg">
                Phone Number <span className="text-primary">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-lg"
                placeholder="+383 XX XXX XXX"
              />
            </div>

            <div className="border-t border-border pt-8 mb-8">
              <h2 className="text-3xl font-black mb-6">3. Select Activities</h2>
              {!form.date ? (
                <p className="text-muted-foreground">
                  Pick a day above to see activities.
                </p>
              ) : activitiesQuery.isLoading ? (
                <p className="text-muted-foreground">Loading activities…</p>
              ) : activities.length === 0 ? (
                <p className="text-muted-foreground">
                  No activities for this day yet.
                </p>
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
              <h2 className="text-3xl font-black mb-6">4. Terms & Commitment</h2>

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
                    Liability & responsibility{" "}
                    <span className="text-primary">*</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    I accept full responsibility for any injuries or accidents
                    during festival activities. I participate at my own risk
                    and will not hold organizers liable.
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
                    Commitment to attend{" "}
                    <span className="text-primary">*</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    I commit to showing up for the activities I&apos;ve
                    registered for. Spots are limited and my no-show prevents
                    others from joining.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-5 bg-background border-2 border-border rounded-xl cursor-pointer hover:border-primary transition-all group">
                <input
                  type="checkbox"
                  checked={form.notifyIfAbsent}
                  onChange={(e) =>
                    setForm({ ...form, notifyIfAbsent: e.target.checked })
                  }
                  className="w-5 h-5 mt-1 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <div className="flex-1">
                  <p className="font-bold text-lg group-hover:text-primary transition-colors mb-2">
                    Notify me if I don&apos;t attend
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Receive a follow-up email if I miss any of my registered
                    activities.
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
                !form.date ||
                form.selectedIds.size === 0 ||
                !form.responsibilityAccepted ||
                !form.commitmentAccepted
              }
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-5 rounded-xl text-xl font-bold hover:shadow-2xl hover:shadow-primary/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
            >
              {submitMutation.isPending
                ? "Submitting…"
                : "Complete Registration"}
              <Check className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

            <p className="text-sm text-muted-foreground text-center mt-6">
              By registering, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};
