export type PaperKey = "standard" | "letter" | "vellum";
export type ShippingMethodKey = "standard" | "express" | "priority";

export type OrderState = {
  quantity: number;
  paper: PaperKey;
  cardColor: string;
  inkColor: string;
  proofConfirmed: boolean;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  country: string;
  phone: string;
  shippingMethod: ShippingMethodKey;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardholderName: string;
};

export const PAPER_PRICE_PER_CARD: Record<PaperKey, number> = {
  standard: 1.89,
  letter: 3.09,
  vellum: 4.29,
};

export const SHIPPING_PRICE: Record<ShippingMethodKey, number> = {
  standard: 12,
  express: 24,
  priority: 48,
};

export const VAT_RATE = 0.21;
