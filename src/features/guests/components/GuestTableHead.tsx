"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@peja/ui/components/Checkbox";

type GuestTableHeadProps = {
  allSelected: boolean;
  onToggleAll: () => void;
};

export const GuestTableHead = ({
  allSelected,
  onToggleAll,
}: GuestTableHeadProps) => {
  const t = useTranslations();
  const columns = [
    t("guests__table__col_guest"),
    t("guests__table__col_messages"),
    t("guests__table__col_status"),
    t("guests__table__col_last_seen"),
    "",
  ];
  return (
    <div className="border-border bg-background grid grid-cols-[28px_minmax(220px,1.4fr)_120px_140px_180px_36px] items-center gap-3.5 border-b px-6 py-3">
      <Checkbox
        checked={allSelected}
        onChange={onToggleAll}
        aria-label={t("guests__select_all")}
      />
      {columns.map((col, i) => (
        <div
          key={`${col}-${i}`}
          className="type-overline text-muted-foreground"
        >
          {col}
        </div>
      ))}
    </div>
  );
};
