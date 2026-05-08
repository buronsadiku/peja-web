import { useTranslations } from "next-intl";
import { Kicker } from "@peja/ui/components/Kicker";
import { ShippingMethodOption } from "./ShippingMethodOption";
import { AddressField } from "./AddressField";
import { formatEuro } from "../pricing";
import { SHIPPING_PRICE, type OrderState, type ShippingMethodKey } from "../types";

type ShippingStepProps = {
  state: OrderState;
  setField: (
    field: keyof Pick<
      OrderState,
      | "firstName"
      | "lastName"
      | "address1"
      | "address2"
      | "city"
      | "postcode"
      | "country"
      | "phone"
    >,
    value: string,
  ) => void;
  setShippingMethod: (m: ShippingMethodKey) => void;
};

export const ShippingStep = ({
  state,
  setField,
  setShippingMethod,
}: ShippingStepProps) => {
  const t = useTranslations();
  const methods: {
    key: ShippingMethodKey;
    title: string;
    description: string;
  }[] = [
    {
      key: "standard",
      title: t("qr_cards_order__shipping__standard_t"),
      description: t("qr_cards_order__shipping__standard_d"),
    },
    {
      key: "express",
      title: t("qr_cards_order__shipping__express_t"),
      description: t("qr_cards_order__shipping__express_d"),
    },
    {
      key: "priority",
      title: t("qr_cards_order__shipping__priority_t"),
      description: t("qr_cards_order__shipping__priority_d"),
    },
  ];

  return (
    <div>
      <Kicker className="text-primary">
        {t("qr_cards_order__shipping__eyebrow")}
      </Kicker>
      <h1 className="type-h1 mt-2.5 leading-tight font-semibold tracking-tight">
        {t("qr_cards_order__shipping__title_a")}{" "}
        <span className="text-primary italic">
          {t("qr_cards_order__shipping__title_b")}
        </span>
      </h1>

      <div className="mt-6 grid gap-3.5 tablet:grid-cols-2">
        <AddressField
          label={t("qr_cards_order__shipping__first_name")}
          value={state.firstName}
          onChange={(v) => setField("firstName", v)}
        />
        <AddressField
          label={t("qr_cards_order__shipping__last_name")}
          value={state.lastName}
          onChange={(v) => setField("lastName", v)}
        />
      </div>
      <div className="mt-3.5">
        <AddressField
          label={t("qr_cards_order__shipping__address1")}
          value={state.address1}
          onChange={(v) => setField("address1", v)}
        />
      </div>
      <div className="mt-3.5">
        <AddressField
          label={t("qr_cards_order__shipping__address2")}
          value={state.address2}
          onChange={(v) => setField("address2", v)}
        />
      </div>
      <div className="mt-3.5 grid gap-3.5 tablet:grid-cols-3">
        <AddressField
          label={t("qr_cards_order__shipping__city")}
          value={state.city}
          onChange={(v) => setField("city", v)}
        />
        <AddressField
          label={t("qr_cards_order__shipping__postcode")}
          value={state.postcode}
          onChange={(v) => setField("postcode", v)}
        />
        <AddressField
          label={t("qr_cards_order__shipping__country")}
          value={state.country}
          onChange={(v) => setField("country", v)}
        />
      </div>
      <div className="mt-3.5">
        <AddressField
          label={t("qr_cards_order__shipping__phone")}
          value={state.phone}
          onChange={(v) => setField("phone", v)}
          help={t("qr_cards_order__shipping__phone_help")}
        />
      </div>

      <div className="mt-8">
        <p className="type-overline text-muted-foreground mb-2.5 font-semibold tracking-wider">
          {t("qr_cards_order__shipping__speed_label")}
        </p>
        <div className="flex flex-col gap-2.5">
          {methods.map((m) => (
            <ShippingMethodOption
              key={m.key}
              title={m.title}
              description={m.description}
              priceLabel={formatEuro(SHIPPING_PRICE[m.key])}
              selected={state.shippingMethod === m.key}
              onSelect={() => setShippingMethod(m.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
