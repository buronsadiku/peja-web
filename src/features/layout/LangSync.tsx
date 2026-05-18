"use client";

import { useEffect } from "react";

export const LangSync = ({ locale }: { locale: string }) => {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
};
