import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";

import { decorate } from "../designTokens";
import { FilterTabs } from "./FilterTabs";
import { ProductCard } from "./ProductCard";
import type { KeepsakeProduct } from "@/lib/api/types";

type KeepsakesCollectionProps = {
  products: KeepsakeProduct[];
  eventId: string | null;
};

export const KeepsakesCollection = ({
  products,
  eventId,
}: KeepsakesCollectionProps) => {
  const t = useTranslations();
  const decorated = products.map(decorate);
  return (
    <div className="mt-9">
      <div className="tablet:flex-row tablet:items-end tablet:justify-between flex flex-col gap-4.5">
        <div>
          <Kicker className="text-muted-foreground">
            {t("keepsakes__collection__eyebrow")}
          </Kicker>
          <h2 className="type-h2 mt-1.5 font-semibold tracking-tight">
            {t("keepsakes__collection__title")}
          </h2>
        </div>
        <FilterTabs />
      </div>

      <div className="tablet:grid-cols-2 desktop:grid-cols-3 mt-4.5 grid gap-4.5">
        {decorated.map((product) => (
          <ProductCard key={product.sku} product={product} eventId={eventId} />
        ))}
      </div>
    </div>
  );
};
