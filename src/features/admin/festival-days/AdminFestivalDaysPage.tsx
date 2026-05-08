"use client";

import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Pencil, Trash2 } from "lucide-react";
import {
  adminApi,
  type FestivalDayRow,
} from "../lib/admin-api";

const dateToString = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const stringToDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
};

export const AdminFestivalDaysPage = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [pendingError, setPendingError] = useState<string | null>(null);

  const daysQuery = useQuery({
    queryKey: ["admin", "festival-days"],
    queryFn: adminApi.festivalDays.list,
  });

  const days = daysQuery.data ?? [];
  const dayByDate = useMemo(() => {
    const map = new Map<string, FestivalDayRow>();
    for (const d of days) map.set(d.date, d);
    return map;
  }, [days]);

  const selectedDates = useMemo(
    () => days.map((d) => stringToDate(d.date)),
    [days],
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "festival-days"] });
    queryClient.invalidateQueries({ queryKey: ["festival-days"] });
    queryClient.invalidateQueries({ queryKey: ["activities"] });
  };

  const create = useMutation({
    mutationFn: adminApi.festivalDays.create,
    onSuccess: () => {
      setPendingError(null);
      invalidate();
    },
    onError: (err: Error) => setPendingError(err.message),
  });

  const deleteDay = useMutation({
    mutationFn: adminApi.festivalDays.delete,
    onSuccess: () => {
      setPendingError(null);
      invalidate();
    },
    onError: (err: Error) => setPendingError(err.message),
  });

  const handleDayClick = (date: Date) => {
    const key = dateToString(date);
    const pretty = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const existing = dayByDate.get(key);
    if (existing) {
      if (
        confirm(
          `Remove ${pretty} from the festival?\n\nThis will fail if any activity occurrence or participant registration still references this day.`,
        )
      ) {
        deleteDay.mutate(existing.id);
      }
    } else {
      if (confirm(`Add ${pretty} as a festival day?`)) {
        const nextSortOrder =
          days.length > 0
            ? Math.max(...days.map((d) => d.sortOrder)) + 1
            : 1;
        create.mutate({ date: key, sortOrder: nextSortOrder });
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1">Festival Days</h1>
        <p className="text-muted-foreground">
          Click a day to toggle. Highlighted days are part of the festival.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-8 inline-block">
        {daysQuery.isLoading ? (
          <p className="text-muted-foreground">Loading calendar…</p>
        ) : (
          <DayPicker
            key={selectedDates[0]?.toISOString() ?? "empty"}
            mode="multiple"
            selected={selectedDates}
            onDayClick={handleDayClick}
            defaultMonth={selectedDates[0] ?? new Date()}
            showOutsideDays
            weekStartsOn={1}
          />
        )}
      </div>

      {pendingError ? (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-xl">
          <p className="text-destructive">{pendingError}</p>
        </div>
      ) : null}

      <h2 className="text-xl font-bold mb-4">Days list</h2>

      {daysQuery.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : days.length === 0 ? (
        <p className="text-muted-foreground">
          No festival days yet. Click dates above to add them.
        </p>
      ) : (
        <div className="space-y-3">
          {days
            .slice()
            .sort(
              (a, b) =>
                a.sortOrder - b.sortOrder || a.date.localeCompare(b.date),
            )
            .map((day) =>
              editing === day.id ? (
                <DayEditForm
                  key={day.id}
                  day={day}
                  onClose={() => setEditing(null)}
                  onSaved={() => {
                    setEditing(null);
                    invalidate();
                  }}
                />
              ) : (
                <div
                  key={day.id}
                  className="bg-card border border-border rounded-xl p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-lg">
                      {new Date(day.date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                    {day.label ? (
                      <p className="text-sm text-primary">{day.label}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      Sort order: {day.sortOrder}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(day.id)}
                      className="p-2 hover:bg-background rounded-lg"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${day.date}?`))
                          deleteDay.mutate(day.id);
                      }}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ),
            )}
        </div>
      )}
    </div>
  );
};

const DayEditForm = ({
  day,
  onClose,
  onSaved,
}: {
  day: FestivalDayRow;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [label, setLabel] = useState(day.label ?? "");
  const [sortOrder, setSortOrder] = useState(String(day.sortOrder));

  const update = useMutation({
    mutationFn: () =>
      adminApi.festivalDays.update(day.id, {
        label: label || null,
        sortOrder: parseInt(sortOrder, 10) || 0,
      }),
    onSuccess: onSaved,
    onError: (err: Error) => alert(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    update.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-2 border-primary rounded-xl p-5 grid md:grid-cols-3 gap-3"
    >
      <p className="font-bold col-span-full">{day.date}</p>
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label (optional)"
        className="px-3 py-2 bg-background border border-border rounded-lg"
      />
      <input
        type="number"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        placeholder="Sort order"
        className="px-3 py-2 bg-background border border-border rounded-lg"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={update.isPending}
          className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold flex-1"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-background border border-border px-3 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
