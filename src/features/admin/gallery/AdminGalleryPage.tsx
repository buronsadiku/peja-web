"use client";

import { useRef, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Plus, Trash2, Upload } from "lucide-react";
import {
  adminApi,
  type GalleryRow,
  type GallerySection,
} from "../lib/admin-api";

const sections: GallerySection[] = ["live", "workshops", "adventures", "food"];

export const AdminGalleryPage = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);

  const galleryQuery = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: adminApi.gallery.list,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
    queryClient.invalidateQueries({ queryKey: ["gallery"] });
  };

  const deleteImage = useMutation({
    mutationFn: adminApi.gallery.delete,
    onSuccess: invalidate,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Gallery</h1>
          <p className="text-muted-foreground">
            Manage festival photos by section.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      {showAdd ? (
        <GalleryForm onClose={() => setShowAdd(false)} onSaved={invalidate} />
      ) : null}

      {galleryQuery.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-10">
          {sections.map((section) => {
            const items = (galleryQuery.data ?? []).filter(
              (i) => i.section === section,
            );
            return (
              <div key={section}>
                <h2 className="text-xl font-bold capitalize mb-4">
                  {section}{" "}
                  <span className="text-sm text-muted-foreground font-normal">
                    ({items.length})
                  </span>
                </h2>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No images in this section.
                  </p>
                ) : (
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
                )}
              </div>
            );
          })}
        </div>
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
        <input
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="…or paste an image URL"
          className={`w-full px-3 py-2 bg-background border border-border rounded-lg ${inline ? "text-xs" : ""}`}
        />
      </div>
      <div className={`grid ${inline ? "" : "md:grid-cols-2"} gap-2`}>
        <input
          required
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Alt text"
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
          disabled={create.isPending || update.isPending}
          className={`bg-primary text-primary-foreground rounded-lg font-bold ${inline ? "text-xs px-3 py-1.5" : "px-4 py-2"}`}
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
