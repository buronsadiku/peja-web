"use client";

import { useMemo, useRef, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Eye, EyeOff, Pencil, Plus, Trash2, Upload } from "lucide-react";
import {
  musiciansAdminApi,
  type MusicianRow,
} from "../lib/news-api";

type FestivalDayLite = {
  id: string;
  date: string;
  label: string | null;
  sortOrder: number;
};

const dayLabel = (day: FestivalDayLite) =>
  day.label ? `${day.label} · ${day.date}` : day.date;

export const AdminMusiciansPage = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const musiciansQuery = useQuery({
    queryKey: ["admin", "musicians"],
    queryFn: musiciansAdminApi.list,
  });

  const daysQuery = useQuery<FestivalDayLite[]>({
    queryKey: ["admin", "festival-days"],
    queryFn: async () => {
      const res = await fetch("/api/admin/festival-days");
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { data: FestivalDayLite[] };
      return json.data;
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "musicians"] });
    queryClient.invalidateQueries({ queryKey: ["musicians"] });
  };

  const deleteRow = useMutation({
    mutationFn: musiciansAdminApi.delete,
    onSuccess: invalidate,
    onError: (err: Error) => alert(err.message),
  });

  const togglePublished = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      musiciansAdminApi.update(id, { isPublished }),
    onSuccess: invalidate,
  });

  const grouped = useMemo(() => {
    const days = daysQuery.data ?? [];
    const items = musiciansQuery.data ?? [];
    const byDay = new Map<string, MusicianRow[]>();
    items.forEach((m) => {
      const arr = byDay.get(m.festivalDayId) ?? [];
      arr.push(m);
      byDay.set(m.festivalDayId, arr);
    });
    return days
      .slice()
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder || a.date.localeCompare(b.date),
      )
      .map((day) => ({ day, list: byDay.get(day.id) ?? [] }));
  }, [daysQuery.data, musiciansQuery.data]);

  const noDays = !daysQuery.isLoading && (daysQuery.data ?? []).length === 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Lineup</h1>
          <p className="text-muted-foreground">
            Musicians shown on the public homepage, grouped by festival day.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          disabled={noDays}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> New musician
        </button>
      </div>

      {noDays ? (
        <p className="text-sm text-destructive mb-4">
          No festival days yet. Add days in “Festival Days” first.
        </p>
      ) : null}

      {showAdd && !noDays ? (
        <MusicianForm
          days={daysQuery.data ?? []}
          onClose={() => setShowAdd(false)}
          onSaved={invalidate}
        />
      ) : null}

      {musiciansQuery.isLoading || daysQuery.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (musiciansQuery.data ?? []).length === 0 ? (
        <p className="text-muted-foreground">No musicians yet.</p>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ day, list }) => (
            <div key={day.id}>
              <h2 className="text-lg font-bold mb-3 text-primary">
                {dayLabel(day)}{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  ({list.length})
                </span>
              </h2>
              {list.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No musicians for this day.
                </p>
              ) : (
                <div className="space-y-3">
                  {list.map((m) =>
                    editing === m.id ? (
                      <MusicianForm
                        key={m.id}
                        days={daysQuery.data ?? []}
                        musician={m}
                        onClose={() => setEditing(null)}
                        onSaved={() => {
                          setEditing(null);
                          invalidate();
                        }}
                      />
                    ) : (
                      <MusicianRowView
                        key={m.id}
                        musician={m}
                        onEdit={() => setEditing(m.id)}
                        onTogglePublish={() =>
                          togglePublished.mutate({
                            id: m.id,
                            isPublished: !m.isPublished,
                          })
                        }
                        onDelete={() => {
                          if (confirm(`Delete musician "${m.nameEn}"?`))
                            deleteRow.mutate(m.id);
                        }}
                      />
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MusicianRowView = ({
  musician,
  onEdit,
  onTogglePublish,
  onDelete,
}: {
  musician: MusicianRow;
  onEdit: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
}) => (
  <div
    className={`bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4 ${
      musician.isPublished ? "" : "opacity-60"
    }`}
  >
    <div className="flex items-center gap-4 min-w-0">
      <img
        src={musician.photoUrl}
        alt={musician.nameEn}
        className="h-16 w-16 object-cover rounded-lg"
      />
      <div className="min-w-0">
        <p className="font-bold truncate">{musician.nameEn}</p>
        {musician.nameSq ? (
          <p className="text-xs text-muted-foreground truncate">
            SQ: {musician.nameSq}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          sort {musician.sortOrder} ·{" "}
          {musician.isPublished ? "published" : "hidden"}
        </p>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={onTogglePublish}
        className="p-2 hover:bg-background rounded-lg"
        title={musician.isPublished ? "Hide from site" : "Show on site"}
      >
        {musician.isPublished ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
      </button>
      <button
        onClick={onEdit}
        className="p-2 hover:bg-background rounded-lg"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const MusicianForm = ({
  musician,
  days,
  onClose,
  onSaved,
}: {
  musician?: MusicianRow;
  days: FestivalDayLite[];
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [festivalDayId, setFestivalDayId] = useState(
    musician?.festivalDayId ?? days[0]?.id ?? "",
  );
  const [nameEn, setNameEn] = useState(musician?.nameEn ?? "");
  const [nameSq, setNameSq] = useState(musician?.nameSq ?? "");
  const [descriptionEn, setDescriptionEn] = useState(
    musician?.descriptionEn ?? "",
  );
  const [descriptionSq, setDescriptionSq] = useState(
    musician?.descriptionSq ?? "",
  );
  const [photoUrl, setPhotoUrl] = useState(musician?.photoUrl ?? "");
  const [sortOrder, setSortOrder] = useState(
    String(musician?.sortOrder ?? 0),
  );
  const [isPublished, setIsPublished] = useState(
    musician?.isPublished ?? true,
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = useMutation({
    mutationFn: musiciansAdminApi.uploadPhoto,
    onSuccess: (publicUrl) => {
      setPhotoUrl(publicUrl);
      setUploadError(null);
    },
    onError: (err: Error) => setUploadError(err.message),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    upload.mutate(file);
  };

  const buildPayload = () => ({
    festivalDayId,
    nameEn,
    nameSq: nameSq.trim() ? nameSq : null,
    descriptionEn: descriptionEn.trim() ? descriptionEn : null,
    descriptionSq: descriptionSq.trim() ? descriptionSq : null,
    photoUrl,
    sortOrder: parseInt(sortOrder, 10) || 0,
    isPublished,
  });

  const create = useMutation({
    mutationFn: () => musiciansAdminApi.create(buildPayload()),
    onSuccess: () => {
      onSaved();
      onClose();
    },
    onError: (err: Error) => alert(err.message),
  });

  const update = useMutation({
    mutationFn: () => musiciansAdminApi.update(musician!.id, buildPayload()),
    onSuccess: () => {
      onSaved();
      onClose();
    },
    onError: (err: Error) => alert(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (musician) update.mutate();
    else create.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-2 border-primary rounded-xl p-5 mb-4 space-y-3"
    >
      <div>
        <label className="text-xs text-muted-foreground block mb-1">
          Festival day
        </label>
        <select
          required
          value={festivalDayId}
          onChange={(e) => setFestivalDayId(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg"
        >
          {days.map((d) => (
            <option key={d.id} value={d.id}>
              {dayLabel(d)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <input
          required
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="Name (EN)"
          className="px-4 py-2 bg-background border border-border rounded-lg"
        />
        <input
          value={nameSq}
          onChange={(e) => setNameSq(e.target.value)}
          placeholder="Name (SQ) — optional"
          className="px-4 py-2 bg-background border border-border rounded-lg"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <textarea
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
          placeholder="Description (EN) — optional"
          rows={4}
          className="px-4 py-2 bg-background border border-border rounded-lg"
        />
        <textarea
          value={descriptionSq}
          onChange={(e) => setDescriptionSq(e.target.value)}
          placeholder="Description (SQ) — optional"
          rows={4}
          className="px-4 py-2 bg-background border border-border rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={upload.isPending}
          className="w-full bg-primary/10 border-2 border-dashed border-primary text-primary rounded-lg flex items-center justify-center gap-2 hover:bg-primary/20 transition-all px-4 py-3 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {upload.isPending
            ? "Uploading…"
            : photoUrl
              ? "Replace photo"
              : "Upload photo"}
        </button>
        {uploadError ? (
          <p className="text-xs text-destructive">{uploadError}</p>
        ) : null}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="cover preview"
            className="h-40 max-w-full object-cover rounded-lg border border-border mx-auto"
          />
        ) : null}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          placeholder="Sort order"
          className="px-4 py-2 bg-background border border-border rounded-lg"
        />
        <label className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <span className="text-sm">Show on public site</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={
            !photoUrl ||
            !festivalDayId ||
            create.isPending ||
            update.isPending
          }
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {musician ? "Update" : "Create"}
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
