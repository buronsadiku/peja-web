"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FilterTab } from "./FilterTab";

const FILTER_KEYS = [
  "keepsakes__filter__all",
  "keepsakes__filter__printed",
  "keepsakes__filter__digital",
  "keepsakes__filter__physical",
  "keepsakes__filter__gifts",
];

type FilterTabsProps = {
  onChange?: (filter: string) => void;
};

export const FilterTabs = ({ onChange }: FilterTabsProps) => {
  const t = useTranslations();
  const [activeKey, setActiveKey] = useState(FILTER_KEYS[0]);

  const handleClick = (key: string) => {
    setActiveKey(key);
    onChange?.(t(key));
  };

  return (
    <div className="flex gap-1.5 overflow-auto">
      {FILTER_KEYS.map((key) => (
        <FilterTab
          key={key}
          label={t(key)}
          active={activeKey === key}
          onClick={() => handleClick(key)}
        />
      ))}
    </div>
  );
};
