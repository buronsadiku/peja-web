"use client";

import { useRef, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import {
  communitiesAdminApi,
  type CommunityRow,
} from "../lib/news-api";

export const AdminCommunityPage = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["admin", "communities"],
    queryFn: communitiesAdminApi.list,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "communities"] });
    queryClient.invalidateQueries({ queryKey: ["communities"] });
  };

  const deleteRow = useMutation({
    mutationFn: communitiesAdminApi.delete,
    onSuccess: invalidate,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Community</h1>
          <p className="text-muted-foreground">
            Clubs and partners shown on the public Community page.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> New community
        </button>
      </div>

      {showAdd ? (
        <CommunityForm
          onClose={() => setShowAdd(false)}
          onSaved={invalidate}
        />
      ) : null}

      {query.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (query.data ?? []).length === 0 ? (
        <p className="text-muted-foreground">No communities yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(query.data ?? []).map((row) =>
            editing === row.id ? (
              <div key={row.id} className="sm:col-span-2 lg:col-span-3">
                <CommunityForm
                  community={row}
                  onClose={() => setEditing(null)}
                  onSaved={() => {
                    setEditing(null);
                    invalidate();
                  }}
                />
              </div>
            ) : (
              <CommunityCard
                key={row.id}
                row={row}
                onEdit={() => setEditing(row.id)}
                onDelete={() => {
                  if (confirm(`Delete community "${row.name}"?`))
                    deleteRow.mutate(row.id);
                }}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
};

const CommunityCard = ({
  row,
  onEdit,
  onDelete,
}: {
  row: CommunityRow;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="bg-card border border-border rounded-xl p-4">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 rounded-lg bg-background border border-border overflow-hidden flex-shrink-0">
        <img
          src={row.logoUrl}
          alt={row.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate">{row.name}</p>
        <p className="text-xs text-muted-foreground">
          Sort #{row.sortOrder}
        </p>
      </div>
    </div>
    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
      {row.descriptionEn}
    </p>
    {row.descriptionSq ? (
      <p className="text-xs text-muted-foreground italic line-clamp-2 mb-3">
        SQ: {row.descriptionSq}
      </p>
    ) : null}
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="text-xs px-3 py-1 bg-background border border-border rounded-md hover:border-primary flex items-center gap-1"
      >
        <Pencil className="w-3 h-3" /> Edit
      </button>
      <button
        onClick={onDelete}
        className="text-xs px-3 py-1 bg-destructive/10 text-destructive border border-destructive rounded-md flex items-center gap-1"
      >
        <Trash2 className="w-3 h-3" /> Delete
      </button>
    </div>
  </div>
);

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const CommunityForm = ({
  community,
  onClose,
  onSaved,
}: {
  community?: CommunityRow;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [name, setName] = useState(community?.name ?? "");
  const [slug, setSlug] = useState(community?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!community);
  const [logoUrl, setLogoUrl] = useState(community?.logoUrl ?? "");
  const [descriptionEn, setDescriptionEn] = useState(
    community?.descriptionEn ?? "",
  );
  const [descriptionSq, setDescriptionSq] = useState(
    community?.descriptionSq ?? "",
  );
  const [sortOrder, setSortOrder] = useState(
    String(community?.sortOrder ?? 0),
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onNameChange = (v: string) => {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const upload = useMutation({
    mutationFn: communitiesAdminApi.uploadLogo,
    onSuccess: (url) => {
      setLogoUrl(url);
      setUploadError(null);
    },
    onError: (err: Error) => setUploadError(err.message),
  });

  const create = useMutation({
    mutationFn: communitiesAdminApi.create,
    onSuccess: () => {
      onSaved();
      onClose();
    },
    onError: (err: Error) => alert(err.message),
  });

  const update = useMutation({
    mutationFn: () =>
      communitiesAdminApi.update(community!.id, {
        name,
        slug,
        logoUrl,
        descriptionEn,
        descriptionSq: descriptionSq || null,
        sortOrder: parseInt(sortOrder, 10) || 0,
      }),
    onSuccess: () => {
      onSaved();
      onClose();
    },
    onError: (err: Error) => alert(err.message),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    upload.mutate(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (community) update.mutate();
    else
      create.mutate({
        name,
        slug,
        logoUrl,
        descriptionEn,
        descriptionSq: descriptionSq || null,
        sortOrder: parseInt(sortOrder, 10) || 0,
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-2 border-primary rounded-xl p-5 mb-6 space-y-4"
    >
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
          className="w-full bg-primary/10 border-2 border-dashed border-primary text-primary rounded-lg px-4 py-3 flex items-center justify-center gap-2 hover:bg-primary/20 transition-all disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {upload.isPending
            ? "Uploading…"
            : logoUrl
              ? "Replace logo"
              : "Upload logo"}
        </button>
        {uploadError ? (
          <p className="text-xs text-destructive">{uploadError}</p>
        ) : null}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="logo preview"
            className="w-24 h-24 object-cover rounded-lg border border-border"
          />
        ) : null}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs uppercase text-muted-foreground tracking-wider font-bold">
            Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Community name"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase text-muted-foreground tracking-wider font-bold">
            Slug · URL
          </label>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="slug-like-this"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg font-mono text-sm"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs uppercase text-muted-foreground tracking-wider font-bold">
          Sort order
        </label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-32 px-4 py-2 bg-background border border-border rounded-lg"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs uppercase text-muted-foreground tracking-wider font-bold">
            Description · English (required)
          </label>
          <textarea
            required
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            rows={5}
            placeholder="Description in English"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase text-muted-foreground tracking-wider font-bold">
            Description · Albanian (optional)
          </label>
          <textarea
            value={descriptionSq}
            onChange={(e) => setDescriptionSq(e.target.value)}
            rows={5}
            placeholder="Përshkrimi në shqip"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={
            !logoUrl ||
            !name ||
            !slug ||
            !descriptionEn ||
            create.isPending ||
            update.isPending
          }
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {community ? "Update" : "Create"}
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
