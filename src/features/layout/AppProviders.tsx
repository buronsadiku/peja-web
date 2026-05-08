import type { ReactNode } from "react";
import { QueryProvider } from "@/lib/query/QueryProvider";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <QueryProvider>{children}</QueryProvider>;
};
