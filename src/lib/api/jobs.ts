import { apiFetch } from "./server";
import type { Job } from "./types";

export const jobsApi = {
  get: (jobId: string) => apiFetch<{ job: Job }>(`/jobs/${jobId}`),
};
