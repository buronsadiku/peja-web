"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  adminApi,
  type FestivalDayRow,
} from "../lib/admin-api";

export const AdminFestivalDaysPage = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const daysQuery = useQuery({
    queryKey: ["admin", "festival-days"],
    queryFn: adminApi.festivalDays.list,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "festival-days"] });
    queryClient.invalidateQueries({ queryKey: ["festival-days"] });
    queryClient.invalidateQueries({ queryKey: ["activities"] });
  };

  const deleteDay = useMutation({
    mutationFn: adminApi.festivalDays.delete,
    onSuccess: invalidate,
    onError: (err: Error) => alert(err.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Festival Days</h1>
          <p className="text-muted-foreground">
            Define which dates the festival runs. Activities and registrations
            attach to these days.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Day
        </button>
      </div>

      {showAdd ? (
        <DayForm
          onClose={() => setShowAdd(false)}
          onSaved={invalidate}
        />
      ) : null}

      {daysQuery.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : daysQuery.data?.length === 0 ? (
        <p className="text-muted-foreground">
          No festival days yet. Add one to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {daysQuery.data?.map((day) =>
            editing === day.id ? (
              <DayForm
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

const DayForm = ({
  day,
  onClose,
  onSaved,
}: {
  day?: FestivalDayRow;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [date, setDate] = useState(day?.date ?? "");
  const [label, setLabel] = useState(day?.label ?? "");
  const [sortOrder, setSortOrder] = useState(String(day?.sortOrder ?? 0));

  const create = useMutation({
    mutationFn: adminApi.festivalDays.create,
    onSuccess: () => {
      onSaved();
      onClose();
    },
    onError: (err: Error) => alert(err.message),
  });

  const update = useMutation({
    mutationFn: ({ id, ...rest }: { id: string } & Partial<FestivalDayRow>) =>
      adminApi.festivalDays.update(id, rest),
    onSuccess: () => {
      onSaved();
      onClose();
    },
    onError: (err: Error) => alert(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      date,
      label: label || null,
      sortOrder: parseInt(sortOrder, 10) || 0,
    };
    if (day) {
      update.mutate({ id: day.id, ...payload });
    } else {
      create.mutate(payload);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-2 border-primary rounded-xl p-5 mb-3 grid md:grid-cols-4 gap-3"
    >
      <input
        required
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="px-3 py-2 bg-background border border-border rounded-lg"
      />
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
          disabled={create.isPending || update.isPending}
          className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold flex-1"
        >
          {day ? "Update" : "Create"}
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
