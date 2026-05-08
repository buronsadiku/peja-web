"use client";

import { useEffect, useRef, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Pencil, Search, Trash2, X } from "lucide-react";
import { api } from "@/lib/api/client";
import {
  adminApi,
  type RegistrationRow,
} from "../lib/admin-api";
import { Pagination } from "../components/Pagination";

const PAGE_LIMIT = 100;

const formatDate = (date: string) => {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatTime = (t: string) => t.slice(0, 5);

export const AdminRegistrationsPage = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [occurrenceFilter, setOccurrenceFilter] = useState<string | "all">(
    "all",
  );
  const [dayFilter, setDayFilter] = useState<string | "all">("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const occurrencesQuery = useQuery({
    queryKey: ["activities"],
    queryFn: () => api.activities.list(),
  });

  const datesQuery = useQuery({
    queryKey: ["festival-days"],
    queryFn: () => api.activities.festivalDays(),
  });

  const allOccurrences = occurrencesQuery.data ?? [];
  const visibleOccurrences =
    dayFilter === "all"
      ? allOccurrences
      : allOccurrences.filter((o) => o.festivalDayId === dayFilter);

  const registrationsQuery = useQuery({
    queryKey: [
      "admin",
      "registrations",
      page,
      debouncedSearch,
      occurrenceFilter,
      dayFilter,
    ],
    queryFn: () =>
      adminApi.registrations.list({
        page,
        limit: PAGE_LIMIT,
        q: debouncedSearch || undefined,
        occurrenceId:
          occurrenceFilter === "all" ? undefined : occurrenceFilter,
        festivalDayId: dayFilter === "all" ? undefined : dayFilter,
      }),
  });

  const handleDayFilter = (next: string | "all") => {
    setDayFilter(next);
    setOccurrenceFilter("all");
    setPage(1);
  };

  const handleActivityFilter = (next: string | "all") => {
    setOccurrenceFilter(next);
    setPage(1);
  };

  const rows = registrationsQuery.data?.data ?? [];
  const pagination = registrationsQuery.data?.pagination;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "registrations"] });
  };

  const deleteRow = useMutation({
    mutationFn: adminApi.registrations.delete,
    onSuccess: invalidate,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black mb-1">Registrations</h1>
        <p className="text-muted-foreground">
          {pagination?.total ?? 0} total registrations
          {debouncedSearch ? ` matching "${debouncedSearch}"` : ""}.
        </p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name, email, or phone…"
          className="w-full pl-11 pr-11 py-3 bg-card border border-border rounded-xl focus:outline-none focus:border-primary"
        />
        {searchInput ? (
          <button
            onClick={() => setSearchInput("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-background rounded-md"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        ) : null}
      </div>

      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs uppercase text-muted-foreground mb-2">Day</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDayFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                dayFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary"
              }`}
            >
              All days
            </button>
            {(datesQuery.data ?? []).map((d) => {
              const active = dayFilter === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleDayFilter(d.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary"
                  }`}
                >
                  {d.label ??
                    new Date(d.date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground mb-2">
            Activity{" "}
            {dayFilter !== "all" ? (
              <span className="text-muted-foreground/70 normal-case">
                (within selected day)
              </span>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleActivityFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                occurrenceFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary"
              }`}
            >
              All activities
            </button>
            {visibleOccurrences.map((o) => {
              const active = occurrenceFilter === o.occurrenceId;
              return (
                <button
                  key={o.occurrenceId}
                  onClick={() => handleActivityFilter(o.occurrenceId)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary"
                  }`}
                >
                  {o.name}
                  <span className="ml-1.5 opacity-70 font-normal">
                    {dayFilter === "all" ? `${formatDate(o.date)} · ` : ""}
                    {formatTime(o.startTime)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {registrationsQuery.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground">
          {debouncedSearch
            ? "No registrations match your search."
            : "No registrations yet."}
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {rows.map((row) =>
              editing === row.id ? (
                <RegistrationForm
                  key={row.id}
                  row={row}
                  onClose={() => setEditing(null)}
                  onSaved={() => {
                    setEditing(null);
                    invalidate();
                  }}
                />
              ) : (
                <div
                  key={row.id}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{row.fullName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {row.email} · {row.phone}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Registered for <strong>{row.date}</strong> on{" "}
                        {new Date(row.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(row.id)}
                        className="p-2 hover:bg-background rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(`Delete registration for ${row.fullName}?`)
                          )
                            deleteRow.mutate(row.id);
                        }}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs uppercase text-muted-foreground mb-2">
                      Activities ({row.activities.length})
                    </p>
                    <ul className="text-sm space-y-1">
                      {row.activities.map((a) => (
                        <li key={a.id}>
                          • {a.name}{" "}
                          <span className="text-muted-foreground">
                            ({a.startTime.slice(0, 5)}–{a.endTime.slice(0, 5)})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ),
            )}
          </div>

          {pagination ? (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onChange={setPage}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

const RegistrationForm = ({
  row,
  onClose,
  onSaved,
}: {
  row: RegistrationRow;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [fullName, setFullName] = useState(row.fullName);
  const [email, setEmail] = useState(row.email);
  const [phone, setPhone] = useState(row.phone);
  const [notifyIfAbsent, setNotifyIfAbsent] = useState(row.notifyIfAbsent);

  const update = useMutation({
    mutationFn: () =>
      adminApi.registrations.update(row.id, {
        fullName,
        email,
        phone,
        notifyIfAbsent,
      }),
    onSuccess: onSaved,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    update.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-2 border-primary rounded-xl p-5 space-y-3"
    >
      <div className="grid md:grid-cols-3 gap-3">
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name"
          className="px-4 py-2 bg-background border border-border rounded-lg"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="px-4 py-2 bg-background border border-border rounded-lg"
        />
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="px-4 py-2 bg-background border border-border rounded-lg"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={notifyIfAbsent}
          onChange={(e) => setNotifyIfAbsent(e.target.checked)}
        />
        Notify if absent
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={update.isPending}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold"
        >
          Update
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-background border border-border px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
