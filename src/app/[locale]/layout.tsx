import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LangSync } from "@/features/layout/LangSync";
import { Providers } from "@/features/layout/Providers";
import { SiteNav } from "@/features/layout/SiteNav";
import { SiteFooter } from "@/features/layout/SiteFooter";

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <LangSync locale={locale} />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </Providers>
    </NextIntlClientProvider>
  );
}
