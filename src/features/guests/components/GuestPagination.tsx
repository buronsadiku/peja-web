"use client";

import { useTranslations } from "next-intl";
import { ChevronLeftIcon } from "@peja/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@peja/icons/ChevronRightIcon";
import { GuestPageButton } from "./GuestPageButton";

type GuestPaginationProps = {
  current: number;
  totalPages: number;
  showing: number;
  total: number;
  onPageChange: (page: number) => void;
};

const buildPages = (current: number, totalPages: number): (number | "…")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("…");
  pages.push(totalPages);
  return pages;
};

export const GuestPagination = ({
  current,
  totalPages,
  showing,
  total,
  onPageChange,
}: GuestPaginationProps) => {
  const t = useTranslations();
  const safeTotalPages = Math.max(totalPages, 1);
  const pages = buildPages(current, safeTotalPages);
  const canPrev = current > 1;
  const canNext = current < safeTotalPages;

  return (
    <div className="border-border bg-background tablet:flex-row tablet:items-center flex flex-col gap-3 border-t px-6 py-3.5">
      <span className="type-caption text-muted-foreground">
        {t("guests__pagination__showing", { showing, total })}
      </span>
      <div className="tablet:ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => canPrev && onPageChange(current - 1)}
          disabled={!canPrev}
          aria-label={t("guests__pagination__prev")}
          className="border-border bg-card text-foreground flex size-7.5 items-center justify-center rounded-8 border disabled:opacity-40 not-disabled:cursor-pointer"
        >
          <ChevronLeftIcon width={14} height={14} />
        </button>
        {pages.map((page, i) => (
          <GuestPageButton
            key={`${page}-${i}`}
            label={String(page)}
            active={page === current}
            disabled={page === "…"}
            onClick={() =>
              typeof page === "number" ? onPageChange(page) : undefined
            }
          />
        ))}
        <button
          type="button"
          onClick={() => canNext && onPageChange(current + 1)}
          disabled={!canNext}
          aria-label={t("guests__pagination__next")}
          className="border-border bg-card text-foreground flex size-7.5 items-center justify-center rounded-8 border disabled:opacity-40 not-disabled:cursor-pointer"
        >
          <ChevronRightIcon width={14} height={14} />
        </button>
        <span className="type-caption text-muted-foreground ml-2">
          {t("guests__pagination__page_of", {
            current,
            total: safeTotalPages,
          })}
        </span>
      </div>
    </div>
  );
};
