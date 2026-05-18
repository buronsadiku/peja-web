"use client";

import { useTranslations } from "next-intl";

export type DateOpts = {
  weekday?: "long" | "short";
  month?: "long" | "short" | "numeric";
  day?: "numeric";
  year?: "numeric";
};

export const useFormatDate = () => {
  const t = useTranslations("dates");

  const weekdaysLong = t("weekdays_long").split("|");
  const weekdaysShort = t("weekdays_short").split("|");
  const monthsLong = t("months_long").split("|");
  const monthsShort = t("months_short").split("|");

  return (input: Date | string, opts: DateOpts = {}): string => {
    const d = typeof input === "string" ? new Date(input) : input;
    const parts: string[] = [];

    if (opts.weekday === "long") parts.push(weekdaysLong[d.getDay()]);
    else if (opts.weekday === "short") parts.push(weekdaysShort[d.getDay()]);

    const dayPart =
      opts.day === "numeric" ? String(d.getDate()) : null;

    if (opts.month === "long") {
      parts.push(dayPart ? `${dayPart} ${monthsLong[d.getMonth()]}` : monthsLong[d.getMonth()]);
    } else if (opts.month === "short") {
      parts.push(dayPart ? `${monthsShort[d.getMonth()]} ${dayPart}` : monthsShort[d.getMonth()]);
    } else if (opts.month === "numeric") {
      parts.push(
        dayPart ? `${d.getMonth() + 1}/${dayPart}` : String(d.getMonth() + 1),
      );
    } else if (dayPart) {
      parts.push(dayPart);
    }

    if (opts.year === "numeric") parts.push(String(d.getFullYear()));

    return parts.join(", ");
  };
};
