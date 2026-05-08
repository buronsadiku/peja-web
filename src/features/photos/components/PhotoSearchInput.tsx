"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchIcon } from "@peja/icons/SearchIcon";
import { XIcon } from "@peja/icons/XIcon";
import { usePhotoSearch, usePhotosStore } from "../store/usePhotosStore";

export const PhotoSearchInput = () => {
  const t = useTranslations();
  const search = usePhotoSearch();
  const setSearch = usePhotosStore((s) => s.setSearch);
  const [draft, setDraft] = useState(search);

  useEffect(() => {
    if (draft === search) return;
    const id = window.setTimeout(() => {
      setSearch(draft);
    }, 300);
    return () => window.clearTimeout(id);
  }, [draft, search, setSearch]);

  return (
    <div className="rounded-10 border-border bg-background flex flex-1 items-center gap-2.5 border px-3.5 py-2.5">
      <SearchIcon
        width={15}
        height={15}
        className="text-muted-foreground"
        strokeWidth={1.7}
      />
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={t("photos__toolbar__search_placeholder")}
        className="type-body-small text-foreground placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
      />
      {draft.length > 0 ? (
        <button
          type="button"
          onClick={() => setDraft("")}
          aria-label={t("photos__toolbar__search_clear")}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <XIcon width={12} height={12} strokeWidth={1.7} />
        </button>
      ) : (
        <kbd className="rounded-4 border-border bg-card type-caption text-muted-foreground border px-1.5 py-0.5">
          ⌘K
        </kbd>
      )}
    </div>
  );
};
