"use client";

import { useState, type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  environmentManager,
} from "@tanstack/react-query";

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (
            error instanceof Error &&
            "status" in error &&
            (error as { status?: number }).status &&
            (error as { status: number }).status < 500
          ) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });

let browserClient: QueryClient | undefined;
const getQueryClient = () => {
  if (environmentManager.isServer()) return makeQueryClient();
  if (!browserClient) browserClient = makeQueryClient();
  return browserClient;
};

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [client] = useState(getQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
