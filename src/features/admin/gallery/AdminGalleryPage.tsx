"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Images, Plus, Trash2, Upload } from "lucide-react";
import {
  adminApi,
  type GalleryRow,
  type GallerySection,
} from "../lib/admin-api";

const PAGE_LIMIT = 20;

const sections: GallerySection[] = ["live", "workshops", "adventures", "food"];

type SectionFilter = "all" | GallerySection;

const sectionFilters: { value: SectionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "workshops", label: "Workshops" },
  { value: "adventures", label: "Adventures" },
  { value: "food", label: "Food & Wine" },
];

export const AdminGalleryPage = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [filter, setFilter] = useState<SectionFilter>("all");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const galleryQuery = useInfiniteQuery({
    queryKey: ["admin", "gallery", filter],
    queryFn: ({ pageParam }) =>
      adminApi.gallery.list({
        page: pageParam,
        limit: PAGE_LIMIT,
        section: filter === "all" ? undefined : filter,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const items = useMemo<GalleryRow[]>(
    () => galleryQuery.data?.pages.flatMap((p) => p.data) ?? [],
    [galleryQuery.data],
  );

  const total = galleryQuery.data?.pages[0]?.pagination.total ?? 0;

  const handleFilterChange = (next: SectionFilter) => {
    setFilter(next);
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
    queryClient.invalidateQueries({ queryKey: ["gallery"] });
  };

  const deleteImage = useMutation({
    mutationFn: adminApi.gallery.delete,
    onSuccess: invalidate,
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          galleryQuery.hasNextPage &&
          !galleryQuery.isFetchingNextPage
        ) {
          galleryQuery.fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [galleryQuery]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Gallery</h1>
          <p className="text-muted-foreground">
            Manage festival photos by section.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulk(true)}
            className="bg-card border border-border text-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:border-primary"
          >
            <Images className="w-4 h-4" /> Bulk Upload
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>
      </div>

      {showAdd ? (
        <GalleryForm onClose={() => setShowAdd(false)} onSaved={invalidate} />
      ) : null}

      {showBulk ? (
        <BulkUploadForm
          onClose={() => setShowBulk(false)}
          onSaved={invalidate}
        />
      ) : null}

      <div className="flex flex-wrap gap-2 mb-6">
        {sectionFilters.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {galleryQuery.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">
          No images in this section yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onDelete={() => {
                  if (confirm("Delete this image?"))
                    deleteImage.mutate(item.id);
                }}
                onUpdated={invalidate}
              />
            ))}
          </div>

          <div ref={sentinelRef} className="h-10" />

          {galleryQuery.isFetchingNextPage ? (
            <p className="text-center text-muted-foreground py-6 text-sm">
              Loading more…
            </p>
          ) : !galleryQuery.hasNextPage ? (
            <p className="text-center text-muted-foreground py-6 text-sm">
              Showing all {total} photos
            </p>
          ) : null}
        </>
      )}
    </div>
  );
};

