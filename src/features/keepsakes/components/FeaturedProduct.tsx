import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@peja/ui/components/Button";
import { Kicker } from "@peja/ui/components/Kicker";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { formatPrice, type DesignedProduct } from "../designTokens";
import { FeaturePill } from "./FeaturePill";
import { BookMock } from "./BookMock";
import { slugForSku } from "../slug";

type FeaturedProductProps = {
  product: DesignedProduct;
  eventId: string | null;
};

export const FeaturedProduct = ({ product, eventId }: FeaturedProductProps) => {
  const t = useTranslations();
  const { name, description, priceCents, currency, timelineDays, design } =
    product;
  const canOrder = Boolean(eventId);
  const slug = slugForSku(product.sku);

  const features = [
    t("keepsakes__featured__feature_pages"),
    t("keepsakes__featured__feature_qr"),
    t("keepsakes__featured__feature_linen"),
  ];

  return (
    <div
      className="rounded-24 tablet:p-8 desktop:grid-cols-[1fr_360px] relative grid items-center gap-7 overflow-hidden p-6"
      style={{ background: design.gradient }}
    >
      <span className="type-overline absolute top-5 right-6 tracking-[2px] text-black/55">
        {t("keepsakes__featured__most_ordered")}
      </span>
      <div>
        <Kicker className="tracking-[2px] text-black/55">
          {name} &middot; {formatPrice(priceCents, currency)}
        </Kicker>
        <h2 className="tablet:type-h1 type-h1 mt-2 leading-none font-semibold">
          {t("keepsakes__featured__title_a")}
          <br />
          {t("keepsakes__featured__title_b")}
        </h2>
        <p className="type-body-small mt-3 max-w-105 leading-relaxed text-black/75">
          {t(design.taglineKey) || description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {features.map((b) => (
            <FeaturePill key={b} label={b} />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          {canOrder ? (
            <Button
              asChild
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full"
            >
              <Link href={`/app/keepsakes/${slug}`}>
                {t("keepsakes__featured__order_now")}{" "}
                <ArrowRightIcon width={13} height={13} />
              </Link>
            </Button>
          ) : (
            <Button
              size="lg"
              disabled
              className="bg-foreground text-background rounded-full"
            >
              {t("keepsakes__featured__create_event_first")}
            </Button>
          )}
          {timelineDays && (
            <span className="type-caption text-black/65">
              {t("keepsakes__featured__ships_in", { days: timelineDays })}
            </span>
          )}
        </div>
      </div>
      <BookMock />
    </div>
  );
};
