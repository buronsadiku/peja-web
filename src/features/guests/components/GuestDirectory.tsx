"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { DownloadIcon } from "@peja/icons/DownloadIcon";
import {
  applyGuestFilter,
  applyGuestSearch,
  applyGuestSort,
  type GuestRow as GuestRowData,
} from "../adapters";
import {
  useGuestFilter,
  useGuestPage,
  useGuestSearch,
  useGuestSelectedIds,
  useGuestSort,
  useGuestsStore,
} from "../store/useGuestsStore";
import { useGuestCsvExport } from "../hooks/useGuestCsvExport";
import { GuestFilterChips } from "./GuestFilterChips";
import { GuestPagination } from "./GuestPagination";
import { GuestRow } from "./GuestRow";
import { GuestSearchInput } from "./GuestSearchInput";
import { GuestSortButton } from "./GuestSortButton";
import { GuestTableHead } from "./GuestTableHead";

const PAGE_SIZE = 10;

type GuestDirectoryProps = {
  guests: GuestRowData[];
  isPending: boolean;
  isError: boolean;
  isFetchingAll: boolean;
};

export const GuestDirectory = ({
  guests,
  isPending,
  isError,
  isFetchingAll,
}: GuestDirectoryProps) => {
  const t = useTranslations();
  const filter = useGuestFilter();
  const sort = useGuestSort();
  const search = useGuestSearch();
  const page = useGuestPage();
  const selectedIds = useGuestSelectedIds();
  const setFilter = useGuestsStore((s) => s.setFilter);
  const setPage = useGuestsStore((s) => s.setPage);
  const toggleSelected = useGuestsStore((s) => s.toggleSelected);
  const selectAll = useGuestsStore((s) => s.selectAll);
  const clearSelection = useGuestsStore((s) => s.clearSelection);

  const filtered = useMemo(() => {
    const f = applyGuestFilter(guests, filter);
    const s = applyGuestSearch(f, search);
    return applyGuestSort(s, sort);
  }, [guests, filter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pageGuests = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const allSelected =
    pageGuests.length > 0 && pageGuests.every((g) => selectedIds.has(g.id));

  const handleToggleAll = () => {
    if (allSelected) clearSelection();
    else selectAll(pageGuests.map((g) => g.id));
  };

  const { exportCsv, isExporting } = useGuestCsvExport();

  const renderBody = () => {
    if (isPending) {
      return (
        <p className="type-body-small text-muted-foreground p-8 text-center">
          {t("common__loading")}
        </p>
      );
    }
    if (isError) {
      return (
        <p className="type-body-small text-destructive p-8 text-center">
          {t("common__error")}
        </p>
      );
    }
    if (filtered.length === 0) {
      const empty = search.trim()
        ? t("guests__directory__no_search_results", { query: search })
        : t("guests__directory__empty_body");
      return (
        <p className="type-body-small text-muted-foreground p-8 text-center">
          {empty}
        </p>
      );
    }
    return pageGuests.map((guest, i) => (
      <GuestRow
        key={guest.id}
        guest={guest}
        selected={selectedIds.has(guest.id)}
        onToggleSelect={() => toggleSelected(guest.id)}
        isLast={i === pageGuests.length - 1}
      />
    ));
  };

  return (
    <div className="flex flex-col gap-4">
      <GuestFilterChips
        guests={guests}
        active={filter}
        onSelect={setFilter}
      />
      <div className="rounded-16 border-border bg-card flex flex-col overflow-hidden border">
        <div className="border-border tablet:flex-row tablet:items-center flex flex-col gap-3 border-b px-6 py-4">
          <div className="type-body font-serif font-semibold">
            {t("guests__directory__title")}{" "}
            <span className="type-body-small text-muted-foreground font-medium">
              {t("guests__directory__showing_count", {
                count: filtered.length,
              })}
            </span>
            {isFetchingAll && (
              <span className="type-caption text-muted-foreground ml-2">
                {t("guests__directory__loading_all")}
              </span>
            )}
          </div>
          <div className="tablet:ml-auto flex flex-wrap items-center gap-2">
            <GuestSearchInput />
            <GuestSortButton />
            <Button
              size="sm"
              className="rounded-full"
              disabled={filtered.length === 0 || isExporting}
              onClick={() => exportCsv(filtered)}
            >
              <DownloadIcon width={13} height={13} />
              {t("guests__directory__export")}
            </Button>
          </div>
        </div>
        {filtered.length > 0 && (
          <GuestTableHead
            allSelected={allSelected}
            onToggleAll={handleToggleAll}
          />
        )}
        <div className="min-h-160">{renderBody()}</div>
        <GuestPagination
          current={safePage}
          totalPages={totalPages}
          showing={pageGuests.length}
          total={filtered.length}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
