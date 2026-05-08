import { apiFetch } from "./server";
import type { KeepsakeCatalog, KeepsakeProductDetailResult } from "./types";

export const keepsakesApi = {
  catalog: () =>
    apiFetch<KeepsakeCatalog>("/keepsakes/catalog", {
      cache: "force-cache",
      next: { revalidate: 60, tags: ["keepsakes-catalog"] },
    }),

  productBySlug: (slug: string) =>
    apiFetch<KeepsakeProductDetailResult>(
      `/keepsakes/products/${encodeURIComponent(slug)}`,
      {
        cache: "force-cache",
        next: { revalidate: 60, tags: ["keepsakes-catalog"] },
      },
    ),
};
