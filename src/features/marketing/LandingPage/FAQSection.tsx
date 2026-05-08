import { useTranslations } from "next-intl";
import { SectionTitle } from "../../../components/SectionTitle";
import { FAQ_ITEM_KEYS } from "./constants";
import { ArrowRightIcon } from "@peja/icons/ArrowRightIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@peja/ui/components/Accordion";
import { Kicker } from "@peja/ui/components/Kicker";

export const FAQSection = () => {
  const t = useTranslations();

  const items = FAQ_ITEM_KEYS.map((k) => ({ q: t(k.q), a: t(k.a) }));

  return (
    <section>
      <div className="section-container">
        <div className="tablet:gap-20 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <Kicker className="text-primary">
              {t("marketing__faq__eyebrow")}
            </Kicker>
            <SectionTitle className="mt-4">
              <span className="block">{t("marketing__faq__title_line1")}</span>
              <span className="text-primary block italic">
                {t("marketing__faq__title_line2")}
              </span>
            </SectionTitle>
            <p className="text-muted-foreground type-body-large mt-6 max-w-90 leading-relaxed">
              {t("marketing__faq__subtitle")}
            </p>
            <a
              href={`mailto:${t("marketing__faq__email")}`}
              className="text-foreground type-body-small mt-5 inline-flex items-center gap-2 font-semibold"
            >
              {t("marketing__faq__email")}
              <ArrowRightIcon className="size-3" />
            </a>
          </div>

          <Accordion type="single" collapsible defaultValue="item-0">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="type-h3 py-5.5 font-semibold no-underline hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground type-body max-w-160 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
