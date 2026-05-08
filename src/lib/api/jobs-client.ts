import { clientFetch } from "./client";
import type { Job } from "./types";

export const jobsClient = {
  get: (jobId: string) => clientFetch<{ job: Job }>(`/jobs/${jobId}`),
};
