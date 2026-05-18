import { useTranslations } from "next-intl";

const NotFound = () => {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-foreground text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">{t("not_found")}</p>
    </div>
  );
};

export default NotFound;
