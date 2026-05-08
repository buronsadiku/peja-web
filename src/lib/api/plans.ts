import { apiFetch } from "./server";
import type { Plan } from "./types";

export const plansApi = {
  list: () => apiFetch<{ plans: Plan[] }>("/plans"),
};
