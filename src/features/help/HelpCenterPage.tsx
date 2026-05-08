import { useTranslations } from "next-intl";
import { BookIcon } from "@peja/icons/BookIcon";
import { MailIcon } from "@peja/icons/MailIcon";
import { MessageSquareIcon } from "@peja/icons/MessageSquareIcon";
import { VideoIcon } from "@peja/icons/VideoIcon";
import { HelpFaqItem } from "./components/HelpFaqItem";
import { HelpResourceCard } from "./components/HelpResourceCard";

const FAQ_KEYS = [
  "getting_started",
  "kiosk_mode",
  "qr_code",
  "languages",
  "messages_storage",
  "keepsakes",
  "billing",
] as const;

export const HelpCenterPage = () => {
  const t = useTranslations();

  const resources = [
    {
      title: t("help__resource__guide__title"),
      description: t("help__resource__guide__desc"),
      icon: BookIcon,
      href: "https://peja.help/guide",
      external: true,
    },
    {
      title: t("help__resource__videos__title"),
      description: t("help__resource__videos__desc"),
      icon: VideoIcon,
      href: "https://peja.help/videos",
      external: true,
    },
    {
      title: t("help__resource__chat__title"),
      description: t("help__resource__chat__desc"),
      icon: MessageSquareIcon,
      href: "mailto:support@peja.app",
    },
    {
      title: t("help__resource__email__title"),
      description: t("help__resource__email__desc"),
      icon: MailIcon,
      href: "mailto:support@peja.app",
    },
  ];

  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
      <div className="rounded-20 bg-card tablet:p-12 desktop:p-14 desktop:py-16 relative mb-20 p-8 py-10">
        <div className="bg-primary/10 pointer-events-none absolute -top-20 -right-20 size-80 rounded-full" />
        <div className="bg-secondary/10 pointer-events-none absolute -bottom-24 -left-16 size-60 rounded-full" />
        <div className="relative flex max-w-2xl flex-col gap-4">
          <span className="type-overline text-primary tracking-widest">
            {t("help__hero__eyebrow")}
          </span>
          <h1
            className="font-serif tracking-tight"
            style={{ fontSize: "3rem", lineHeight: 1.15, fontWeight: 700 }}
          >
            {t("help__hero__title_a")}{" "}
            <span className="text-primary italic">
              {t("help__hero__title_b")}
            </span>
            .
          </h1>
          <p className="type-body text-muted-foreground max-w-xl leading-relaxed">
            {t("help__hero__subtitle")}
          </p>
        </div>
      </div>

      <div>
        <h2 className="type-h2 tracking-tight">
          {t("help__resources__title")}
        </h2>
        <div className="tablet:grid-cols-2 mt-3.5 grid gap-3.5">
          {resources.map((r) => (
            <HelpResourceCard key={r.title} {...r} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="type-h2 tracking-tight">
          {t("help__faq__title")}
        </h2>
        <p className="type-body-small text-muted-foreground mt-1.5">
          {t("help__faq__subtitle")}
        </p>
        <div className="mt-3.5 flex flex-col gap-2.5">
          {FAQ_KEYS.map((key) => (
            <HelpFaqItem
              key={key}
              question={t(`help__faq__${key}__q`)}
              answer={t(`help__faq__${key}__a`)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-20 bg-foreground text-background tablet:p-8 relative flex flex-col items-start gap-3 p-6">
        <span className="type-overline text-secondary tracking-widest">
          {t("help__contact__eyebrow")}
        </span>
        <h3 className="type-h3 font-semibold tracking-tight">
          {t("help__contact__title")}
        </h3>
        <p className="type-body-small text-background/75 max-w-xl leading-relaxed">
          {t("help__contact__body")}
        </p>
        <a
          href="mailto:support@peja.app"
          className="bg-secondary text-foreground type-body-small mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold"
        >
          <MailIcon width={14} height={14} />
          support@peja.app
        </a>
      </div>
    </div>
  );
};
