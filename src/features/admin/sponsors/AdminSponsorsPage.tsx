"use client";

import { useRef, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import {
  sponsorsAdminApi,
  type SponsorRow,
} from "../lib/news-api";
import { adminApi } from "../lib/admin-api";

const tiers: SponsorRow["tier"][] = ["gold", "silver", "bronze"];

export const AdminSponsorsPage = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const sponsorsQuery = useQuery({
    queryKey: ["admin", "sponsors"],
    queryFn: sponsorsAdminApi.list,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "sponsors"] });
    queryClient.invalidateQueries({ queryKey: ["sponsors"] });
  };

  const deleteRow = useMutation({
    mutationFn: sponsorsAdminApi.delete,
    onSuccess: invalidate,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Sponsors</h1>
          <p className="text-muted-foreground">
            Logos shown on the public homepage.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> New sponsor
        </button>
      </div>

      {showAdd ? (
        <SponsorForm
          onClose={() => setShowAdd(false)}
          onSaved={invalidate}
        />
      ) : null}

      {sponsorsQuery.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (sponsorsQuery.data ?? []).length === 0 ? (
        <p className="text-muted-foreground">No sponsors yet.</p>
      ) : (
        <div className="space-y-3">
          {(sponsorsQuery.data ?? []).map((s) =>
            editing === s.id ? (
              <SponsorForm
                key={s.id}
                sponsor={s}
                onClose={() => setEditing(null)}
                onSaved={() => {
                  setEditing(null);
                  invalidate();
                }}
              />
            ) : (
              <div
                key={s.id}
                className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={s.logoUrl}
                    alt={s.name}
                    className="h-12 w-auto object-contain bg-white/5 rounded p-1"
                  />
                  <div>
                    <p className="font-bold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="uppercase">{s.tier}</span> · sort{" "}
                      {s.sortOrder}
                    </p>
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline truncate max-w-md inline-block"
                      >
                        {s.url}
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(s.id)}
                    className="p-2 hover:bg-background rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete sponsor "${s.name}"?`))
                        deleteRow.mutate(s.id);
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

const SponsorForm = ({
  sponsor,
  onClose,
  onSaved,
}: {
  sponsor?: SponsorRow;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [name, setName] = useState(sponsor?.name ?? "");
  const [logoUrl, setLogoUrl] = useState(sponsor?.logoUrl ?? "");
  const [url, setUrl] = useState(sponsor?.url ?? "");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = useMutation({
    mutationFn: adminApi.uploadImage,
    onSuccess: (publicUrl) => {
      setLogoUrl(publicUrl);
      setUploadError(null);
    },
    onError: (err: Error) => setUploadError(err.message),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    upload.mutate(file);
  };
  const [tier, setTier] = useState<SponsorRow["tier"]>(
    sponsor?.tier ?? "bronze",
  );
  const [sortOrder, setSortOrder] = useState(
    String(sponsor?.sortOrder ?? 0),
  );

  const create = useMutation({
    mutationFn: sponsorsAdminApi.create,
    onSuccess: () => {
      onSaved();
      onClose();
    },
    onError: (err: Error) => alert(err.message),
  });

  const update = useMutation({
    mutationFn: () =>
      sponsorsAdminApi.update(sponsor!.id, {
        name,
        logoUrl,
        url: url || null,
        tier,
        sortOrder: parseInt(sortOrder, 10) || 0,
      }),
    onSuccess: () => {
      onSaved();
      onClose();
    },
    onError: (err: Error) => alert(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      name,
      logoUrl,
      url: url || null,
      tier,
      sortOrder: parseInt(sortOrder, 10) || 0,
    };
    if (sponsor) update.mutate();
    else create.mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-2 border-primary rounded-xl p-5 mb-4 space-y-3"
    >
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full px-4 py-2 bg-background border border-border rounded-lg"
      />

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
            className="h-20 max-w-full object-contain bg-white/5 rounded-lg border border-border p-2 mx-auto"
          />
        ) : null}
      </div>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Website URL (optional)"
        className="w-full px-4 py-2 bg-background border border-border rounded-lg"
      />
      <div className="grid md:grid-cols-2 gap-3">
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as SponsorRow["tier"])}
          className="px-4 py-2 bg-background border border-border rounded-lg"
        >
          {tiers.map((t) => (
            <option key={t} value={t}>
              {t.toUpperCase()}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          placeholder="Sort order"
          className="px-4 py-2 bg-background border border-border rounded-lg"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!logoUrl || create.isPending || update.isPending}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sponsor ? "Update" : "Create"}
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
