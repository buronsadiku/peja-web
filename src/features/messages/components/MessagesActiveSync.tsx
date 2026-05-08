"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useMessagesStore } from "../store/useMessagesStore";

export const MessagesActiveSync = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setActiveMessageId = useMessagesStore((s) => s.setActiveMessageId);

  useEffect(() => {
    const active = searchParams.get("active");
    if (!active) return;
    setActiveMessageId(active);
    router.replace("/app/messages");
  }, [searchParams, router, setActiveMessageId]);

  return null;
};
