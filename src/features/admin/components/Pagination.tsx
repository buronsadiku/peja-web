"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (next: number) => void;
};

export const Pagination = ({
  page,
  totalPages,
  total,
  limit,
  onChange,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return (
      <p className="text-sm text-muted-foreground">{total} total</p>
    );
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <p className="text-sm text-muted-foreground">
        {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg bg-card border border-border hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg bg-card border border-border hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
