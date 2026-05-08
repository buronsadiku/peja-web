import { clientFetch } from "./client";
import type { CheckoutSessionInput, CheckoutSessionResult } from "./types";

export const paymentsClient = {
  createCheckoutSession: (input: CheckoutSessionInput) =>
    clientFetch<CheckoutSessionResult>("/payments/checkout-session", {
      method: "POST",
      body: input,
    }),
};
