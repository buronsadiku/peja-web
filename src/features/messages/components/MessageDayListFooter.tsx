"use client";

import { useTranslations } from "next-intl";

export const MessageDayListFooter = () => {
  const t = useTranslations();
  return (
    <div className="border-border type-body-small text-muted-foreground border-t p-8 text-center">
      {t.rich("messages__list__footer", {
        link: (chunks) => (
          <button
            type="button"
            className="text-primary cursor-pointer font-semibold"
          >
            {chunks}
          </button>
        ),
      })}
    </div>
  );
};
