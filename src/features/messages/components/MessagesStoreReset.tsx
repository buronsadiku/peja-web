"use client";

import { useEffect } from "react";
import { useMessagesStore } from "../store/useMessagesStore";

export const MessagesStoreReset = () => {
  const reset = useMessagesStore((s) => s.reset);

  useEffect(() => {
    reset();
    return () => reset();
  }, [reset]);

  return null;
};
