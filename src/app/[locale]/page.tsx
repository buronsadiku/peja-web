import { useTranslations } from "next-intl";

const HomePage = () => {
  const t = useTranslations();

  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="text-foreground text-3xl font-bold">{t("home__title")}</h1>
    </main>
  );
};

export default HomePage;