const GalleryCard = ({
  item,
  onDelete,
  onUpdated,
}: {
  item: GalleryRow;
  onDelete: () => void;
  onUpdated: () => void;
}) => {
  const [editing, setEditing] = useState(false);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <img src={item.url} alt={item.alt} className="w-full h-40 object-cover" />
      <div className="p-3">
        {editing ? (
          <GalleryForm
            item={item}
            inline
            onClose={() => setEditing(false)}
            onSaved={() => {
              setEditing(false);
              onUpdated();
            }}
          />
        ) : (
          <>
            <p className="text-sm font-bold truncate">
              {item.title ?? item.alt}
            </p>
            <p className="text-xs text-muted-foreground truncate mb-2">
              {item.caption ?? ""}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="text-xs px-3 py-1 bg-background border border-border rounded-md hover:border-primary"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="text-xs px-3 py-1 bg-destructive/10 text-destructive border border-destructive rounded-md flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const GalleryForm = ({
  item,
  inline,
  onClose,
  onSaved,
}: {
  item?: GalleryRow;
  inline?: boolean;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [url, setUrl] = useState(item?.url ?? "");
  const [alt, setAlt] = useState(item?.alt ?? "");
  const [title, setTitle] = useState(item?.title ?? "");
  const [caption, setCaption] = useState(item?.caption ?? "");
  const [section, setSection] = useState<GallerySection>(item?.section ?? "live");
  const [sortOrder, setSortOrder] = useState(String(item?.sortOrder ?? 0));
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = useMutation({
    mutationFn: adminApi.uploadImage,
    onSuccess: (publicUrl) => {
      setUrl(publicUrl);
      setUploadError(null);
    },
    onError: (err: Error) => {
      setUploadError(err.message);
    },
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!alt) setAlt(file.name.replace(/\.[^.]+$/, ""));
    upload.mutate(file);
  };

  const create = useMutation({
    mutationFn: adminApi.gallery.create,
    onSuccess: onSaved,
  });
  const update = useMutation({
    mutationFn: ({ id, ...rest }: { id: string } & Partial<GalleryRow>) =>
      adminApi.gallery.update(id, rest),
    onSuccess: onSaved,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      url,
      alt,
      title: title || null,
      caption: caption || null,
      section,
      sortOrder: parseInt(sortOrder, 10) || 0,
    };
    if (item) {
      update.mutate({ id: item.id, ...payload });
    } else {
      create.mutate(payload);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${
        inline
          ? "space-y-2"
          : "bg-card border-2 border-primary rounded-xl p-5 mb-6 space-y-3"
      }`}
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
          className={`w-full bg-primary/10 border-2 border-dashed border-primary text-primary rounded-lg flex items-center justify-center gap-2 hover:bg-primary/20 transition-all ${inline ? "px-3 py-2 text-xs" : "px-4 py-3"} disabled:opacity-50`}
        >
          <Upload className={inline ? "w-3 h-3" : "w-4 h-4"} />
          {upload.isPending
            ? "Uploading…"
            : url
              ? "Replace image"
              : "Upload image"}
        </button>
        {uploadError ? (
          <p className="text-xs text-destructive">{uploadError}</p>
        ) : null}
        {url ? (
          <img
            src={url}
            alt="preview"
            className="w-full max-h-40 object-cover rounded-lg border border-border"
          />
        ) : null}
      </div>
      <div className={`grid ${inline ? "" : "md:grid-cols-2"} gap-2`}>
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Alt text (optional)"
          className={`px-3 py-2 bg-background border border-border rounded-lg ${inline ? "text-xs" : ""}`}
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className={`px-3 py-2 bg-background border border-border rounded-lg ${inline ? "text-xs" : ""}`}
        />
      </div>
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption"
        className={`w-full px-3 py-2 bg-background border border-border rounded-lg ${inline ? "text-xs" : ""}`}
      />
      <div className={`grid ${inline ? "grid-cols-2" : "md:grid-cols-2"} gap-2`}>
        <select
          value={section}
          onChange={(e) => setSection(e.target.value as GallerySection)}
          className={`px-3 py-2 bg-background border border-border rounded-lg ${inline ? "text-xs" : ""}`}
        >
          {sections.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          placeholder="Sort order"
          className={`px-3 py-2 bg-background border border-border rounded-lg ${inline ? "text-xs" : ""}`}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!url || create.isPending || update.isPending}
          className={`bg-primary text-primary-foreground rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed ${inline ? "text-xs px-3 py-1.5" : "px-4 py-2"}`}
        >
          {item ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className={`bg-background border border-border rounded-lg ${inline ? "text-xs px-3 py-1.5" : "px-4 py-2"}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

type BulkFile = {
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

const BulkUploadForm = ({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [files, setFiles] = useState<BulkFile[]>([]);
  const [section, setSection] = useState<GallerySection>("live");
  const [running, setRunning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).filter((f) =>
      f.type.startsWith("image/"),
    );
    setFiles(picked.map((file) => ({ file, status: "pending" })));
  };

  const startUpload = async () => {
    if (files.length === 0 || running) return;
    setRunning(true);

    for (let i = 0; i < files.length; i++) {
      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" } : f)),
      );
      try {
        const url = await adminApi.uploadImage(files[i].file);
        await adminApi.gallery.create({
          url,
          alt: files[i].file.name.replace(/\.[^.]+$/, ""),
          section,
          sortOrder: i,
        });
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "done" } : f)),
        );
      } catch (err) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? {
                  ...f,
                  status: "error",
                  error: err instanceof Error ? err.message : String(err),
                }
              : f,
          ),
        );
      }
    }

    setRunning(false);
    onSaved();
  };

  const allDone = files.length > 0 && files.every((f) => f.status === "done");
  const anyError = files.some((f) => f.status === "error");
  const doneCount = files.filter((f) => f.status === "done").length;

  return (
    <div className="bg-card border-2 border-primary rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Bulk upload</h2>

      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <select
          value={section}
          onChange={(e) => setSection(e.target.value as GallerySection)}
          disabled={running}
          className="px-4 py-2 bg-background border border-border rounded-lg disabled:opacity-50"
        >
          {sections.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onPick}
          disabled={running}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={running}
          className="bg-primary/10 border-2 border-dashed border-primary text-primary px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/20 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {files.length > 0 ? `${files.length} files selected` : "Pick images"}
        </button>
      </div>

      {files.length > 0 ? (
        <div className="bg-background border border-border rounded-lg max-h-80 overflow-y-auto">
          {files.map((f, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-2 border-b border-border last:border-0"
            >
              <span className="text-sm truncate flex-1">{f.file.name}</span>
              <span
                className={`text-xs font-bold uppercase ml-3 ${
                  f.status === "done"
                    ? "text-primary"
                    : f.status === "error"
                      ? "text-destructive"
                      : f.status === "uploading"
                        ? "text-primary animate-pulse"
                        : "text-muted-foreground"
                }`}
              >
                {f.status === "error" ? f.error ?? "error" : f.status}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          {running
            ? `Uploading ${doneCount}/${files.length}…`
            : allDone
              ? `Uploaded ${doneCount}${anyError ? " (some failed)" : ""}.`
              : files.length > 0
                ? `${files.length} ready`
                : "Pick files to upload."}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={startUpload}
            disabled={files.length === 0 || running || allDone}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? "Uploading…" : allDone ? "Done" : "Start upload"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={running}
            className="bg-background border border-border px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
