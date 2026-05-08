import { clientFetch } from "./client";
import type { Plan } from "./types";

export const plansClient = {
  list: () => clientFetch<{ plans: Plan[] }>("/plans"),
};
