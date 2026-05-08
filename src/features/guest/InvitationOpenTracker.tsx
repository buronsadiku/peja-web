"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { publicClient } from "@/lib/api/public-client";

type InvitationOpenTrackerProps = {
  slug: string;
};

export const InvitationOpenTracker = ({ slug }: InvitationOpenTrackerProps) => {
  const searchParams = useSearchParams();
  const channel = searchParams.get("via");

  useEffect(() => {
    if (!channel) return;
    publicClient.recordInvitationOpen(slug, channel).catch(() => {
      // analytics is fire-and-forget
    });
  }, [slug, channel]);

  return null;
};
