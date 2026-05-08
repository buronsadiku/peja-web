import { useTranslations } from "next-intl";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@peja/ui/components/Kicker";
import { KeepsakeCard } from "./KeepsakeCard";
import { KEEPSAKE_PRODUCT_KEYS } from "./constants";

export const KeepsakesStorePage = () => {
  const t = useTranslations();

  const products = KEEPSAKE_PRODUCT_KEYS.map((k) => ({ name: t(k.name), description: t(k.description), price: t(k.price) }));

  return (
    <>
      <section>
        <div className="section-container">
          <Kicker className="text-primary">{t("marketing__keepsakes__eyebrow")}</Kicker>
          <SectionTitle as="h1" className="mt-4 leading-none tracking-tighter">
            <span className="text-foreground block">{t("marketing__keepsakes__title_line1")}</span>
            <span className="text-primary block italic">{t("marketing__keepsakes__title_line2")}</span>
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__keepsakes__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container">
          <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
            {products.map((product) => (
              <KeepsakeCard
                key={product.name}
                name={product.name}
                description={product.description}
                price={product.price}
              />
            ))}
          </div>
          <p className="text-muted-foreground type-body-small mt-10">
            {t("marketing__keepsakes__shipping_note")}
          </p>
        </div>
      </section>
    </>
  );
};
