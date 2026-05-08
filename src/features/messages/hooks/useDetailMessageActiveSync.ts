"use client";

import { useEffect } from "react";
import { useMessagesStore } from "../store/useMessagesStore";

export const useDetailMessageActiveSync = (messageId: string) => {
  const setActiveMessageId = useMessagesStore((s) => s.setActiveMessageId);

  useEffect(() => {
    setActiveMessageId(messageId);
    return () => setActiveMessageId(null);
  }, [messageId, setActiveMessageId]);
};
