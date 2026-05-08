"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Pencil, Pin, Plus, Trash2 } from "lucide-react";
import {
  newsAdminApi,
  type NewsRow,
} from "../lib/news-api";

export const AdminNewsPage = () => {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const newsQuery = useQuery({
    queryKey: ["admin", "news"],
    queryFn: newsAdminApi.list,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "news"] });
    queryClient.invalidateQueries({ queryKey: ["news"] });
  };

  const deleteRow = useMutation({
    mutationFn: newsAdminApi.delete,
    onSuccess: invalidate,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">News</h1>
          <p className="text-muted-foreground">
            Posts shown on the public News page.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> New post
        </button>
      </div>

      {showAdd ? (
        <NewsForm
          onClose={() => setShowAdd(false)}
          onSaved={invalidate}
        />
      ) : null}

      {newsQuery.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (newsQuery.data ?? []).length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {(newsQuery.data ?? []).map((post) =>
            editing === post.id ? (
              <NewsForm
                key={post.id}
                post={post}
                onClose={() => setEditing(null)}
                onSaved={() => {
                  setEditing(null);
                  invalidate();
                }}
              />
            ) : (
              <div
                key={post.id}
                className="bg-card border border-border rounded-xl p-5 flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {post.pinned ? (
                      <Pin className="w-4 h-4 text-primary" />
                    ) : null}
                    <h3 className="font-bold text-lg">{post.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {post.slug} ·{" "}
                    {new Date(post.publishedAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.body}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(post.id)}
                    className="p-2 hover:bg-background rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${post.title}"?`))
                        deleteRow.mutate(post.id);
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

const NewsForm = ({
  post,
  onClose,
  onSaved,
}: {
  post?: NewsRow;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [title, setTitle] = useState(post?.title ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");
  const [pinned, setPinned] = useState(post?.pinned ?? false);

  const create = useMutation({
    mutationFn: newsAdminApi.create,
    onSuccess: () => {
      onSaved();
      onClose();
    },
    onError: (err: Error) => alert(err.message),
  });

  const update = useMutation({
    mutationFn: () =>
      newsAdminApi.update(post!.id, {
        slug,
        title,
        body,
        imageUrl: imageUrl || null,
        pinned,
      }),
    onSuccess: () => {
      onSaved();
      onClose();
    },
    onError: (err: Error) => alert(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (post) update.mutate();
    else
      create.mutate({
        slug,
        title,
        body,
        imageUrl: imageUrl || null,
        pinned,
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-2 border-primary rounded-xl p-5 mb-6 space-y-3"
    >
      <div className="grid md:grid-cols-2 gap-3">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="px-4 py-2 bg-background border border-border rounded-lg"
        />
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug-like-this"
          className="px-4 py-2 bg-background border border-border rounded-lg"
        />
      </div>
      <textarea
        required
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Body"
        rows={6}
        className="w-full px-4 py-2 bg-background border border-border rounded-lg"
      />
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Cover image URL (optional)"
        className="w-full px-4 py-2 bg-background border border-border rounded-lg"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={pinned}
          onChange={(e) => setPinned(e.target.checked)}
        />
        Pin to top
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={create.isPending || update.isPending}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold"
        >
          {post ? "Update" : "Publish"}
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
