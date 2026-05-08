"use client";

import { useState } from "react";
import { CreditCardIcon } from "@peja/icons/CreditCardIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@peja/ui/components/Select";

const CURRENCIES = ["EUR", "GBP", "USD", "CHF", "SEK", "NOK", "DKK"] as const;

type Currency = (typeof CURRENCIES)[number];

export const CurrencySelect = () => {
  const [currency, setCurrency] = useState<Currency>("EUR");

  return (
    <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
      <SelectTrigger className="border-none">
        <CreditCardIcon className="size-3.5 shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-40">
        {CURRENCIES.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
