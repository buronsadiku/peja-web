"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import {
  adminApi,
  type RegistrationRow,
} from "../lib/admin-api";

export const AdminRegistrationsPage = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);

  const registrationsQuery = useQuery({
    queryKey: ["admin", "registrations"],
    queryFn: adminApi.registrations.list,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "registrations"] });
  };

  const deleteRow = useMutation({
    mutationFn: adminApi.registrations.delete,
    onSuccess: invalidate,
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1">Registrations</h1>
        <p className="text-muted-foreground">
          {registrationsQuery.data?.length ?? 0} total registrations.
        </p>
      </div>

      {registrationsQuery.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-4">
          {registrationsQuery.data?.map((row) =>
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
