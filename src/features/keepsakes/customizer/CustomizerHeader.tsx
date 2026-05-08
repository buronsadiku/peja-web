import { Link } from "@/i18n/navigation";
import { Kicker } from "@peja/ui/components/Kicker";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import { formatPrice } from "../designTokens";
import type { KeepsakeProductDetail } from "@/lib/api/types";
import type { KeepsakeDesign } from "../designTokens";

type CustomizerHeaderProps = {
  product: KeepsakeProductDetail;
  design: KeepsakeDesign;
};

export const CustomizerHeader = ({
  product,
  design,
}: CustomizerHeaderProps) => {
  const dark = Boolean(design.dark);
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/app/keepsakes"
        className="text-muted-foreground hover:text-foreground type-caption inline-flex items-center gap-1 self-start tracking-wider"
      >
        <ArrowRightIcon className="rotate-180" width={12} height={12} />
        Keepsakes
      </Link>
      <div
        className="rounded-20 relative flex h-40 items-center justify-center px-6"
        style={{ background: design.gradient }}
      >
        <p
          className="type-h1 text-center leading-tight font-semibold italic"
          style={{
            color: dark ? "#fff" : "var(--foreground)",
            textShadow: dark ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
          }}
        >
          {product.name}
        </p>
      </div>
      <div className="flex items-baseline justify-between">
        <div>
          <Kicker className="text-muted-foreground">{product.category}</Kicker>
          <h1 className="type-h2 mt-1 font-semibold">
            {product.name}
          </h1>
          {product.description && (
            <p className="type-body-small text-muted-foreground mt-2 max-w-180 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
        <span className="type-h3 text-primary font-semibold">
          {formatPrice(product.basePriceCents, product.currency)}
        </span>
      </div>
    </div>
  );
};
