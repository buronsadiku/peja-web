import {
  PAPER_PRICE_PER_CARD,
  SHIPPING_PRICE,
  VAT_RATE,
  type OrderState,
} from "./types";

export type Pricing = {
  cardsTotal: number;
  shipping: number;
  subtotal: number;
  vat: number;
  total: number;
};

export const calcPricing = (state: OrderState): Pricing => {
  const cardsTotal = state.quantity * PAPER_PRICE_PER_CARD[state.paper];
  const shipping = SHIPPING_PRICE[state.shippingMethod];
  const subtotal = cardsTotal + shipping;
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;
  return { cardsTotal, shipping, subtotal, vat, total };
};

export const formatEuro = (amount: number) => `€${amount.toFixed(2)}`;
