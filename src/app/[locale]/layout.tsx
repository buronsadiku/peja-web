import { Rubik, Noto_Sans } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "optional",
  adjustFontFallback: true,
});
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "optional",
  adjustFontFallback: true,
});

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
    <html
      lang={locale}
      className={`${rubik.variable} ${notoSans.variable} h-dvh antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans flex max-h-dvh flex-1 flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
