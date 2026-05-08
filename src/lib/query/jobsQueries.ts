"use client";

import { useQuery } from "@tanstack/react-query";
import { jobsClient } from "@/lib/api/jobs-client";

const JOB_DONE_STATUSES = new Set(["completed", "failed", "cancelled"]);

export const usePollJob = (jobId: string | null) =>
  useQuery({
    queryKey: ["jobs", jobId ?? ""],
    queryFn: () => jobsClient.get(jobId!),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.job.status;
      if (!status) return 2000;
      return JOB_DONE_STATUSES.has(status) ? false : 2000;
    },
    refetchOnWindowFocus: false,
  });
