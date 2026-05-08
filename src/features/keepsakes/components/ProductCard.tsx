import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@peja/ui/components/Button";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { formatPrice, type DesignedProduct } from "../designTokens";
import { ProductTag } from "./ProductTag";
import { slugForSku } from "../slug";

type ProductCardProps = {
  product: DesignedProduct;
  eventId: string | null;
  tag?: string;
};

export const ProductCard = ({ product, eventId, tag }: ProductCardProps) => {
  const t = useTranslations();
  const { name, description, priceCents, currency, timelineDays, design } =
    product;
  const dark = Boolean(design.dark);
  const canOrder = Boolean(eventId);
  const slug = slugForSku(product.sku);

  return (
    <div className="rounded-20 border-border bg-card flex flex-col overflow-hidden border">
      <div
        className="relative flex h-45 items-center justify-center p-5"
        style={{ background: design.gradient }}
      >
        <p
          className="type-h2 text-center leading-tight font-semibold italic"
          style={{
            color: dark ? "#fff" : "var(--foreground)",
            textShadow: dark ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
          }}
        >
          {t(design.headlineKey)}
        </p>
        {tag && <ProductTag label={tag} dark={dark} />}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4.5">
        <div className="flex items-baseline justify-between">
          <p className="type-h4 font-semibold">{name}</p>
          <p className="type-body-large text-primary font-serif font-semibold">
            {formatPrice(priceCents, currency)}
          </p>
        </div>
        <p className="type-caption text-muted-foreground tracking-wider">
          {t(design.subtitleKey)}
          {timelineDays
            ? ` · ${t("keepsakes__product__ships_in", { days: timelineDays })}`
            : ""}
        </p>
        <p className="type-body-small text-foreground mt-1.5 leading-relaxed">
          {t(design.taglineKey) || description}
        </p>
        <div className="mt-auto flex gap-2 pt-3.5">
          {canOrder ? (
            <Button
              asChild
              size="sm"
              className="bg-foreground text-background hover:bg-foreground/90 flex-1 rounded-full"
            >
              <Link href={`/app/keepsakes/${slug}`}>
                {t("keepsakes__product__order")}{" "}
                <ArrowRightIcon width={12} height={12} />
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              disabled
              className="bg-foreground text-background flex-1 rounded-full"
            >
              {t("keepsakes__product__create_first")}
            </Button>
          )}
          <Button
            disabled
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            {t("keepsakes__product__preview")}
          </Button>
        </div>
      </div>
    </div>
  );
};
